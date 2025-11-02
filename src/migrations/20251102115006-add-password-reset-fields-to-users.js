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

    // Add passwordResetToken column
    await addColumnIfNotExists('users', 'passwordResetToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add passwordResetExpires column
    await addColumnIfNotExists('users', 'passwordResetExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove password reset columns
    try {
      await queryInterface.removeColumn('users', 'passwordResetToken');
      console.log('✓ Removed passwordResetToken column from users table');
    } catch (error) {
      console.log('- Error removing passwordResetToken column:', error.message);
    }

    try {
      await queryInterface.removeColumn('users', 'passwordResetExpires');
      console.log('✓ Removed passwordResetExpires column from users table');
    } catch (error) {
      console.log('- Error removing passwordResetExpires column:', error.message);
    }
  }
};
