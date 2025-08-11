-- Database Migration Script
-- Add missing columns to properties table

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

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN (
  'rooms', 'garageDimensions', 'garageAptQtrsSqFt', 'sqftSource', 'guestHouseSqFt',
  'frontDoorFaces', 'ovenType', 'stoveType', 'washerDryerConnection', 'privatePoolDescription',
  'interiorFeatures', 'flooring', 'exteriorDescription', 'constructionMaterials',
  'roofDescription', 'foundationDescription', 'energyFeatures', 'greenEnergyCertifications',
  'heatingSystemDescription', 'coolingSystemDescription', 'waterSewerDescription', 'streetSurface',
  'mandatoryHOA', 'mandatoryHOAMgmtCoName', 'mandatoryHOAMgmtCoPhone', 'mandatoryHOAMgmtCoWebsite',
  'maintenanceFee', 'maintenanceFeeAmount', 'maintenanceFeePaymentSched', 'maintenanceFeeIncludes',
  'listTeamID', 'licensedSupervisor', 'videoTourLink1', 'virtualTourLink1', 'virtualTourLink2',
  'interactiveFloorPlanURL'
)
ORDER BY column_name; 