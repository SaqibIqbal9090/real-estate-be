'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column exists and rename if needed
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'buy_requests' 
      AND column_name IN ('evictionHistory', 'creditScore')
    `);
    
    const columnNames = results.map(r => r.column_name);
    
    if (columnNames.includes('evictionHistory') && !columnNames.includes('creditScore')) {
      // Rename the column from evictionHistory to creditScore
      await queryInterface.renameColumn('buy_requests', 'evictionHistory', 'creditScore');
      console.log('✓ Renamed column evictionHistory to creditScore in buy_requests table');
    } else if (columnNames.includes('creditScore')) {
      console.log('✓ Column creditScore already exists, skipping rename');
    }
    
    // Check current column type
    const [typeResults] = await queryInterface.sequelize.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'buy_requests' 
      AND column_name = 'creditScore'
    `);
    
    if (typeResults.length > 0 && typeResults[0].data_type === 'character varying') {
      // First, update any non-numeric values to NULL
      await queryInterface.sequelize.query(`
        UPDATE "buy_requests" 
        SET "creditScore" = NULL 
        WHERE "creditScore" IS NOT NULL 
        AND "creditScore" !~ '^[0-9]+$'
      `);
      console.log('✓ Cleaned up non-numeric values in creditScore column');
      
      // Change the column type from STRING to INTEGER using USING clause
      await queryInterface.sequelize.query(`
        ALTER TABLE "buy_requests" 
        ALTER COLUMN "creditScore" TYPE INTEGER 
        USING CASE 
          WHEN "creditScore" ~ '^[0-9]+$' THEN "creditScore"::INTEGER 
          ELSE NULL 
        END
      `);
      console.log('✓ Changed creditScore column type to INTEGER');
    } else if (typeResults.length > 0 && typeResults[0].data_type === 'integer') {
      console.log('✓ Column creditScore is already INTEGER type');
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert the column type back to STRING
    await queryInterface.changeColumn('buy_requests', 'creditScore', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    console.log('✓ Reverted creditScore column type back to STRING');
    
    // Revert the column name back to evictionHistory
    await queryInterface.renameColumn('buy_requests', 'creditScore', 'evictionHistory');
    console.log('✓ Reverted column creditScore back to evictionHistory in buy_requests table');
  },
};

