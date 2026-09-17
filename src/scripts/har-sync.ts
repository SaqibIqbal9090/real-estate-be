/**
 * Incremental HAR sync.
 *
 * Replaces the old periodic import, which walked the entire feed by
 * ListingKey and only ever INSERTed — so a listing that sold, changed price,
 * or had photos replaced was never updated once imported. That left sold
 * listings publicly displayed and prices permanently stale.
 *
 * This fetches only what changed since the last run (RESO's
 * ModificationTimestamp, the field the standard provides for exactly this)
 * and upserts: new listings are inserted, existing ones are refreshed in
 * place, including their status and display-consent flags.
 *
 * Environment:
 *   HAR_API_URL          required — OData URL incl. access_token
 *   HAR_IMPORT_USER_ID   owner for imported listings
 *   HAR_SYNC_FILTER      base filter (default: residential sale + lease)
 *   HAR_SYNC_SINCE       ISO date to start from, overriding the watermark
 *   HAR_SYNC_OVERLAP_MIN minutes to re-check before the watermark (default 15)
 *   HAR_SYNC_MAX_PAGES   safety cap per run (default 200 = 40k listings)
 *   DB_SSL=true          for RDS
 *
 * Usage:  npm run har:sync
 */
import axios from 'axios';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as dotenv from 'dotenv';
import { Property } from '../properties/property.model';
import { User } from '../users/user.model';
import { HarImporter, HarListing } from './har-import';

dotenv.config();

const PAGE_SIZE = 200;
const DELAY_MS = parseInt(process.env.HAR_SYNC_DELAY_MS || '250', 10);
const MAX_PAGES = parseInt(process.env.HAR_SYNC_MAX_PAGES || '200', 10);
const OVERLAP_MIN = parseInt(process.env.HAR_SYNC_OVERLAP_MIN || '15', 10);
const BASE_FILTER =
  process.env.HAR_SYNC_FILTER ||
  "(PropertyType eq 'Residential' or PropertyType eq 'Residential Lease')";

const stats = { fetched: 0, inserted: 0, updated: 0, unchanged: 0, errors: 0 };

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
      pool: { max: 4, min: 0, acquire: 60000, idle: 10000 },
    },
  );
}

/**
 * Where to resume from: the newest modificationTimestamp we hold, rewound by
 * a short overlap so records written while the previous run was in flight
 * aren't skipped. Re-processing a few listings is harmless (upsert), missing
 * one is not.
 */
async function resolveWatermark(): Promise<Date> {
  if (process.env.HAR_SYNC_SINCE) {
    const forced = new Date(process.env.HAR_SYNC_SINCE);
    if (!Number.isNaN(forced.getTime())) return forced;
  }

  const newest = (await Property.max('modificationTimestamp')) as Date | null;
  if (newest instanceof Date && !Number.isNaN(newest.getTime())) {
    return new Date(newest.getTime() - OVERLAP_MIN * 60_000);
  }

  // Nothing stored yet (first run after the column was added): start a day back
  // rather than walking the entire feed.
  const fallback = new Date(Date.now() - 24 * 60 * 60 * 1000);
  console.log('⚠️  No stored modificationTimestamp — starting from 24h ago');
  return fallback;
}

function buildUrl(since: Date, lastKey: string | null): string {
  const urlObj = new URL(process.env.HAR_API_URL || '');
  const accessToken = urlObj.searchParams.get('access_token') || '';
  const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

  let filter = `${BASE_FILTER} and (ModificationTimestamp gt ${since.toISOString()})`;
  // Keyset pagination: ModificationTimestamp alone isn't unique enough to page
  // on safely, so page by ListingKey within the changed set.
  if (lastKey) filter += ` and (ListingKey gt '${lastKey}')`;

  return (
    `${baseUrl}?access_token=${accessToken}` +
    `&$filter=${encodeURIComponent(filter)}` +
    `&$top=${PAGE_SIZE}&$orderby=ListingKey`
  );
}

async function fetchPage(url: string, attempt = 1): Promise<HarListing[]> {
  try {
    const res = await axios.get(url, { timeout: 60000 });
    if (!res.data?.value || !Array.isArray(res.data.value)) {
      throw new Error('invalid OData response');
    }
    return res.data.value;
  } catch (err: any) {
    if (attempt >= 4) throw err;
    const backoff = attempt * 5000;
    console.warn(`  ⚠️  Fetch failed (${attempt}): ${err.message} — retrying in ${backoff}ms`);
    await new Promise((r) => setTimeout(r, backoff));
    return fetchPage(url, attempt + 1);
  }
}

async function upsertBatch(importer: HarImporter, listings: HarListing[], userId: string) {
  const byMls = new Map<string, HarListing>();
  for (const l of listings) {
    const mls = l.ListingId || l.ListingKey;
    if (mls) byMls.set(mls, l);
  }
  if (byMls.size === 0) return;

  const existing = (await Property.findAll({
    where: { mlsNumber: { [Op.in]: [...byMls.keys()] } },
    attributes: ['id', 'mlsNumber', 'userId', 'modificationTimestamp'],
    raw: true,
  })) as any[];
  const existingByMls = new Map(existing.map((e) => [e.mlsNumber, e]));

  const toInsert: any[] = [];

  for (const [mls, listing] of byMls) {
    let mapped: any;
    try {
      mapped = importer.mapHarToProperty(listing);
    } catch (err: any) {
      stats.errors++;
      console.error(`  ❌ mapping failed for ${mls}: ${err.message}`);
      continue;
    }

    const row = existingByMls.get(mls);
    if (!row) {
      toInsert.push(mapped);
      continue;
    }

    // Never overwrite a listing a real user owns — HAR originals are owned by
    // the import user, and the sell flow makes a separate copy.
    if (row.userId !== userId) {
      stats.unchanged++;
      continue;
    }

    // Skip if our copy is already at least as fresh as the feed's.
    const incoming = mapped.modificationTimestamp
      ? new Date(mapped.modificationTimestamp).getTime()
      : null;
    const current = row.modificationTimestamp
      ? new Date(row.modificationTimestamp).getTime()
      : null;
    if (incoming !== null && current !== null && incoming <= current) {
      stats.unchanged++;
      continue;
    }

    // id/userId/createdAt stay as they are; everything else is refreshed.
    const { userId: _u, ...updates } = mapped;
    try {
      await Property.update(updates, { where: { id: row.id } });
      stats.updated++;
    } catch (err: any) {
      stats.errors++;
      console.error(`  ❌ update failed for ${mls}: ${err.message}`);
    }
  }

  if (toInsert.length > 0) {
    try {
      await Property.bulkCreate(toInsert, { validate: false });
      stats.inserted += toInsert.length;
    } catch (err: any) {
      console.warn(`  ⚠️  Batch insert failed (${err.message}) — retrying individually`);
      for (const row of toInsert) {
        try {
          await Property.create(row, { validate: false });
          stats.inserted++;
        } catch (rowErr: any) {
          stats.errors++;
          console.error(`  ❌ Skipped ${row.mlsNumber}: ${rowErr.message}`);
        }
      }
    }
  }
}

async function main() {
  const started = Date.now();
  const sequelize = makeSequelize();
  await sequelize.authenticate();

  const userId = process.env.HAR_IMPORT_USER_ID || '';
  const user = await User.findByPk(userId);
  if (!user) throw new Error(`HAR_IMPORT_USER_ID user not found: ${userId}`);

  const since = await resolveWatermark();
  console.log(`🔄 HAR incremental sync — changes since ${since.toISOString()}`);
  console.log(`   Filter: ${BASE_FILTER}\n`);

  const importer = new HarImporter(sequelize);
  let lastKey: string | null = null;
  let pages = 0;

  while (pages < MAX_PAGES) {
    const listings = await fetchPage(buildUrl(since, lastKey));
    if (listings.length === 0) break;

    stats.fetched += listings.length;
    await upsertBatch(importer, listings, userId);

    lastKey = listings[listings.length - 1].ListingKey;
    pages++;
    console.log(
      `  📦 page ${pages}: +${listings.length} | inserted ${stats.inserted}, updated ${stats.updated}, unchanged ${stats.unchanged}`,
    );

    if (listings.length < PAGE_SIZE) break;
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  if (pages >= MAX_PAGES) {
    console.warn(`⚠️  Stopped at HAR_SYNC_MAX_PAGES=${MAX_PAGES}; run again to continue`);
  }

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\n📊 Sync summary (${secs}s):`);
  console.log(`   📥 Fetched:   ${stats.fetched}`);
  console.log(`   ✅ Inserted:  ${stats.inserted}`);
  console.log(`   🔄 Updated:   ${stats.updated}`);
  console.log(`   ⏭️  Unchanged: ${stats.unchanged}`);
  console.log(`   ❌ Errors:    ${stats.errors}`);

  await sequelize.close();
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
