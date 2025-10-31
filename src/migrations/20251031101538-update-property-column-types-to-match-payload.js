'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Convert JSON arrays to INTEGER for bedroom/bathroom fields using ALTER COLUMN ... USING
    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "bedrooms" TYPE INTEGER USING (
        CASE 
          WHEN "bedrooms"::text::jsonb IS NOT NULL AND jsonb_array_length("bedrooms"::text::jsonb) > 0 
          THEN (("bedrooms"::text::jsonb->0)::text)::integer
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "bedroomsMax" TYPE INTEGER USING (
        CASE 
          WHEN "bedroomsMax"::text::jsonb IS NOT NULL AND jsonb_array_length("bedroomsMax"::text::jsonb) > 0 
          THEN (("bedroomsMax"::text::jsonb->0)::text)::integer
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "bathsFull" TYPE INTEGER USING (
        CASE 
          WHEN "bathsFull"::text::jsonb IS NOT NULL AND jsonb_array_length("bathsFull"::text::jsonb) > 0 
          THEN (("bathsFull"::text::jsonb->0)::text)::integer
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "bathshalf" TYPE INTEGER USING (
        CASE 
          WHEN "bathshalf"::text::jsonb IS NOT NULL AND jsonb_array_length("bathshalf"::text::jsonb) > 0 
          THEN (("bathshalf"::text::jsonb->0)::text)::integer
          ELSE NULL
        END
      );
    `);

    // Convert STRING to JSON arrays for feature fields using ALTER COLUMN ... USING
    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "frontDoorFaces" TYPE JSONB USING (
        CASE 
          WHEN "frontDoorFaces" IS NOT NULL AND "frontDoorFaces" != '' 
          THEN jsonb_build_array("frontDoorFaces")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "ovenType" TYPE JSONB USING (
        CASE 
          WHEN "ovenType" IS NOT NULL AND "ovenType" != '' 
          THEN jsonb_build_array("ovenType")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "stoveType" TYPE JSONB USING (
        CASE 
          WHEN "stoveType" IS NOT NULL AND "stoveType" != '' 
          THEN jsonb_build_array("stoveType")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "washerDryerConnection" TYPE JSONB USING (
        CASE 
          WHEN "washerDryerConnection" IS NOT NULL AND "washerDryerConnection" != '' 
          THEN jsonb_build_array("washerDryerConnection")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "privatePoolDescription" TYPE JSONB USING (
        CASE 
          WHEN "privatePoolDescription" IS NOT NULL AND "privatePoolDescription" != '' 
          THEN jsonb_build_array("privatePoolDescription")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "interiorFeatures" TYPE JSONB USING (
        CASE 
          WHEN "interiorFeatures" IS NOT NULL AND "interiorFeatures" != '' 
          THEN jsonb_build_array("interiorFeatures")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "flooring" TYPE JSONB USING (
        CASE 
          WHEN "flooring" IS NOT NULL AND "flooring" != '' 
          THEN jsonb_build_array("flooring")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "exteriorDescription" TYPE JSONB USING (
        CASE 
          WHEN "exteriorDescription" IS NOT NULL AND "exteriorDescription" != '' 
          THEN jsonb_build_array("exteriorDescription")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "constructionMaterials" TYPE JSONB USING (
        CASE 
          WHEN "constructionMaterials" IS NOT NULL AND "constructionMaterials" != '' 
          THEN jsonb_build_array("constructionMaterials")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "roofDescription" TYPE JSONB USING (
        CASE 
          WHEN "roofDescription" IS NOT NULL AND "roofDescription" != '' 
          THEN jsonb_build_array("roofDescription")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "foundationDescription" TYPE JSONB USING (
        CASE 
          WHEN "foundationDescription" IS NOT NULL AND "foundationDescription" != '' 
          THEN jsonb_build_array("foundationDescription")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "energyFeatures" TYPE JSONB USING (
        CASE 
          WHEN "energyFeatures" IS NOT NULL AND "energyFeatures" != '' 
          THEN jsonb_build_array("energyFeatures")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "greenEnergyCertifications" TYPE JSONB USING (
        CASE 
          WHEN "greenEnergyCertifications" IS NOT NULL AND "greenEnergyCertifications" != '' 
          THEN jsonb_build_array("greenEnergyCertifications")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "heatingSystemDescription" TYPE JSONB USING (
        CASE 
          WHEN "heatingSystemDescription" IS NOT NULL AND "heatingSystemDescription" != '' 
          THEN jsonb_build_array("heatingSystemDescription")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "coolingSystemDescription" TYPE JSONB USING (
        CASE 
          WHEN "coolingSystemDescription" IS NOT NULL AND "coolingSystemDescription" != '' 
          THEN jsonb_build_array("coolingSystemDescription")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "waterSewerDescription" TYPE JSONB USING (
        CASE 
          WHEN "waterSewerDescription" IS NOT NULL AND "waterSewerDescription" != '' 
          THEN jsonb_build_array("waterSewerDescription")
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "streetSurface" TYPE JSONB USING (
        CASE 
          WHEN "streetSurface" IS NOT NULL AND "streetSurface" != '' 
          THEN jsonb_build_array("streetSurface")
          ELSE NULL
        END
      );
    `);

    // Add missing fields from payload
    await queryInterface.addColumn('properties', 'golfCourseName', {
      type: Sequelize.STRING,
      allowNull: true,
    }).catch(() => {}); // Ignore if column already exists

    await queryInterface.addColumn('properties', 'poolArea', {
      type: Sequelize.STRING,
      allowNull: true,
    }).catch(() => {}); // Ignore if column already exists

    await queryInterface.addColumn('properties', 'poolPrivate', {
      type: Sequelize.STRING,
      allowNull: true,
    }).catch(() => {}); // Ignore if column already exists
  },

  async down(queryInterface, Sequelize) {
    // Revert INTEGER back to JSON
    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "bedrooms" TYPE JSONB USING (
        CASE 
          WHEN "bedrooms" IS NOT NULL 
          THEN jsonb_build_array("bedrooms"::text)
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "bedroomsMax" TYPE JSONB USING (
        CASE 
          WHEN "bedroomsMax" IS NOT NULL 
          THEN jsonb_build_array("bedroomsMax"::text)
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "bathsFull" TYPE JSONB USING (
        CASE 
          WHEN "bathsFull" IS NOT NULL 
          THEN jsonb_build_array("bathsFull"::text)
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "bathshalf" TYPE JSONB USING (
        CASE 
          WHEN "bathshalf" IS NOT NULL 
          THEN jsonb_build_array("bathshalf"::text)
          ELSE NULL
        END
      );
    `);

    // Revert JSON back to STRING
    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "frontDoorFaces" TYPE VARCHAR USING (
        CASE 
          WHEN "frontDoorFaces"::text::jsonb IS NOT NULL AND jsonb_array_length("frontDoorFaces"::text::jsonb) > 0 
          THEN ("frontDoorFaces"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "ovenType" TYPE VARCHAR USING (
        CASE 
          WHEN "ovenType"::text::jsonb IS NOT NULL AND jsonb_array_length("ovenType"::text::jsonb) > 0 
          THEN ("ovenType"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "stoveType" TYPE VARCHAR USING (
        CASE 
          WHEN "stoveType"::text::jsonb IS NOT NULL AND jsonb_array_length("stoveType"::text::jsonb) > 0 
          THEN ("stoveType"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "washerDryerConnection" TYPE VARCHAR USING (
        CASE 
          WHEN "washerDryerConnection"::text::jsonb IS NOT NULL AND jsonb_array_length("washerDryerConnection"::text::jsonb) > 0 
          THEN ("washerDryerConnection"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "privatePoolDescription" TYPE VARCHAR USING (
        CASE 
          WHEN "privatePoolDescription"::text::jsonb IS NOT NULL AND jsonb_array_length("privatePoolDescription"::text::jsonb) > 0 
          THEN ("privatePoolDescription"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "interiorFeatures" TYPE VARCHAR USING (
        CASE 
          WHEN "interiorFeatures"::text::jsonb IS NOT NULL AND jsonb_array_length("interiorFeatures"::text::jsonb) > 0 
          THEN ("interiorFeatures"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "flooring" TYPE VARCHAR USING (
        CASE 
          WHEN "flooring"::text::jsonb IS NOT NULL AND jsonb_array_length("flooring"::text::jsonb) > 0 
          THEN ("flooring"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "exteriorDescription" TYPE VARCHAR USING (
        CASE 
          WHEN "exteriorDescription"::text::jsonb IS NOT NULL AND jsonb_array_length("exteriorDescription"::text::jsonb) > 0 
          THEN ("exteriorDescription"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "constructionMaterials" TYPE VARCHAR USING (
        CASE 
          WHEN "constructionMaterials"::text::jsonb IS NOT NULL AND jsonb_array_length("constructionMaterials"::text::jsonb) > 0 
          THEN ("constructionMaterials"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "roofDescription" TYPE VARCHAR USING (
        CASE 
          WHEN "roofDescription"::text::jsonb IS NOT NULL AND jsonb_array_length("roofDescription"::text::jsonb) > 0 
          THEN ("roofDescription"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "foundationDescription" TYPE VARCHAR USING (
        CASE 
          WHEN "foundationDescription"::text::jsonb IS NOT NULL AND jsonb_array_length("foundationDescription"::text::jsonb) > 0 
          THEN ("foundationDescription"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "energyFeatures" TYPE VARCHAR USING (
        CASE 
          WHEN "energyFeatures"::text::jsonb IS NOT NULL AND jsonb_array_length("energyFeatures"::text::jsonb) > 0 
          THEN ("energyFeatures"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "greenEnergyCertifications" TYPE VARCHAR USING (
        CASE 
          WHEN "greenEnergyCertifications"::text::jsonb IS NOT NULL AND jsonb_array_length("greenEnergyCertifications"::text::jsonb) > 0 
          THEN ("greenEnergyCertifications"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "heatingSystemDescription" TYPE VARCHAR USING (
        CASE 
          WHEN "heatingSystemDescription"::text::jsonb IS NOT NULL AND jsonb_array_length("heatingSystemDescription"::text::jsonb) > 0 
          THEN ("heatingSystemDescription"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "coolingSystemDescription" TYPE VARCHAR USING (
        CASE 
          WHEN "coolingSystemDescription"::text::jsonb IS NOT NULL AND jsonb_array_length("coolingSystemDescription"::text::jsonb) > 0 
          THEN ("coolingSystemDescription"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "waterSewerDescription" TYPE VARCHAR USING (
        CASE 
          WHEN "waterSewerDescription"::text::jsonb IS NOT NULL AND jsonb_array_length("waterSewerDescription"::text::jsonb) > 0 
          THEN ("waterSewerDescription"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE properties 
      ALTER COLUMN "streetSurface" TYPE VARCHAR USING (
        CASE 
          WHEN "streetSurface"::text::jsonb IS NOT NULL AND jsonb_array_length("streetSurface"::text::jsonb) > 0 
          THEN ("streetSurface"::text::jsonb->0)::text
          ELSE NULL
        END
      );
    `);

    // Remove added fields in down migration
    await queryInterface.removeColumn('properties', 'poolPrivate').catch(() => {});
    await queryInterface.removeColumn('properties', 'poolArea').catch(() => {});
    await queryInterface.removeColumn('properties', 'golfCourseName').catch(() => {});
  }
};
