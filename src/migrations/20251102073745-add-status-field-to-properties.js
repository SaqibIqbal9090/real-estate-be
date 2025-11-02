'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create ENUM type for status if it doesn't exist
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_properties_status" AS ENUM ('draft', 'published');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add status column with default value
    try {
      await queryInterface.addColumn('properties', 'status', {
        type: Sequelize.ENUM('draft', 'published'),
        defaultValue: 'draft',
        allowNull: false,
      });
      console.log('✓ Added status column to properties table');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('- Status column already exists');
      } else {
        throw error;
      }
    }

    // Update existing properties to have 'draft' status if they don't have one
    await queryInterface.sequelize.query(`
      UPDATE properties 
      SET status = 'draft' 
      WHERE status IS NULL;
    `);
  },

  async down (queryInterface, Sequelize) {
    // Remove status column
    try {
      await queryInterface.removeColumn('properties', 'status');
      console.log('✓ Removed status column from properties table');
    } catch (error) {
      console.log('- Error removing status column:', error.message);
    }

    // Drop ENUM type
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_properties_status";
    `);
  }
};
