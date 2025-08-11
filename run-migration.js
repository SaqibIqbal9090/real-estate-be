const { Client } = require('pg');

// Database configuration - update these values according to your setup
const config = {
  host: 'localhost',
  port: 5432,
  database: 'real_estate', // or your database name
  user: 'postgres', // or your database user
  password: 'password', // or your database password
};

async function runMigration() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to database');

    // Read and execute the migration SQL
    const fs = require('fs');
    const migrationSQL = fs.readFileSync('./database-migration.sql', 'utf8');
    
    console.log('Running migration...');
    await client.query(migrationSQL);
    
    console.log('Migration completed successfully!');
    
    // Verify the columns were added
    const result = await client.query(`
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
    `);
    
    console.log('\nVerification - Added columns:');
    result.rows.forEach(row => {
      console.log(`✓ ${row.column_name} (${row.data_type})`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

runMigration(); 