/**
 * MLS display-compliance sweep.
 *
 * The HRIS agreement (§5a) limits public display to listings whose MLS status
 * is Active, Option Pending, Pending Continuing to Show or Pending. Sold,
 * Expired and Terminated listings (the VOW tier) may only be shown behind a
 * login, and a seller who opted out of internet display must not appear at all.
 *
 * The original importer only ever INSERTed, so listings imported while Active
 * stayed `published` forever — even after they sold. This moves every
 * HAR-imported listing that is no longer publicly displayable to
 * `off_market`, which every public query already excludes.
 *
 * How a stale listing is identified: the bulk backfill wrote `mlsStatus` for
 * every listing that was Active/Pending at that time. A HAR-imported row still
 * holding `mlsStatus IS NULL` was therefore absent from the current
 * active/pending feed — i.e. it has since sold, expired or been terminated.
 *
 * Safety:
 *   - Only touches rows owned by HAR_IMPORT_USER_ID, so user-created listings
 *     and sell-flow copies are never affected.
 *   - DRY_RUN=true (the default) reports without writing.
 *
 * Usage:
 *   npm run compliance:sweep                 # dry run — reports only
 *   DRY_RUN=false npm run compliance:sweep   # apply
 */
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as dotenv from 'dotenv';
import { Property } from '../properties/property.model';
import { User } from '../users/user.model';

dotenv.config();

// Default to a dry run: this changes what the public site shows, so applying
// must be a deliberate choice rather than the result of a typo.
const DRY_RUN = process.env.DRY_RUN !== 'false';
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '5000', 10);

async function main() {
  const sequelize = new Sequelize(
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
      pool: { max: 3, min: 0, acquire: 120000, idle: 10000 },
    },
  );

  await sequelize.authenticate();
  const userId = process.env.HAR_IMPORT_USER_ID || '';
  const importUser = await User.findByPk(userId);
  if (!importUser) throw new Error(`HAR_IMPORT_USER_ID user not found: ${userId}`);

  console.log(`✅ Connected to ${process.env.DB_HOST}`);
  console.log(DRY_RUN ? '🔍 DRY RUN — no changes will be written\n' : '⚠️  APPLYING CHANGES\n');

  // --- Current state -------------------------------------------------------
  const totalPublished = await Property.count({ where: { status: 'published' } });
  const harPublished = await Property.count({
    where: { status: 'published', userId },
  });

  // 1. No longer in the active/pending feed (sold / expired / terminated)
  const staleWhere: any = {
    status: 'published',
    userId,
    mlsStatus: null,
  };
  const staleCount = await Property.count({ where: staleWhere });

  // 2. Seller opted out of internet display
  const optedOutWhere: any = {
    status: 'published',
    userId,
    internetDisplayAllowed: false,
  };
  const optedOutCount = await Property.count({ where: optedOutWhere });

  console.log('📊 Current state');
  console.log(`   Published (all)          : ${totalPublished.toLocaleString()}`);
  console.log(`   Published (HAR-imported) : ${harPublished.toLocaleString()}`);
  console.log(`   ├─ no longer active/pending : ${staleCount.toLocaleString()}  → off_market`);
  console.log(`   └─ seller opted out         : ${optedOutCount.toLocaleString()}  → off_market`);
  console.log(
    `   Remaining publicly visible: ${(totalPublished - staleCount - optedOutCount).toLocaleString()}\n`,
  );

  if (DRY_RUN) {
    // Show a sample so the change can be eyeballed before it is applied.
    const sample = (await Property.findAll({
      where: staleWhere,
      attributes: ['mlsNumber', 'city', 'listPrice', 'listDate'],
      limit: 5,
      raw: true,
    })) as any[];
    if (sample.length > 0) {
      console.log('🔎 Sample of listings that would be hidden:');
      for (const s of sample) {
        console.log(
          `   ${String(s.mlsNumber).padEnd(12)} ${String(s.city ?? '').padEnd(18)} $${s.listPrice}`,
        );
      }
      console.log();
    }
    console.log('Run with DRY_RUN=false to apply.');
    await sequelize.close();
    return;
  }

  // --- Apply ---------------------------------------------------------------
  let moved = 0;
  for (const [label, where] of [
    ['no longer active/pending', staleWhere],
    ['seller opted out', optedOutWhere],
  ] as const) {
    while (true) {
      // Batched by id so a long-running UPDATE doesn't hold one huge
      // transaction over the whole table.
      const batch = (await Property.findAll({
        where,
        attributes: ['id'],
        limit: BATCH_SIZE,
        raw: true,
      })) as any[];
      if (batch.length === 0) break;

      await Property.update(
        { status: 'off_market' } as any,
        { where: { id: { [Op.in]: batch.map((b) => b.id) } } },
      );
      moved += batch.length;
      process.stdout.write(`  📦 ${label}: ${moved.toLocaleString()} moved\r\n`);
    }
  }

  const nowPublished = await Property.count({ where: { status: 'published' } });
  console.log('\n📊 Result');
  console.log(`   Moved to off_market : ${moved.toLocaleString()}`);
  console.log(`   Publicly visible now: ${nowPublished.toLocaleString()}`);

  await sequelize.close();
  console.log('\n✨ Sweep complete.');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
