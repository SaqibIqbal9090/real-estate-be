'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Helper function to safely add column
    const addColumnIfNotExists = async (tableName, columnName, columnDefinition) => {
      try {
        await queryInterface.addColumn(tableName, columnName, columnDefinition);
        console.log(`✓ Added column: ${columnName}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`- Column already exists: ${columnName}`);
        } else {
          throw error;
        }
      }
    };

    // Add rooms column
    await addColumnIfNotExists('properties', 'rooms', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Add garage-related columns
    await addColumnIfNotExists('properties', 'garageDimensions', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'garageAptQtrsSqFt', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Add sqft-related columns
    await addColumnIfNotExists('properties', 'sqftSource', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add guest house columns
    await addColumnIfNotExists('properties', 'guestHouseSqFt', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Add property feature columns
    await addColumnIfNotExists('properties', 'frontDoorFaces', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'ovenType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'stoveType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'washerDryerConnection', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'privatePoolDescription', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'interiorFeatures', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'flooring', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'exteriorDescription', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'constructionMaterials', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'roofDescription', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'foundationDescription', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'energyFeatures', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'greenEnergyCertifications', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'heatingSystemDescription', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'coolingSystemDescription', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'waterSewerDescription', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'streetSurface', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add HOA management columns
    await addColumnIfNotExists('properties', 'mandatoryHOA', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'mandatoryHOAMgmtCoName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'mandatoryHOAMgmtCoPhone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'mandatoryHOAMgmtCoWebsite', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add maintenance fee columns
    await addColumnIfNotExists('properties', 'maintenanceFee', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'maintenanceFeeAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'maintenanceFeePaymentSched', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'maintenanceFeeIncludes', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Add team and supervisor columns
    await addColumnIfNotExists('properties', 'listTeamID', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'licensedSupervisor', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add virtual tour and floor plan columns
    await addColumnIfNotExists('properties', 'videoTourLink1', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'virtualTourLink1', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'virtualTourLink2', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addColumnIfNotExists('properties', 'interactiveFloorPlanURL', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove all added columns in reverse order
    const columnsToRemove = [
      'interactiveFloorPlanURL',
      'virtualTourLink2',
      'virtualTourLink1',
      'videoTourLink1',
      'licensedSupervisor',
      'listTeamID',
      'maintenanceFeeIncludes',
      'maintenanceFeePaymentSched',
      'maintenanceFeeAmount',
      'maintenanceFee',
      'mandatoryHOAMgmtCoWebsite',
      'mandatoryHOAMgmtCoPhone',
      'mandatoryHOAMgmtCoName',
      'mandatoryHOA',
      'streetSurface',
      'waterSewerDescription',
      'coolingSystemDescription',
      'heatingSystemDescription',
      'greenEnergyCertifications',
      'energyFeatures',
      'foundationDescription',
      'roofDescription',
      'constructionMaterials',
      'exteriorDescription',
      'flooring',
      'interiorFeatures',
      'privatePoolDescription',
      'washerDryerConnection',
      'stoveType',
      'ovenType',
      'frontDoorFaces',
      'guestHouseSqFt',
      'sqftSource',
      'garageAptQtrsSqFt',
      'garageDimensions',
      'rooms'
    ];

    for (const column of columnsToRemove) {
      await queryInterface.removeColumn('properties', column);
    }
  }
};
