'use strict';

/**
 * Captures MLS fields the importer was dropping.
 *
 * Display consent (the important ones): HAR tells us per listing whether it
 * may be shown on the internet at all. Ignoring these means publishing
 * listings whose sellers opted out — an MLS rules violation independent of
 * listing status.
 *   - internetDisplayAllowed  <- InternetEntireListingDisplayYN
 *   - addressDisplayAllowed   <- InternetAddressDisplayYN
 *   - feedTypes               <- FeedTypes, e.g. ["IDX","VOW"]. IDX means
 *                                publicly displayable; VOW-only is login-only.
 *
 * Sync: modificationTimestamp enables incremental imports (fetch only what
 * changed) instead of re-walking the whole feed every two hours.
 *
 * Geo: latitude/longitude were never stored, so map search was impossible.
 *
 * Attribution: listOfficeName is generally required to be displayed with IDX
 * listings.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existing] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'properties'
    `);
    const has = (name) => existing.some((c) => c.column_name === name);

    const columns = {
      // Display consent / feed eligibility
      internetDisplayAllowed: { type: Sequelize.BOOLEAN, allowNull: true },
      addressDisplayAllowed: { type: Sequelize.BOOLEAN, allowNull: true },
      feedTypes: { type: Sequelize.JSON, allowNull: true },
      // Incremental sync
      modificationTimestamp: { type: Sequelize.DATE, allowNull: true },
      photosChangeTimestamp: { type: Sequelize.DATE, allowNull: true },
      statusChangeTimestamp: { type: Sequelize.DATE, allowNull: true },
      priceChangeTimestamp: { type: Sequelize.DATE, allowNull: true },
      // Geo
      latitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      longitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      // Attribution + listing context
      listOfficeName: { type: Sequelize.STRING, allowNull: true },
      listOfficePhone: { type: Sequelize.STRING, allowNull: true },
      originalListPrice: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
      daysOnMarket: { type: Sequelize.INTEGER, allowNull: true },
      photosCount: { type: Sequelize.INTEGER, allowNull: true },
    };

    for (const [name, spec] of Object.entries(columns)) {
      if (!has(name)) {
        await queryInterface.addColumn('properties', name, spec);
        console.log(`✓ Added properties.${name}`);
      }
    }

    // Drives the incremental sync watermark query.
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_modification_ts_idx"
      ON "properties" ("modificationTimestamp" DESC NULLS LAST)
    `);
    console.log('✓ Added properties_modification_ts_idx');

    // Public listing queries filter on display consent alongside status.
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_display_status_idx"
      ON "properties" ("internetDisplayAllowed", "status")
    `);
    console.log('✓ Added properties_display_status_idx');

    // Map/bounding-box queries.
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "properties_latlng_idx"
      ON "properties" ("latitude", "longitude")
      WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL
    `);
    console.log('✓ Added properties_latlng_idx');

    await queryInterface.sequelize.query('ANALYZE "properties"');
    console.log('✓ Ran ANALYZE on properties');
    console.log('→ Existing rows keep NULLs until re-imported; NULL is treated as "allowed" so nothing disappears retroactively.');
  },

  async down(queryInterface) {
    for (const idx of [
      'properties_latlng_idx',
      'properties_display_status_idx',
      'properties_modification_ts_idx',
    ]) {
      await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${idx}"`);
    }
    for (const name of [
      'internetDisplayAllowed', 'addressDisplayAllowed', 'feedTypes',
      'modificationTimestamp', 'photosChangeTimestamp', 'statusChangeTimestamp',
      'priceChangeTimestamp', 'latitude', 'longitude', 'listOfficeName',
      'listOfficePhone', 'originalListPrice', 'daysOnMarket', 'photosCount',
    ]) {
      await queryInterface.removeColumn('properties', name);
    }
  },
};
