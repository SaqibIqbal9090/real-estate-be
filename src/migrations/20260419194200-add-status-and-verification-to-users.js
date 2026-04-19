'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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

    // Add status column
    await addColumnIfNotExists('users', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'PENDING',
    });

    // Add verificationToken column
    await addColumnIfNotExists('users', 'verificationToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add isVerified column
    await addColumnIfNotExists('users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('users', 'status');
      console.log('✓ Removed status column from users table');
    } catch (error) {
      console.log('- Error removing status column:', error.message);
    }

    try {
      await queryInterface.removeColumn('users', 'verificationToken');
      console.log('✓ Removed verificationToken column from users table');
    } catch (error) {
      console.log('- Error removing verificationToken column:', error.message);
    }

    try {
      await queryInterface.removeColumn('users', 'isVerified');
      console.log('✓ Removed isVerified column from users table');
    } catch (error) {
      console.log('- Error removing isVerified column:', error.message);
    }

    // Optionally drop the enum type if using Postgres
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_status";');
  }
};
