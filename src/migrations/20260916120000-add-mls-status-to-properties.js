'use strict';

/**
 * Adds MLS status tracking to properties for HRIS/HAR display compliance:
 * - "mlsStatus": raw status from the MLS feed (Active, Sold, Expired, ...)
 * - status enum gains 'off_market' so Sold/Expired/Terminated listings can be
 *   stored (VOW tier) without ever appearing in public queries, which filter
 *   on status = 'published'.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add mlsStatus column if missing
    const [cols] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'properties' AND column_name = 'mlsStatus'
    `);
    if (cols.length === 0) {
      await queryInterface.addColumn('properties', 'mlsStatus', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✓ Added properties.mlsStatus');
    }

    // 2. Extend the status enum with 'off_market' (look up the enum type name
    //    instead of assuming Sequelize's default naming)
    const [types] = await queryInterface.sequelize.query(`
      SELECT udt_name FROM information_schema.columns
      WHERE table_name = 'properties' AND column_name = 'status'
    `);
    if (types.length > 0) {
      const enumName = types[0].udt_name;
      await queryInterface.sequelize.query(
        `ALTER TYPE "${enumName}" ADD VALUE IF NOT EXISTS 'off_market'`
      );
      console.log(`✓ Added 'off_market' to enum ${enumName}`);
    }

    // 3. Index for status reconciliation lookups by MLS number
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_mls_number_idx" ON "properties" ("mlsNumber")
    `);
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_mls_status_idx" ON "properties" ("mlsStatus")
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "properties_mls_status_idx"');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "properties_mls_number_idx"');
    await queryInterface.removeColumn('properties', 'mlsStatus');
    // Postgres cannot remove a value from an enum type; 'off_market' stays.
  },
};
