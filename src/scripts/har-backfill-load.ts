/**
 * HAR bulk backfill — Stage 2: load.
 *
 * Reads the JSONL files produced by har-backfill-fetch and loads them into the
 * database in throttled bulk batches:
 *   - listings not yet in the DB are inserted via bulkCreate (one INSERT per
 *     batch instead of per row — far less connection/WAL pressure on RDS)
 *   - listings already in the DB get their mlsStatus/status reconciled, which
 *     also repairs any previously imported Sold/Expired rows that were
 *     mistakenly stored as 'published'
 *
 * Resumable: a per-file line checkpoint lives in <dir>/state/load-<file>.json.
 *
 * Environment:
 *   DB_* / DB_SSL             database connection (DB_SSL=true for RDS)
 *   HAR_API_URL               required by the shared importer (mapping reuse)
 *   HAR_IMPORT_USER_ID        owner user for imported properties
 *   HAR_BACKFILL_DIR          input dir (default ./har-backfill-data)
 *   HAR_LOAD_BATCH_SIZE       rows per bulk insert (default 500)
 *   HAR_LOAD_DELAY_MS         delay between batches (default 200)
 *
 * Usage:  npm run har:backfill:load
 */
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { Property } from '../properties/property.model';
import { User } from '../users/user.model';
import { HarImporter, HarListing, isPubliclyDisplayable, listingMlsStatus } from './har-import';

dotenv.config();

const IN_DIR = path.resolve(process.env.HAR_BACKFILL_DIR || './har-backfill-data');
const STATE_DIR = path.join(IN_DIR, 'state');
const BATCH_SIZE = parseInt(process.env.HAR_LOAD_BATCH_SIZE || '500', 10);
const DELAY_MS = parseInt(process.env.HAR_LOAD_DELAY_MS || '200', 10);

const totals = { inserted: 0, reconciled: 0, unchanged: 0, errors: 0 };

function makeSequelize(): Sequelize {
  return new Sequelize(
    process.env.DB_NAME || 'real_estate',
    process.env.DB_USERNAME || 'postgres',
    process.env.DB_PASSWORD || 'admin',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      dialect: 'postgres',
      ...(process.env.DB_SSL === 'true'
        ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
        : {}),
      logging: false,
      models: [Property, User],
      pool: { max: 3, min: 0, acquire: 60000, idle: 10000 },
    },
  );
}

function checkpointPath(file: string): string {
  return path.join(STATE_DIR, `load-${path.basename(file, '.jsonl')}.json`);
}

function readCheckpoint(file: string): number {
  const p = checkpointPath(file);
  if (fs.existsSync(p)) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8')).processedLines || 0;
    } catch {
      /* start over */
    }
  }
  return 0;
}

function writeCheckpoint(file: string, processedLines: number): void {
  fs.writeFileSync(
    checkpointPath(file),
    JSON.stringify({ processedLines, updatedAt: new Date().toISOString() }, null, 2),
  );
}

async function processBatch(importer: HarImporter, batch: HarListing[]): Promise<void> {
  const byMls = new Map<string, HarListing>();
  for (const l of batch) {
    const mls = l.ListingId || l.ListingKey;
    if (mls) byMls.set(mls, l);
  }
  const mlsNumbers = [...byMls.keys()];
  if (mlsNumbers.length === 0) return;

  const existing = await Property.findAll({
    where: { mlsNumber: { [Op.in]: mlsNumbers } },
    attributes: ['id', 'mlsNumber', 'status', 'mlsStatus'],
    raw: true,
  });
  const existingByMls = new Map(existing.map((e: any) => [e.mlsNumber, e]));

  // 1. Insert listings we don't have yet
  const toInsert: any[] = [];
  for (const [mls, listing] of byMls) {
    if (existingByMls.has(mls)) continue;
    try {
      toInsert.push(importer.mapHarToProperty(listing));
    } catch (err: any) {
      totals.errors++;
      console.error(`  ❌ mapping failed for ${mls}: ${err.message}`);
    }
  }
  if (toInsert.length > 0) {
    await Property.bulkCreate(toInsert, { validate: false });
    totals.inserted += toInsert.length;
  }

  // 2. Reconcile status on listings we already have (repairs earlier imports
  //    that stored off-market listings as 'published')
  const toPublic: string[] = [];
  const toOffMarket: string[] = [];
  const statusUpdates: Array<{ id: string; mlsStatus: string }> = [];
  for (const [mls, listing] of byMls) {
    const row: any = existingByMls.get(mls);
    if (!row) continue;
    const wantStatus = isPubliclyDisplayable(listing) ? 'published' : 'off_market';
    const wantMls = listingMlsStatus(listing) || null;
    const statusDiffers = row.status !== wantStatus && row.status !== 'draft';
    const mlsDiffers = row.mlsStatus !== wantMls;
    if (!statusDiffers && !mlsDiffers) {
      totals.unchanged++;
      continue;
    }
    if (statusDiffers) (wantStatus === 'published' ? toPublic : toOffMarket).push(row.id);
    if (mlsDiffers && wantMls) statusUpdates.push({ id: row.id, mlsStatus: wantMls });
  }
  if (toPublic.length > 0) {
    await Property.update({ status: 'published' }, { where: { id: { [Op.in]: toPublic } } });
  }
  if (toOffMarket.length > 0) {
    await Property.update({ status: 'off_market' }, { where: { id: { [Op.in]: toOffMarket } } });
  }
  // mlsStatus differs per row; group by value to keep it to a few UPDATEs
  const byMlsStatus = new Map<string, string[]>();
  for (const u of statusUpdates) {
    const ids = byMlsStatus.get(u.mlsStatus) || [];
    ids.push(u.id);
    byMlsStatus.set(u.mlsStatus, ids);
  }
  for (const [mlsStatus, ids] of byMlsStatus) {
    await Property.update({ mlsStatus }, { where: { id: { [Op.in]: ids } } });
  }
  totals.reconciled += new Set([...toPublic, ...toOffMarket, ...statusUpdates.map((u) => u.id)]).size;
}

async function loadFile(importer: HarImporter, file: string): Promise<void> {
  const startLine = readCheckpoint(file);
  console.log(`\n📂 Loading ${path.basename(file)}${startLine ? ` (resuming at line ${startLine})` : ''}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });

  let lineNo = 0;
  let processed = startLine;
  let batch: HarListing[] = [];

  for await (const line of rl) {
    lineNo++;
    if (lineNo <= startLine || !line.trim()) continue;
    try {
      batch.push(JSON.parse(line));
    } catch {
      totals.errors++;
      continue;
    }
    if (batch.length >= BATCH_SIZE) {
      await processBatch(importer, batch);
      processed = lineNo;
      writeCheckpoint(file, processed);
      process.stdout.write(
        `  📦 line ${processed} | inserted ${totals.inserted}, reconciled ${totals.reconciled}, unchanged ${totals.unchanged}\r\n`,
      );
      batch = [];
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }
  if (batch.length > 0) {
    await processBatch(importer, batch);
    writeCheckpoint(file, lineNo);
  }
  console.log(`✅ ${path.basename(file)} done (${lineNo} lines)`);
}

async function main() {
  if (!fs.existsSync(IN_DIR)) {
    throw new Error(`Backfill dir not found: ${IN_DIR} — run har:backfill:fetch first`);
  }
  fs.mkdirSync(STATE_DIR, { recursive: true });

  const files = fs
    .readdirSync(IN_DIR)
    .filter((f) => f.endsWith('.jsonl'))
    .map((f) => path.join(IN_DIR, f));
  if (files.length === 0) {
    throw new Error(`No .jsonl files in ${IN_DIR} — run har:backfill:fetch first`);
  }

  const sequelize = makeSequelize();
  await sequelize.authenticate();
  console.log('✅ Database connection established');

  const userId = process.env.HAR_IMPORT_USER_ID || '';
  const user = await User.findByPk(userId);
  if (!user) throw new Error(`HAR_IMPORT_USER_ID user not found: ${userId}`);

  // Reuse the exact mapping the periodic importer uses
  const importer = new HarImporter(sequelize);

  console.log(`🚀 HAR bulk backfill — load stage (${files.length} files, batch ${BATCH_SIZE})`);
  for (const file of files) {
    await loadFile(importer, file);
  }

  console.log('\n📊 Load summary:');
  console.log(`   ✅ Inserted:   ${totals.inserted}`);
  console.log(`   🔁 Reconciled: ${totals.reconciled}`);
  console.log(`   ⏭️  Unchanged:  ${totals.unchanged}`);
  console.log(`   ❌ Errors:     ${totals.errors}`);

  await sequelize.close();
  console.log('\n✨ Load completed!');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
