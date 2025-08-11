# Property Rooms Field Fix

## Problem
The property creation API was not properly handling the `rooms` array data and several other fields were missing from the response. The frontend was sending a `rooms` field with detailed room information including features, but the backend was only storing it in a `room` field with a different structure.

## Root Cause
1. **Missing `rooms` field in Property model**: The model only had a `room` field but the frontend was sending `rooms` with a different structure
2. **Missing fields in Property model**: Several fields that were in the DTO were missing from the model
3. **Field mapping issues**: Some fields had different names between the frontend payload and the model

## Solution

### 1. Updated Property Model (`src/properties/property.model.ts`)

Added the missing `rooms` field and other missing fields:

```typescript
// Additional Rooms Field (frontend sends this)
@Column({
  type: DataType.JSON,
  allowNull: true,
})
rooms: Array<{
  id: string;
  roomType: string;
  roomLocation: string;
  roomDimension: string;
  features: string[];
}>;

// Additional HOA Management Fields
@Column({
  type: DataType.STRING,
  allowNull: true,
})
mandatoryHOA: string;

@Column({
  type: DataType.STRING,
  allowNull: true,
})
mandatoryHOAMgmtCoName: string;

// Additional Maintenance Fields
@Column({
  type: DataType.STRING,
  allowNull: true,
})
maintenanceFee: string;

@Column({
  type: DataType.DECIMAL(10, 2),
  allowNull: true,
})
maintenanceFeeAmount: number;

// Additional Property Features
@Column({
  type: DataType.STRING,
  allowNull: true,
})
frontDoorFaces: string;

@Column({
  type: DataType.STRING,
  allowNull: true,
})
ovenType: string;

// ... and many more fields
```

### 2. Updated Properties Service (`src/properties/properties.service.ts`)

Added helper functions to map between frontend and database field names:

```typescript
// Helper function to map property data to frontend expected format
private mapPropertyToFrontendFormat(propertyData: any): any {
  return {
    ...propertyData,
    // Ensure rooms field is present
    rooms: propertyData.rooms || propertyData.room || [],
    // Map other fields to frontend expected names
    garageDimensions: propertyData.garageDimensions || propertyData.garadgeDimenssion,
    garageAptQtrsSqFt: propertyData.garageAptQtrsSqFt,
    sqftSource: propertyData.sqftSource || propertyData.SqftSource,
    // ... and many more mappings
  };
}

// Helper function to map frontend data to database format
private mapFrontendToDatabaseFormat(propertyData: any): any {
  return {
    ...propertyData,
    // Map rooms to the correct field
    rooms: propertyData.rooms || propertyData.room,
    // Map other fields that might have different names
    garageDimensions: propertyData.garageDimensions || propertyData.garadgeDimenssion,
    // ... and many more mappings
  };
}
```

Updated all service methods to use these helper functions:
- `create()`: Maps frontend data to database format
- `findOne()`: Maps database data to frontend format
- `findAll()`: Maps all properties to frontend format
- `findByUserId()`: Maps all properties to frontend format
- `searchProperties()`: Maps all properties to frontend format
- `update()`: Maps frontend data to database format

### 3. Fields Added/Updated

#### New Fields Added:
- `rooms` - Array of room objects with features
- `garageDimensions` - Garage dimensions
- `garageAptQtrsSqFt` - Garage apartment square footage
- `sqftSource` - Square footage source
- `guestHouseSqFt` - Guest house square footage
- `maintenanceFee` - Maintenance fee
- `maintenanceFeeAmount` - Maintenance fee amount
- `maintenanceFeePaymentSched` - Maintenance fee payment schedule
- `maintenanceFeeIncludes` - What maintenance fee includes
- `listTeamID` - List team ID
- `licensedSupervisor` - Licensed supervisor
- `mandatoryHOA` - Mandatory HOA
- `videoTourLink1` - Video tour link 1
- `virtualTourLink1` - Virtual tour link 1
- `virtualTourLink2` - Virtual tour link 2
- `interactiveFloorPlanURL` - Interactive floor plan URL
- `frontDoorFaces` - Front door faces direction
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
- `mandatoryHOAMgmtCoName` - Mandatory HOA management company name
- `mandatoryHOAMgmtCoPhone` - Mandatory HOA management company phone
- `mandatoryHOAMgmtCoWebsite` - Mandatory HOA management company website

## Testing

Created a test script (`test-property-rooms.js`) to verify:
1. Property creation with rooms data works correctly
2. All new fields are properly saved and retrieved
3. Field mapping works in both directions

## Result

Now when a property is created with the `rooms` array containing detailed room information with features, it will be properly saved to the database and returned in the response. All the missing fields are now available and properly mapped between frontend and backend formats.

## Usage

The API now properly handles the rooms field structure:

```json
{
  "rooms": [
    {
      "id": "18zeeta6c",
      "roomType": "extra-room",
      "roomLocation": "4th",
      "roomDimension": "Est sit voluptas mi",
      "features": [
        "basement",
        "breakfast-room",
        "den",
        "formal-living",
        "gameroom-down",
        "gameroom-up",
        "guest-suite",
        "guest-suite-w/kitchen",
        "kitchen/dining-combo",
        "library",
        "living-area-1st-floor",
        "living-area-2nd-floor",
        "media",
        "sun-room",
        "utility-room-in-garage"
      ]
    }
  ]
}
```

This will be properly saved and retrieved with all the room details and features intact. 