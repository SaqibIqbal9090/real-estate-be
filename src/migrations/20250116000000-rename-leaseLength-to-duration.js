'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the column from leaseLength to duration
    await queryInterface.renameColumn('buy_requests', 'leaseLength', 'duration');
    console.log('✓ Renamed column leaseLength to duration in buy_requests table');
  },

  async down(queryInterface, Sequelize) {
    // Revert the column name back to leaseLength
    await queryInterface.renameColumn('buy_requests', 'duration', 'leaseLength');
    console.log('✓ Reverted column duration back to leaseLength in buy_requests table');
  },
};

