/**
 * Backfills properties.propertyCategory for existing rows.
 *
 * Reuses derivePropertyCategory — the same function the importer applies — so
 * historical rows and newly imported ones are categorised identically.
 *
 * Idempotent and resumable: only rows with a NULL category are touched, and
 * it works in batches so it can be interrupted and re-run.
 *
 * Usage:  npm run properties:backfill-category
 *   DRY_RUN=true      report the distribution without writing
 *   BATCH_SIZE=1000   rows per pass (default 1000)
 */
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as dotenv from 'dotenv';
import { Property } from '../properties/property.model';
import { User } from '../users/user.model';
import { derivePropertyCategory } from '../properties/property-category';

dotenv.config();

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '1000', 10);
const DRY_RUN = process.env.DRY_RUN === 'true';

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
      pool: { max: 3, min: 0, acquire: 60000, idle: 10000 },
    },
  );

  await sequelize.authenticate();
  console.log(`✅ Connected to ${process.env.DB_HOST}`);
  if (DRY_RUN) console.log('🔍 DRY RUN — no writes will be made\n');

  const remaining = await Property.count({ where: { propertyCategory: null as any } });
  console.log(`📊 ${remaining.toLocaleString()} rows need a category\n`);

  const tally: Record<string, number> = {};
  let processed = 0;

  while (true) {
    const rows = await Property.findAll({
      where: { propertyCategory: null as any },
      attributes: ['id', 'propertyType'],
      limit: BATCH_SIZE,
      // Deliberately unordered. ORDER BY forced Postgres to scan and sort the
      // entire NULL set on every batch (~70s each over 200k rows); unordered,
      // it can stop as soon as LIMIT is satisfied. Progress is still
      // guaranteed because each batch stops matching once it's written.
      raw: true,
    });

    if (rows.length === 0) break;

    // Group ids by resulting category so each batch is a handful of UPDATEs
    // rather than one per row.
    const byCategory = new Map<string, string[]>();
    for (const row of rows as any[]) {
      const types = Array.isArray(row.propertyType) ? row.propertyType : [];
      const category = derivePropertyCategory(types);
      tally[category] = (tally[category] || 0) + 1;
      const ids = byCategory.get(category) || [];
      ids.push(row.id);
      byCategory.set(category, ids);
    }

    if (!DRY_RUN) {
      for (const [category, ids] of byCategory) {
        await Property.update(
          { propertyCategory: category } as any,
          { where: { id: { [Op.in]: ids } } },
        );
      }
    }

    processed += rows.length;
    process.stdout.write(`  📦 ${processed.toLocaleString()} / ${remaining.toLocaleString()}\r\n`);

    // A dry run would loop forever, since nothing is written.
    if (DRY_RUN && processed >= remaining) break;
    if (DRY_RUN) break;
  }

  console.log('\n📊 Category distribution:');
  for (const [category, count] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${category.padEnd(15)} ${count.toLocaleString()}`);
  }

  await sequelize.close();
  console.log(DRY_RUN ? '\n🔍 Dry run complete.' : '\n✨ Backfill complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
