'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column exists
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'buy_requests' 
      AND column_name = 'creditScore'
    `);
    
    if (results.length > 0) {
      const currentType = results[0].data_type;
      
      if (currentType === 'integer') {
        // Change the column type from INTEGER to STRING
        await queryInterface.sequelize.query(`
          ALTER TABLE "buy_requests" 
          ALTER COLUMN "creditScore" TYPE VARCHAR(255) 
          USING "creditScore"::TEXT
        `);
        console.log('✓ Changed creditScore column type from INTEGER to STRING');
      } else if (currentType === 'character varying' || currentType === 'varchar') {
        console.log('✓ Column creditScore is already STRING type');
      } else {
        console.log(`⚠ Column creditScore has unexpected type: ${currentType}`);
      }
    } else {
      console.log('⚠ Column creditScore does not exist, skipping migration');
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert the column type back to INTEGER
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'buy_requests' 
      AND column_name = 'creditScore'
    `);
    
    if (results.length > 0 && results[0].data_type !== 'integer') {
      // Convert numeric strings to integers, set non-numeric to NULL
      await queryInterface.sequelize.query(`
        ALTER TABLE "buy_requests" 
        ALTER COLUMN "creditScore" TYPE INTEGER 
        USING CASE 
          WHEN "creditScore" ~ '^[0-9]+$' THEN "creditScore"::INTEGER 
          ELSE NULL 
        END
      `);
      console.log('✓ Reverted creditScore column type back to INTEGER');
    } else {
      console.log('✓ Column creditScore is already INTEGER type or does not exist');
    }
  },
};

