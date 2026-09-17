'use strict';

/**
 * Speeds up the listing COUNT(*).
 *
 * The count's anti-join needs properties.id, which isn't in the
 * (status, "createdAt") index, so Postgres fell back to a heap scan of every
 * published row (~200 MB, 2.6s). Indexing (status, id) lets it satisfy both
 * the filter and the join key from an index-only scan of a few MB instead.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_status_id_idx"
      ON "properties" ("status", "id")
    `);
    console.log('✓ Added properties_status_id_idx');

    await queryInterface.sequelize.query('ANALYZE "properties"');
    console.log('✓ Ran ANALYZE on properties');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "properties_status_id_idx"');
  },
};
