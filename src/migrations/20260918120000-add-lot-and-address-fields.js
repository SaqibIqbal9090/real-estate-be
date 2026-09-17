'use strict';

/**
 * Four remaining useful MLS fields.
 *
 * lotSizeArea/lotSizeUnits matter beyond completeness: `lotSize` assumes
 * square feet, so large-acreage listings overflow DECIMAL(10,2) and get
 * nulled by the import guard. Storing the MLS's own value and unit keeps the
 * real figure ("4.63 Acres") regardless of magnitude.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existing] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'properties'
    `);
    const has = (n) => existing.some((c) => c.column_name === n);

    const columns = {
      // MLS's own formatted address — more reliable than assembling parts
      unparsedAddress: { type: Sequelize.STRING, allowNull: true },
      // Lot size in the unit the MLS actually used
      lotSizeArea: { type: Sequelize.DECIMAL(15, 4), allowNull: true },
      lotSizeUnits: { type: Sequelize.STRING, allowNull: true },
      // Buyers filter on utilities
      utilities: { type: Sequelize.JSON, allowNull: true },
    };

    for (const [name, spec] of Object.entries(columns)) {
      if (!has(name)) {
        await queryInterface.addColumn('properties', name, spec);
        console.log(`✓ Added properties.${name}`);
      }
    }
  },

  async down(queryInterface) {
    for (const n of ['unparsedAddress', 'lotSizeArea', 'lotSizeUnits', 'utilities']) {
      await queryInterface.removeColumn('properties', n);
    }
  },
};
