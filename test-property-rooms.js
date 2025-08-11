const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testPropertyCreation() {
  try {
    // First, login to get a token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'saqibiqbal3745@gmail.com',
      password: 'password123'
    });

    const token = loginResponse.data.access_token;
    console.log('Login successful, token received');

    // Create a property with rooms data
    const propertyData = {
      "listType": "both",
      "listPrice": 220,
      "listDate": "2019-06-21",
      "ExpDate": "2007-05-20",
      "alsoForLease": false,
      "priceAtLotValue": 118,
      "streetNo": "Praesentium commodo ",
      "stDirection": "north-east",
      "streetName": "Isadora Lewis",
      "streetType": "estates",
      "unitNo": "Cupidatat rem mollit",
      "city": "Suscipit quia reicie",
      "state": "florida",
      "zipCode": "36503",
      "zipCodeExt": "86430",
      "county": "kenedy",
      "subDivision": "",
      "section": "",
      "sectionNo": "",
      "legalDescription": "",
      "legalsubDivision": "",
      "masterPlannedCommunity": false,
      "masterPlannedCommunityName": "",
      "taxId": "",
      "keyMap": "",
      "censusTract": "",
      "taxId2": "",
      "taxId3": "",
      "area": "Cupidatat voluptatum",
      "marketArea": "Porro sint voluptas ",
      "etjCity": "city1",
      "elementarySchool": "Velit nihil possimus",
      "middleSchool": "Dignissimos aut qui ",
      "highSchool": "Sed voluptatem ut te",
      "secondMiddleSchool": "Veritatis fugiat te",
      "schoolDistrict": "Soluta quae sit tem",
      "publicImprovementDistrict": "Quam sunt et ea ad ",
      "buildingSqft": 40,
      "sqftSourceDirection": "seller",
      "yearBuilt": "2014",
      "yearBuiltSource": "estimation",
      "stories": "Non magna quasi est ",
      "newConstruction": true,
      "newConstructionDesc": "to-be-built-under-consstruction",
      "builderName": "Fredericka Padilla",
      "approxCompletionDate": "2016-07-06",
      "expirationDate": "1978-02-14",
      "garadgeDimenssion": "",
      "utilityDistrict": "district2",
      "garadgeAptQtrs": "",
      "SqftSource": "",
      "guestHouseSqft": null,
      "guestHouseSqftSource": "appraisal-district",
      "lotSize": 8,
      "lotSizeSource": "owner",
      "acres": "45",
      "acreage": "2 Up To 5 Acre",
      "lotDimenssions": "",
      "garage": "",
      "carport": "",
      "carportDescription": "",
      "access": [],
      "garageDescription": [],
      "garageCarportDescriptions": [],
      "restrictions": [],
      "propertyType": [],
      "style": [],
      "lotDescription": [],
      "waterfrontFeatures": [],
      "microwave": "",
      "dishwasher": "",
      "disposal": "",
      "subDivisionLakeAccess": "",
      "compactor": "",
      "separateIceMaker": "",
      "fireplaceNo": "",
      "fireplaceDescription": [],
      "counterTops": "",
      "bedrooms": [],
      "bedroomsMax": [],
      "bathsFull": [],
      "bathshalf": [],
      "bedrommDescription": [],
      "roomDescription": [],
      "bathroomDescription": [],
      "kitchenDescription": [],
      "room": [
        {
          "roomType": "",
          "roomDimension": "",
          "roomLocation": ""
        }
      ],
      "mandatoryHQA": "",
      "mandatoryHQACoName": "",
      "mandatoryHQACoPhone": "",
      "mandatoryHQACoWebsite": "",
      "financingConsideration": [],
      "disclosures": [],
      "exclusions": [],
      "lossMitigation": "none",
      "activeCommunity": "no",
      "affordableHousingProgramDescription": "Rerum aspernatur ut ",
      "maintainanceFee": "",
      "maintainanceFeeAmount": null,
      "maintainanceFeeSche": "",
      "maintananceFeeIncludes": [
        "landscaping"
      ],
      "otherMandatoryFees": "yes",
      "otherMandatoryFeesAmount": 35,
      "otherMandatoryFeesIncludes": "Amet reiciendis sim",
      "taxYear": "1990",
      "taxes": 92,
      "totalTaxRate": 25,
      "exemptions": "Et saepe quia vel ex",
      "ownershipType": "cooperative",
      "vacationRentalAllowed": true,
      "sellerEmail": "dudijame@mailinator.com",
      "subjectToAuction": "yes",
      "auctionDate": "2014-07-26",
      "onlineBidding": false,
      "biddingDeadline": "1996-01-21",
      "listAgent": "Dolorum eum aliqua ",
      "teamId": "",
      "liscensedSupervisor": "",
      "appointmentPhone": "+1 (446) 844-3988",
      "appointmentPhoneDesc": "office",
      "officePhoneExt": "+1 (173) 209-5449",
      "agentAlternatePhone": "+1 (231) 212-7755",
      "alternatePhoneDesc": "cell",
      "nightPhone": "+1 (925) 621-8119",
      "faxPhone": "+1 (528) 621-9308",
      "allowOnlineAppointmentsViaMatrix": "no",
      "idxContactInfo": "Illo magnam do quia ",
      "coListAgent": "Eos id sint voluptat",
      "showingInstructions": [],
      "buyerAgencyCompensation": "Et cumque asperiores",
      "subAgencyCompensation": "Repudiandae consequu",
      "bonus": "Quae rerum aliquip d",
      "bonusEndDate": "1992-05-04",
      "variableCompensation": null,
      "link1": "",
      "link2": "",
      "floorPlanUrl": "",
      "videoTourLink": "",
      "webHyperLink1": "Labore eos culpa pe",
      "webHyperLink2": "Ullam est eum velit ",
      "images": [
        {
          "image_url": "https://15121472.s3.us-east-1.amazonaws.com/properties/1754632670827-l7hwrqymn4k.jpg"
        },
        {
          "image_url": "https://15121472.s3.us-east-1.amazonaws.com/properties/1754632670829-10n85pi1gce.jpg"
        }
      ],
      "garageDimensions": "Nemo rerum in doloru",
      "garageAptQtrsSqFt": 89,
      "guestHouseSqFt": 42,
      "sqftSource": "appraisal",
      "frontDoorFaces": "east",
      "ovenType": "single-oven",
      "stoveType": "gas-cooktop",
      "washerDryerConnection": "gas-dryer-connections",
      "privatePoolDescription": "gunite",
      "interiorFeatures": "dryer-included",
      "flooring": "slate",
      "exteriorDescription": "cargo-lift",
      "constructionMaterials": "aluminum",
      "roofDescription": "other",
      "foundationDescription": "other",
      "energyFeatures": "energy-star/cfl/led-lights",
      "greenEnergyCertifications": "green-built-gulf-coast",
      "heatingSystemDescription": "wall-heater",
      "coolingSystemDescription": "zoned",
      "waterSewerDescription": "other-water/sewer",
      "streetSurface": "curbs",
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
        },
        {
          "id": "j1cb5t3gp",
          "roomType": "dining-room",
          "roomLocation": "1st",
          "roomDimension": "Officiis eius asperi",
          "features": [
            "1-living-area",
            "basement",
            "breakfast-room",
            "den",
            "family-room",
            "formal-dining",
            "formal-living",
            "gameroom-down",
            "garage-apartment",
            "guest-suite",
            "kitchen/dining-combo",
            "media",
            "utility-room-in-garage"
          ]
        }
      ],
      "mandatoryHOAMgmtCoName": "Cameron Carey",
      "mandatoryHOAMgmtCoPhone": "+1 (294) 369-3789",
      "mandatoryHOAMgmtCoWebsite": "https://www.bymuvybad.cc",
      "maintenanceFeeAmount": 75,
      "mandatoryHOA": "no",
      "maintenanceFee": "none",
      "maintenanceFeePaymentSched": "quarterly",
      "listTeamID": "Facilis quisquam mol",
      "licensedSupervisor": "At possimus sequi v",
      "virtualTourLink1": "Et rerum ullam sit s",
      "virtualTourLink2": "Dolore enim consequu",
      "interactiveFloorPlanURL": "Tempor deserunt veli",
      "videoTourLink1": "Ipsa beatae commodi"
    };

    console.log('Creating property with rooms data...');
    const createResponse = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Property created successfully!');
    console.log('Property ID:', createResponse.data.property.id);
    console.log('Rooms count:', createResponse.data.property.rooms?.length || 0);
    console.log('Rooms data:', JSON.stringify(createResponse.data.property.rooms, null, 2));

    // Now retrieve the property to verify the rooms data is saved
    console.log('\nRetrieving the created property...');
    const retrieveResponse = await axios.get(`${API_BASE_URL}/properties/${createResponse.data.property.id}`);
    
    console.log('Property retrieved successfully!');
    console.log('Retrieved rooms count:', retrieveResponse.data.property.rooms?.length || 0);
    console.log('Retrieved rooms data:', JSON.stringify(retrieveResponse.data.property.rooms, null, 2));

    // Check if all the new fields are present
    const newFields = [
      'rooms', 'garageDimensions', 'garageAptQtrsSqFt', 'sqftSource', 'guestHouseSqFt',
      'maintenanceFee', 'maintenanceFeeAmount', 'maintenanceFeePaymentSched', 'maintenanceFeeIncludes',
      'listTeamID', 'licensedSupervisor', 'mandatoryHOA', 'videoTourLink1', 'virtualTourLink1',
      'virtualTourLink2', 'interactiveFloorPlanURL', 'frontDoorFaces', 'ovenType', 'stoveType',
      'washerDryerConnection', 'privatePoolDescription', 'interiorFeatures', 'flooring',
      'exteriorDescription', 'constructionMaterials', 'roofDescription', 'foundationDescription',
      'energyFeatures', 'greenEnergyCertifications', 'heatingSystemDescription', 'coolingSystemDescription',
      'waterSewerDescription', 'streetSurface', 'mandatoryHOAMgmtCoName', 'mandatoryHOAMgmtCoPhone',
      'mandatoryHOAMgmtCoWebsite'
    ];

    console.log('\nChecking for new fields:');
    newFields.forEach(field => {
      const value = retrieveResponse.data.property[field];
      console.log(`${field}: ${value !== undefined ? '✓ Present' : '✗ Missing'} ${value !== undefined ? `(${JSON.stringify(value)})` : ''}`);
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testPropertyCreation(); 