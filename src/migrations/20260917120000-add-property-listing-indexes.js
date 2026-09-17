'use strict';

/**
 * Performance indexes for the public property listing query.
 *
 * Before: the listing query seq-scanned the whole properties table twice
 * (~6.7 GB, rows are ~35 KB wide) and sorted ~189k rows to return 10 —
 * 15s per request, and again for the COUNT.
 *
 * - properties_status_createdat_idx: lets Postgres walk rows already in
 *   "createdAt" order for a given status, so the sort disappears and the scan
 *   stops after the first page of matches.
 * - properties_source_property_idx: partial index for the "hide catalog
 *   originals that have a published copy" anti-join. Only sell-flow copies set
 *   sourcePropertyId, so the partial index stays tiny.
 *
 * CREATE INDEX CONCURRENTLY can't run inside a transaction, and sequelize-cli
 * may wrap migrations in one, so these are plain CREATE INDEX. On ~200k rows
 * each takes a few seconds and briefly blocks writes — run off-peak.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_status_createdat_idx"
      ON "properties" ("status", "createdAt" DESC)
    `);
    console.log('✓ Added properties_status_createdat_idx');

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_source_property_idx"
      ON "properties" ("sourcePropertyId")
      WHERE "sourcePropertyId" IS NOT NULL
    `);
    console.log('✓ Added properties_source_property_idx');

    // Supports the listType / city filters used by the public listing filters.
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_listtype_status_idx"
      ON "properties" ("listType", "status")
    `);
    console.log('✓ Added properties_listtype_status_idx');

    // Refresh planner statistics so the new indexes are used immediately.
    await queryInterface.sequelize.query('ANALYZE "properties"');
    console.log('✓ Ran ANALYZE on properties');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "properties_listtype_status_idx"');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "properties_source_property_idx"');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "properties_status_createdat_idx"');
  },
};
