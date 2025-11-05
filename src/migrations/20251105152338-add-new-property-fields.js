'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Helper function to safely add column
    const addColumnIfNotExists = async (tableName, columnName, columnDefinition) => {
      try {
        await queryInterface.addColumn(tableName, columnName, columnDefinition);
        console.log(`✓ Added column: ${columnName} to ${tableName}`);
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`- Column already exists: ${columnName} in ${tableName}`);
        } else {
          throw error;
        }
      }
    };

    // Add townhouseCondo column
    await addColumnIfNotExists('properties', 'townhouseCondo', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add unitLevel column
    await addColumnIfNotExists('properties', 'unitLevel', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add directions column (TEXT for longer content)
    await addColumnIfNotExists('properties', 'directions', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Add remarks column (TEXT for longer content)
    await addColumnIfNotExists('properties', 'remarks', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Add agentRemarks column (TEXT for longer content)
    await addColumnIfNotExists('properties', 'agentRemarks', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Add mlsNumber column
    await addColumnIfNotExists('properties', 'mlsNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove columns in reverse order
    const columnsToRemove = [
      'mlsNumber',
      'agentRemarks',
      'remarks',
      'directions',
      'unitLevel',
      'townhouseCondo',
    ];

    for (const columnName of columnsToRemove) {
      try {
        await queryInterface.removeColumn('properties', columnName);
        console.log(`✓ Removed column: ${columnName} from properties table`);
      } catch (error) {
        console.log(`- Error removing ${columnName} column:`, error.message);
      }
    }
  }
};
