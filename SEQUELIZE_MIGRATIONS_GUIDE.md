# Sequelize Migrations Guide

## Overview
This guide explains how to use Sequelize migrations to manage database schema changes in your NestJS application.

## Setup Complete ✅

The following files have been created/updated:
- `.sequelizerc` - Sequelize CLI configuration
- `src/config/database.config.js` - Database config for Sequelize CLI
- `src/migrations/` - Directory for migration files
- `src/seeders/` - Directory for seed files
- `package.json` - Added migration scripts

## Available Commands

### Migration Commands
```bash
# Run all pending migrations
npm run db:migrate

# Undo the last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all

# Check migration status
npm run db:migrate:status
```

### Seeder Commands
```bash
# Run all seeders
npm run db:seed

# Undo all seeders
npm run db:seed:undo
```

### Manual Sequelize CLI Commands
```bash
# Generate a new migration
npx sequelize-cli migration:generate --name migration-name

# Generate a new seeder
npx sequelize-cli seed:generate --name seeder-name

# Run migrations for specific environment
npx sequelize-cli db:migrate --env development
npx sequelize-cli db:migrate --env production
```

## How to Use Migrations

### 1. Generate a New Migration
When you make changes to your models, generate a migration:
```bash
npx sequelize-cli migration:generate --name add-new-field-to-properties
```

### 2. Edit the Migration File
The migration file will be created in `src/migrations/` with a timestamp. Edit it to define your changes:

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add your changes here
    await queryInterface.addColumn('properties', 'newField', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert your changes here
    await queryInterface.removeColumn('properties', 'newField');
  }
};
```

### 3. Run the Migration
```bash
npm run db:migrate
```

### 4. Check Migration Status
```bash
npm run db:migrate:status
```

## Current Migration

The first migration `20250808064829-add-missing-property-fields.js` has been created to add all the missing fields to the properties table:

**Fields Added:**
- `rooms` - JSON array for room details
- `garageDimensions` - Garage dimensions
- `garageAptQtrsSqFt` - Garage apartment square footage
- `sqftSource` - Square footage source
- `guestHouseSqFt` - Guest house square footage
- `frontDoorFaces` - Front door direction
- `ovenType` - Oven type
- `stoveType` - Stove type
- `washerDryerConnection` - Washer/dryer connection
- `privatePoolDescription` - Private pool description
- `interiorFeatures` - Interior features
- `flooring` - Flooring type
- `exteriorDescription` - Exterior description
- `constructionMaterials` - Construction materials
- `roofDescription` - Roof description
- `foundationDescription` - Foundation description
- `energyFeatures` - Energy features
- `greenEnergyCertifications` - Green energy certifications
- `heatingSystemDescription` - Heating system description
- `coolingSystemDescription` - Cooling system description
- `waterSewerDescription` - Water/sewer description
- `streetSurface` - Street surface type
- `mandatoryHOA` - Mandatory HOA
- `mandatoryHOAMgmtCoName` - HOA management company name
- `mandatoryHOAMgmtCoPhone` - HOA management company phone
- `mandatoryHOAMgmtCoWebsite` - HOA management company website
- `maintenanceFee` - Maintenance fee
- `maintenanceFeeAmount` - Maintenance fee amount
- `maintenanceFeePaymentSched` - Maintenance fee payment schedule
- `maintenanceFeeIncludes` - What maintenance fee includes
- `listTeamID` - List team ID
- `licensedSupervisor` - Licensed supervisor
- `videoTourLink1` - Video tour link 1
- `virtualTourLink1` - Virtual tour link 1
- `virtualTourLink2` - Virtual tour link 2
- `interactiveFloorPlanURL` - Interactive floor plan URL

## Next Steps

### 1. Run the Migration
```bash
npm run db:migrate
```

### 2. Verify the Migration
```bash
npm run db:migrate:status
```

### 3. Test the Application
```bash
npm run start:dev
```

### 4. Test with Complete Payload
```bash
node test-complete-payload.js
```

## Best Practices

### 1. Always Create Migrations for Schema Changes
- Don't rely on `synchronize: true` in production
- Create migrations for all model changes
- Test migrations in development first

### 2. Migration Naming
- Use descriptive names: `add-user-email-field`, `create-properties-table`
- Include the table name in the migration name

### 3. Migration Structure
- Always implement both `up()` and `down()` methods
- Make migrations reversible
- Test the `down()` method

### 4. Environment Management
- Use different databases for development, testing, and production
- Set environment variables for database credentials
- Never commit sensitive database credentials

### 5. Migration Order
- Migrations run in timestamp order
- Never modify existing migrations that have been run
- Create new migrations for additional changes

## Troubleshooting

### Migration Fails
1. Check database connection
2. Verify migration syntax
3. Check if columns already exist
4. Review error logs

### Rollback Issues
1. Ensure `down()` method is properly implemented
2. Check migration order
3. Verify no data dependencies

### Environment Issues
1. Check environment variables
2. Verify database credentials
3. Ensure database exists

## Database Configuration

The application now uses:
- **Development**: Migrations for schema changes
- **Production**: Migrations only (synchronize disabled)
- **Testing**: Separate test database

This ensures safe and controlled database schema changes across all environments. 