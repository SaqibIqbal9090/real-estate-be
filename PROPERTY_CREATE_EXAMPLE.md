# Complete Property Creation Example

## Working Payload for POST /properties

```json
{
  "listType": "sale",
  "listPrice": 450000,
  "listDate": "2024-01-15",
  "ExpDate": "2024-12-31",
  "alsoForLease": false,
  "priceAtLotValue": 0,
  "streetNo": "123",
  "stDirection": "N",
  "streetName": "Main Street",
  "streetType": "Ave",
  "unitNo": "Apt 101",
  "city": "Austin",
  "state": "TX",
  "zipCode": "78701",
  "zipCodeExt": "1234",
  "county": "Travis",
  "subDivision": "Downtown Heights",
  "section": "A",
  "sectionNo": "1",
  "legalDescription": "Lot 1, Block A, Downtown Heights Subdivision",
  "legalsubDivision": "Downtown Heights",
  "masterPlannedCommunity": false,
  "masterPlannedCommunityName": "",
  "taxId": "123456789",
  "keyMap": "A1",
  "censusTract": "1234.56",
  "taxId2": "",
  "taxId3": "",
  "area": "Downtown",
  "marketArea": "Central Austin",
  "etjCity": "Austin",
  "elementrySchool": "Downtown Elementary",
  "middleSchool": "Downtown Middle",
  "highSchool": "Downtown High",
  "secondMiddleSchool": "",
  "schoolDistrict": "Austin ISD",
  "publicImprovementDistrict": "Downtown PID",
  "buildingSqft": 2500,
  "sqftSourceDirection": "Appraiser",
  "yearBuilt": "2020",
  "yearBuiltSource": "County Records",
  "stories": "2",
  "newConstruction": false,
  "newConstructionDesc": "",
  "builderName": "ABC Builders",
  "approxCompletionDate": "2024-06-15",
  "expirationDate": "2024-12-31",
  "garadgeDimenssion": "20x20",
  "utilityDistrict": "Austin Energy",
  "garadgeAptQtrs": "None",
  "SqftSource": "Appraiser",
  "guestHouseSqft": 0,
  "guestHouseSqftSource": "",
  "lotSize": 0.25,
  "lotSizeSource": "Survey",
  "acres": "0.25",
  "acreage": "0.25",
  "lotDimenssions": "100x100",
  "garage": "2 Car",
  "carport": "None",
  "carportDescription": "",
  "access": ["Paved Street", "Public Road"],
  "garageDescription": ["Attached", "2 Car"],
  "garageCarportDescriptions": ["Attached 2 Car Garage"],
  "restrictions": ["HOA Rules", "City Zoning"],
  "propertyType": ["Single Family"],
  "style": ["Modern", "Contemporary"],
  "lotDescription": ["Level", "Well Landscaped"],
  "waterfrontFeatures": [],
  "microwave": "Built-in",
  "dishwasher": "Yes",
  "disposal": "Yes",
  "subDivisionLakeAccess": "None",
  "compactor": "No",
  "separateIceMaker": "No",
  "fireplaceNo": "1",
  "fireplaceDescription": ["Gas Logs", "Stone Mantel"],
  "counterTops": "Granite",
  "bedrooms": ["3", "4"],
  "bedroomsMax": ["4"],
  "bathsFull": ["2", "2.5"],
  "bathshalf": ["1"],
  "bedrommDescription": ["Master Suite", "Guest Rooms"],
  "roomDescription": ["Open Floor Plan", "High Ceilings"],
  "bathroomDescription": ["Marble Countertops", "Walk-in Shower"],
  "kitchenDescription": ["Granite Countertops", "Stainless Appliances"],
  "room": [
    {
      "roomType": "Living Room",
      "roomDimension": "20x15",
      "roomLocation": "Main Level"
    },
    {
      "roomType": "Kitchen",
      "roomDimension": "15x12",
      "roomLocation": "Main Level"
    }
  ],
  "mandatoryHQA": "Yes",
  "mandatoryHQACoName": "ABC Management",
  "mandatoryHQACoPhone": "512-555-0123",
  "mandatoryHQACoWebsite": "https://abcmgmt.com",
  "financingConsideration": ["Conventional", "FHA"],
  "disclosures": ["Seller Disclosure", "Lead Paint"],
  "exclusions": ["Refrigerator", "Washer/Dryer"],
  "lossMitigation": "None",
  "activeCommunity": "Downtown Heights HOA",
  "affordableHousingProgramDescription": "",
  "maintainanceFee": "Yes",
  "maintainanceFeeAmount": 150.00,
  "maintainanceFeeSche": "Monthly",
  "maintananceFeeIncludes": ["Landscaping", "Pool Maintenance"],
  "otherMandatoryFees": "None",
  "otherMandatoryFeesAmount": 0,
  "otherMandatoryFeesIncludes": "",
  "taxYear": "2023",
  "taxes": 8500.00,
  "totalTaxRate": 0.0250,
  "exemptions": "Homestead",
  "ownershipType": "Fee Simple",
  "vacationRentalAllowed": false,
  "sellerEmail": "seller@example.com",
  "subjectToAuction": "No",
  "auctionDate": null,
  "onlineBidding": false,
  "biddingDeadline": "",
  "listAgent": "realestatemarketplaceintl",
  "teamId": "TEAM001",
  "liscensedSupervisor": "John Smith",
  "appointmentPhone": "512-555-0123",
  "appointmentPhoneDesc": "Main Office",
  "officePhoneExt": "101",
  "agentAlternatePhone": "512-555-0124",
  "alternatePhoneDesc": "Mobile",
  "nightPhone": "512-555-0125",
  "faxPhone": "512-555-0126",
  "allowOnlineAppointmentsViaMatrix": "Yes",
  "idxContactInfo": "IDX Contact",
  "coListAgent": "realestatemarketplaceintl",
  "showingInstructions": ["24 Hour Notice", "Lockbox"],
  "buyerAgencyCompensation": "3%",
  "subAgencyCompensation": "2.5%",
  "bonus": "None",
  "bonusEndDate": null,
  "variableCompensation": 0,
  "link1": "https://example.com/property1",
  "link2": "https://example.com/property2",
  "floorPlanUrl": "https://example.com/floorplan",
  "videoTourLink": "https://example.com/video",
  "webHyperLink1": "https://example.com/link1",
  "webHyperLink2": "https://example.com/link2",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "userId": "your-user-uuid-here"
}
```

## Key Points to Fix Your Issues:

### 1. **Field Name Corrections**
Your frontend is sending wrong field names. Here are the correct ones:

| ❌ Wrong | ✅ Correct |
|----------|------------|
| `elementarySchool` | `elementrySchool` |
| `garageDimensions` | `garadgeDimenssion` |
| `garageAptQtrsSqFt` | `garadgeAptQtrs` |
| `guestHouseSqFt` | `guestHouseSqft` |
| `sqftSource` | `SqftSource` |
| `frontDoorFaces` | (not in model) |
| `ovenType` | (not in model) |
| `stoveType` | (not in model) |
| `washerDryerConnection` | (not in model) |
| `privatePoolDescription` | (not in model) |
| `interiorFeatures` | (not in model) |
| `flooring` | (not in model) |
| `exteriorDescription` | (not in model) |
| `constructionMaterials` | (not in model) |
| `roofDescription` | (not in model) |
| `foundationDescription` | (not in model) |
| `energyFeatures` | (not in model) |
| `greenEnergyCertifications` | (not in model) |
| `heatingSystemDescription` | (not in model) |
| `coolingSystemDescription` | (not in model) |
| `waterSewerDescription` | (not in model) |
| `streetSurface` | (not in model) |
| `rooms` | `room` (array of objects) |
| `mandatoryHOAMgmtCoName` | `mandatoryHQACoName` |
| `mandatoryHOAMgmtCoPhone` | `mandatoryHQACoPhone` |
| `mandatoryHOAMgmtCoWebsite` | `mandatoryHQACoWebsite` |
| `maintenanceFeeAmount` | `maintainanceFeeAmount` |
| `mandatoryHOA` | `mandatoryHQA` |
| `maintenanceFee` | `maintainanceFee` |
| `maintenanceFeePaymentSched` | `maintainanceFeeSche` |
| `maintenanceFeeIncludes` | `maintananceFeeIncludes` |
| `listTeamID` | `teamId` |
| `licensedSupervisor` | `liscensedSupervisor` |
| `interactiveFloorPlanURL` | `floorPlanUrl` |
| `videoTourLink1` | `videoTourLink` |
| `virtualTourLink1` | `webHyperLink1` |
| `virtualTourLink2` | `webHyperLink2` |

### 2. **Data Type Requirements**

#### **Boolean Fields** (must be true/false, not strings):
```json
{
  "alsoForLease": false,
  "masterPlannedCommunity": false,
  "newConstruction": false,
  "vacationRentalAllowed": false,
  "onlineBidding": false
}
```

#### **Array Fields** (must be arrays, not strings):
```json
{
  "access": ["Paved Street", "Public Road"],
  "garageDescription": ["Attached", "2 Car"],
  "restrictions": ["HOA Rules"],
  "propertyType": ["Single Family"],
  "style": ["Modern"],
  "bedrooms": ["3", "4"],
  "bathsFull": ["2", "2.5"],
  "showingInstructions": ["24 Hour Notice"]
}
```

#### **Number Fields** (must be numbers, not strings):
```json
{
  "listPrice": 450000,
  "buildingSqft": 2500,
  "lotSize": 0.25,
  "maintainanceFeeAmount": 150.00,
  "taxes": 8500.00,
  "totalTaxRate": 0.0250,
  "variableCompensation": 0
}
```

#### **String Fields** (must be strings):
```json
{
  "acres": "0.25",
  "listType": "sale"
}
```

### 3. **Required Fields**
These fields are required and must be provided:
- `listType` (must be "sale", "lease", or "both")
- `listPrice` (number, minimum 0)
- `streetNo` (string)
- `streetName` (string)
- `city` (string)
- `state` (string)
- `zipCode` (string)
- `userId` (UUID)

### 4. **Room Object Structure**
The `room` field must be an array of objects with this structure:
```json
"room": [
  {
    "roomType": "Living Room",
    "roomDimension": "20x15",
    "roomLocation": "Main Level"
  }
]
```

## Test with cURL

```bash
curl -X POST http://localhost:3200/properties \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d @property-payload.json
```

## Common Issues to Check:

1. **Field Names**: Make sure all field names match exactly
2. **Data Types**: Ensure booleans are true/false, not "true"/"false"
3. **Arrays**: Ensure array fields are actual arrays, not strings
4. **Numbers**: Ensure numeric fields are numbers, not strings
5. **UUID**: Make sure userId is a valid UUID
6. **Required Fields**: Include all required fields

Use this exact payload structure and your property creation should work! 