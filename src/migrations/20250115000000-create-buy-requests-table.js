'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buy_requests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      bedrooms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      budget: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      neighborhoods: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      workLocation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commuteMode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commuteRadius: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      laundry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parking: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      pets: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      priority: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      moveDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      moveUrgency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      leaseLength: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      roommates: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      evictionHistory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add index on userId for faster queries
    await queryInterface.addIndex('buy_requests', ['userId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('buy_requests');
  },
};

