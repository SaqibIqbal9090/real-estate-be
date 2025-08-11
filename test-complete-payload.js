const axios = require('axios');

const API_BASE_URL = 'http://localhost:3200';

async function testCompletePayload() {
  try {
    // First, login to get a token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'saqibiqbal3745@gmail.com',
      password: 'password123'
    });

    const token = loginResponse.data.access_token;
    console.log('Login successful, token received');

    // Complete payload matching the user's example
    const completePayload = {
      "listType": "lease",
      "listPrice": 900,
      "listDate": "1973-06-22",
      "ExpDate": "1974-02-16",
      "alsoForLease": false,
      "priceAtLotValue": 689,
      "streetNo": "Dolore exercitation ",
      "stDirection": "west",
      "streetName": "Kevyn Cruz",
      "streetType": "cresent",
      "unitNo": "Voluptatibus eum obc",
      "city": "In adipisicing molli",
      "state": "montana",
      "zipCode": "64086",
      "zipCodeExt": "32672",
      "county": "eastland",
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
      "area": "Voluptas ducimus es",
      "marketArea": "Quibusdam esse et p",
      "etjCity": "city3",
      "elementarySchool": "e",
      "middleSchool": "Iure dolor dolore qu",
      "highSchool": "Expedita et quibusda",
      "secondMiddleSchool": "Ad sed occaecat omni",
      "schoolDistrict": "Perferendis dolore o",
      "publicImprovementDistrict": "Architecto aut aut q",
      "buildingSqft": 59,
      "sqftSourceDirection": "seller",
      "yearBuilt": "1985",
      "yearBuiltSource": "owner",
      "stories": "Consequatur Veritat",
      "newConstruction": true,
      "newConstructionDesc": "never-livedin",
      "builderName": "Christian Bender",
      "approxCompletionDate": "1984-03-09",
      "expirationDate": "1997-08-19",
      "garadgeDimenssion": "",
      "utilityDistrict": "district2",
      "garadgeAptQtrs": "",
      "SqftSource": "",
      "guestHouseSqft": null,
      "guestHouseSqftSource": "appraisal",
      "lotSize": 43,
      "lotSizeSource": "appraisal-district",
      "acres": "88",
      "acreage": "50 or more Acres",
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
      "lossMitigation": "foreclosure",
      "activeCommunity": "no",
      "affordableHousingProgramDescription": "Eum quis quo eos te",
      "maintainanceFee": "",
      "maintainanceFeeAmount": null,
      "maintainanceFeeSche": "",
      "maintananceFeeIncludes": [
        "security"
      ],
      "otherMandatoryFees": "no",
      "otherMandatoryFeesAmount": 9,
      "otherMandatoryFeesIncludes": "Beatae at sed impedi",
      "taxYear": "1991",
      "taxes": 51,
      "totalTaxRate": 5,
      "exemptions": "Nisi et sapiente eaq",
      "ownershipType": "timeshare",
      "vacationRentalAllowed": false,
      "sellerEmail": "ryxo@mailinator.com",
      "subjectToAuction": "no",
      "auctionDate": "2024-09-20",
      "onlineBidding": true,
      "biddingDeadline": "1983-09-14",
      "listAgent": "Ducimus ratione ut ",
      "teamId": "",
      "liscensedSupervisor": "",
      "appointmentPhone": "+1 (123) 527-5334",
      "appointmentPhoneDesc": "home",
      "officePhoneExt": "+1 (372) 129-7047",
      "agentAlternatePhone": "+1 (228) 136-3218",
      "alternatePhoneDesc": "home",
      "nightPhone": "+1 (569) 341-7881",
      "faxPhone": "+1 (544) 126-7993",
      "allowOnlineAppointmentsViaMatrix": "yes",
      "idxContactInfo": "Quis soluta sunt vol",
      "coListAgent": "Modi sint quo quisqu",
      "showingInstructions": [],
      "buyerAgencyCompensation": "Aut in eius vel opti",
      "subAgencyCompensation": "Voluptatem consequat",
      "bonus": "Perferendis labore o",
      "bonusEndDate": "1988-05-18",
      "variableCompensation": null,
      "link1": "",
      "link2": "",
      "floorPlanUrl": "",
      "videoTourLink": "",
      "webHyperLink1": "Facere id quia ut no",
      "webHyperLink2": "Mollit voluptas ut c",
      "images": [
        {
          "image_url": "https://15121472.s3.us-east-1.amazonaws.com/properties/1754634954810-i68i25ttyv.jpg"
        }
      ],
      "garageDimensions": "Doloremque quis dolo",
      "garageAptQtrsSqFt": 83,
      "guestHouseSqFt": 34,
      "sqftSource": "appraisal",
      "frontDoorFaces": "south",
      "ovenType": "single-oven",
      "stoveType": "electric-cooktop",
      "washerDryerConnection": "washer-connections",
      "privatePoolDescription": "fiberglass",
      "interiorFeatures": "alarm-system-leased",
      "flooring": "stone",
      "exteriorDescription": "back-yard-fenced",
      "constructionMaterials": "synthetic-stucco",
      "roofDescription": "composition",
      "foundationDescription": "slab-on-builders-pier",
      "energyFeatures": "ceiling-fans",
      "greenEnergyCertifications": "other-green-certification",
      "heatingSystemDescription": "wall-heater",
      "coolingSystemDescription": "central-electric",
      "waterSewerDescription": "water-district",
      "streetSurface": "dirt",
      "rooms": [
        {
          "id": "63njlh4et",
          "roomType": "guest-w/kitchen",
          "roomLocation": "2nd",
          "roomDimension": "Ea quidem est qui el",
          "features": [
            "1-living-area",
            "basement",
            "breakfast-room",
            "den",
            "garage-apartment",
            "guest-suite-w/kitchen",
            "home-office/study",
            "kitchen/dining-combo",
            "living-area-1st-floor",
            "living-area-3rd-floor",
            "utility-room-in-house"
          ]
        }
      ],
      "mandatoryHOAMgmtCoName": "Jack Crane",
      "mandatoryHOAMgmtCoPhone": "+1 (409) 823-5577",
      "mandatoryHOAMgmtCoWebsite": "https://www.hegic.net",
      "maintenanceFeeAmount": 73,
      "mandatoryHOA": "yes",
      "maintenanceFee": "annual",
      "maintenanceFeePaymentSched": "annually",
      "listTeamID": "In perferendis aliqu",
      "licensedSupervisor": "Nisi dolores ex corr",
      "virtualTourLink1": "Sit ullam illum non",
      "virtualTourLink2": "Accusamus eiusmod ex",
      "interactiveFloorPlanURL": "Veniam quo id exerc",
      "videoTourLink1": "Et consequatur et m"
    };

    console.log('Creating property with complete payload...');
    const createResponse = await axios.post(`${API_BASE_URL}/properties`, completePayload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Property created successfully!');
    console.log('Property ID:', createResponse.data.property.id);
    
    // Check if all the new fields are present in the response
    const newFields = [
      'rooms', 'garageDimensions', 'garageAptQtrsSqFt', 'sqftSource', 'guestHouseSqFt',
      'frontDoorFaces', 'ovenType', 'stoveType', 'washerDryerConnection', 'privatePoolDescription',
      'interiorFeatures', 'flooring', 'exteriorDescription', 'constructionMaterials',
      'roofDescription', 'foundationDescription', 'energyFeatures', 'greenEnergyCertifications',
      'heatingSystemDescription', 'coolingSystemDescription', 'waterSewerDescription', 'streetSurface',
      'mandatoryHOA', 'mandatoryHOAMgmtCoName', 'mandatoryHOAMgmtCoPhone', 'mandatoryHOAMgmtCoWebsite',
      'maintenanceFee', 'maintenanceFeeAmount', 'maintenanceFeePaymentSched', 'maintenanceFeeIncludes',
      'listTeamID', 'licensedSupervisor', 'videoTourLink1', 'virtualTourLink1', 'virtualTourLink2',
      'interactiveFloorPlanURL'
    ];

    console.log('\nChecking for new fields in create response:');
    newFields.forEach(field => {
      const value = createResponse.data.property[field];
      console.log(`${field}: ${value !== undefined ? '✓ Present' : '✗ Missing'} ${value !== undefined ? `(${JSON.stringify(value)})` : ''}`);
    });

    // Now retrieve the property to verify the data is saved
    console.log('\nRetrieving the created property...');
    const retrieveResponse = await axios.get(`${API_BASE_URL}/properties/${createResponse.data.property.id}`);

    console.log('Property retrieved successfully!');
    
    console.log('\nChecking for new fields in retrieve response:');
    newFields.forEach(field => {
      const value = retrieveResponse.data.property[field];
      console.log(`${field}: ${value !== undefined ? '✓ Present' : '✗ Missing'} ${value !== undefined ? `(${JSON.stringify(value)})` : ''}`);
    });

    // Check specific important fields
    console.log('\nChecking specific important fields:');
    console.log('Rooms count:', retrieveResponse.data.property.rooms?.length || 0);
    console.log('Rooms data:', JSON.stringify(retrieveResponse.data.property.rooms, null, 2));
    console.log('Garage Dimensions:', retrieveResponse.data.property.garageDimensions);
    console.log('Maintenance Fee:', retrieveResponse.data.property.maintenanceFee);
    console.log('Mandatory HOA:', retrieveResponse.data.property.mandatoryHOA);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCompletePayload(); 