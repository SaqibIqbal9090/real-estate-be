# Database Fix Instructions

## Problem
The error shows that the database table `properties` doesn't have the new columns that were added to the Property model. The error specifically mentions:
```
column "garageDimensions" of relation "properties" does not exist
```

## Solution Options

### Option 1: Run Database Migration (Recommended)

1. **Update database configuration** in `run-migration.js`:
   ```javascript
   const config = {
     host: 'localhost',
     port: 5432,
     database: 'real_estate', // Update to your database name
     user: 'postgres', // Update to your database user
     password: 'password', // Update to your database password
   };
   ```

2. **Install pg package** (if not already installed):
   ```bash
   npm install pg
   ```

3. **Run the migration**:
   ```bash
   node run-migration.js
   ```

4. **Verify the migration** by checking the output - it should show all the new columns were added.

### Option 2: Manual SQL Execution

1. **Connect to your PostgreSQL database** using psql or any database client.

2. **Run the SQL commands** from `database-migration.sql`:
   ```sql
   -- Add rooms column
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "rooms" JSON;
   
   -- Add garage-related columns
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "garageDimensions" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "garageAptQtrsSqFt" INTEGER;
   
   -- Add sqft-related columns
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "sqftSource" VARCHAR(255);
   
   -- Add guest house columns
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "guestHouseSqFt" INTEGER;
   
   -- Add property feature columns
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "frontDoorFaces" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "ovenType" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "stoveType" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "washerDryerConnection" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "privatePoolDescription" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "interiorFeatures" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "flooring" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "exteriorDescription" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "constructionMaterials" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "roofDescription" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "foundationDescription" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "energyFeatures" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "greenEnergyCertifications" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "heatingSystemDescription" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "coolingSystemDescription" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "waterSewerDescription" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "streetSurface" VARCHAR(255);
   
   -- Add HOA management columns
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "mandatoryHOA" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "mandatoryHOAMgmtCoName" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "mandatoryHOAMgmtCoPhone" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "mandatoryHOAMgmtCoWebsite" VARCHAR(255);
   
   -- Add maintenance fee columns
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "maintenanceFee" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "maintenanceFeeAmount" DECIMAL(10,2);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "maintenanceFeePaymentSched" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "maintenanceFeeIncludes" JSON;
   
   -- Add team and supervisor columns
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "listTeamID" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "licensedSupervisor" VARCHAR(255);
   
   -- Add virtual tour and floor plan columns
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "videoTourLink1" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "virtualTourLink1" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "virtualTourLink2" VARCHAR(255);
   ALTER TABLE properties ADD COLUMN IF NOT EXISTS "interactiveFloorPlanURL" VARCHAR(255);
   ```

### Option 3: Enable Sequelize Sync (Development Only)

**⚠️ WARNING: This will drop and recreate tables in development!**

1. **Find your database configuration** (usually in `src/config/database.config.ts` or similar)

2. **Enable sync** by setting:
   ```typescript
   synchronize: true,
   ```

3. **Restart your application** - Sequelize will automatically create the missing columns.

4. **Disable sync** after the columns are created to prevent data loss.

## After Running Migration

1. **Restart your NestJS application**

2. **Test the property creation** using the test script:
   ```bash
   node test-property-rooms.js
   ```

3. **Verify that the rooms field** is now properly saved and retrieved.

## Current Status

- ✅ Property model updated with `rooms` field
- ✅ Service methods updated with field mapping
- ✅ Test script created
- ❌ Database columns missing (needs migration)

## Next Steps

1. Run the database migration
2. Test property creation
3. Re-enable full field mapping in the service
4. Add remaining fields to the Property model 