'use strict';

/**
 * Adds an indexed, canonical propertyCategory column.
 *
 * Filtering previously matched the UI's codes ("singleFamilyDetached") against
 * HAR's raw strings ("Single Family Residence") inside a JSON array — which
 * scanned every row (~5s) and matched nothing.
 *
 * Existing rows are backfilled by `npm run properties:backfill-category`,
 * which reuses the same derivation the importer applies, rather than a SQL
 * copy of those rules that would drift out of sync.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [cols] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'properties' AND column_name = 'propertyCategory'
    `);
    if (cols.length === 0) {
      await queryInterface.addColumn('properties', 'propertyCategory', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✓ Added properties.propertyCategory');
    }

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_category_status_idx"
      ON "properties" ("propertyCategory", "status")
    `);
    console.log('✓ Added properties_category_status_idx');

    // Supports "category + listType, newest first", the common listing query.
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_category_listtype_created_idx"
      ON "properties" ("propertyCategory", "listType", "status", "createdAt" DESC)
    `);
    console.log('✓ Added properties_category_listtype_created_idx');

    await queryInterface.sequelize.query('ANALYZE "properties"');
    console.log('✓ Ran ANALYZE on properties');
    console.log('→ Next: npm run properties:backfill-category');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "properties_category_listtype_created_idx"');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "properties_category_status_idx"');
    await queryInterface.removeColumn('properties', 'propertyCategory');
  },
};
