// Test script to verify property creation
const axios = require('axios');

const API_BASE = 'http://localhost:3200';

async function testPropertyCreation() {
  try {
    console.log('🏠 Testing Property Creation...\n');

    // First, register a user to get a valid userId
    console.log('1️⃣ Registering a user...');
    const timestamp = Date.now();
    const registerData = {
      fullName: 'Test User',
      email: `test${timestamp}@example.com`,
      password: 'password123'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ User registered successfully');
    const userId = registerResponse.data.user.id;

    // Wait a moment for the database to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test property creation with the user's payload
    console.log('\n2️⃣ Creating property...');
    
    const propertyData = {
      "listType": "sale",
      "listPrice": 135,
      "listDate": "1975-06-29",
      "ExpDate": "1981-05-14",
      "alsoForLease": true,
      "priceAtLotValue": 408,
      "streetNo": "Magnam sed sit vel m",
      "stDirection": "north-east",
      "streetName": "Veronica Koch",
      "streetType": "bypass",
      "unitNo": "Voluptatem tempora m",
      "city": "Veritatis aut fugiat",
      "state": "wyoming",
      "zipCode": "23691",
      "zipCodeExt": "19946",
      "county": "hopkins",
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
      "area": "Autem ducimus iure ",
      "marketArea": "Optio odit ad venia",
      "etjCity": "city1",
      "elementrySchool": "",
      "elementarySchool": "Cum sit praesentium",
      "middleSchool": "Amet commodo except",
      "highSchool": "Et aliquam optio co",
      "secondMiddleSchool": "Non ea labore vitae ",
      "schoolDistrict": "Voluptatem Vero et ",
      "publicImprovementDistrict": "Sed in expedita quae",
      "buildingSqft": 48,
      "sqftSourceDirection": "seller",
      "yearBuilt": "1982",
      "yearBuiltSource": "appraisal-district",
      "stories": "Quod cumque aut ut v",
      "newConstruction": false,
      "newConstructionDesc": "never-livedin",
      "builderName": "Zorita Haney",
      "approxCompletionDate": "1971-11-21",
      "expirationDate": "1974-01-08",
      "garadgeDimenssion": "",
      "garageDimensions": "Ipsa et error qui e",
      "utilityDistrict": "district1",
      "garadgeAptQtrs": "",
      "garageAptQtrsSqFt": 62,
      "SqftSource": "",
      "sqftSource": "seller",
      "guestHouseSqft": null,
      "guestHouseSqFt": 91,
      "guestHouseSqftSource": "builder",
      "lotSize": 19,
      "lotSizeSource": "survey",
      "acres": "73",
      "acreage": "1/4 Up To 1/2 Acre",
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
      "frontDoorFaces": "northeast",
      "ovenType": "single-oven",
      "stoveType": "gas-cooktop",
      "washerDryerConnection": "washer-connections",
      "privatePoolDescription": "fiberglass",
      "interiorFeatures": "balcony",
      "flooring": "terrazo",
      "exteriorDescription": "back-yard",
      "constructionMaterials": "brick",
      "roofDescription": "slate",
      "foundationDescription": "other",
      "energyFeatures": "energy-star-appliances",
      "greenEnergyCertifications": "environments-for-living",
      "heatingSystemDescription": "other-heating",
      "coolingSystemDescription": "window-units",
      "waterSewerDescription": "public-sewer",
      "streetSurface": "curbs",
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
      "rooms": [
        {
          "id": "tr04kkoyh",
          "roomType": "dining-room",
          "roomLocation": "2nd",
          "roomDimension": "Lorem nostrud ea in ",
          "features": [
            "breakfast-room",
            "den",
            "family-room",
            "formal-living",
            "guest-suite",
            "guest-suite-w/kitchen",
            "living-area-3rd-floor",
            "loft",
            "quarters/guest-house",
            "sun-room",
            "utility-room-in-garage"
          ]
        }
      ],
      "mandatoryHQA": "",
      "mandatoryHOA": "yes",
      "mandatoryHQACoName": "",
      "mandatoryHOAMgmtCoName": "Ralph Gaines",
      "mandatoryHQACoPhone": "",
      "mandatoryHOAMgmtCoPhone": "+1 (582) 371-1194",
      "mandatoryHQACoWebsite": "",
      "mandatoryHOAMgmtCoWebsite": "https://www.xamiqome.in",
      "financingConsideration": [],
      "disclosures": [],
      "exclusions": [],
      "lossMitigation": "short-sale",
      "activeCommunity": "no",
      "affordableHousingProgramDescription": "At repudiandae aut e",
      "maintainanceFee": "",
      "maintenanceFee": "none",
      "maintainanceFeeAmount": null,
      "maintenanceFeeAmount": 40,
      "maintainanceFeeSche": "",
      "maintenanceFeePaymentSched": "quarterly",
      "maintananceFeeIncludes": [],
      "maintenanceFeeIncludes": ["trash"],
      "otherMandatoryFees": "yes",
      "otherMandatoryFeesAmount": 3,
      "otherMandatoryFeesIncludes": "Irure qui sequi adip",
      "taxYear": "1972",
      "taxes": 75,
      "totalTaxRate": 37,
      "exemptions": "Irure quis voluptati",
      "ownershipType": "cooperative",
      "vacationRentalAllowed": true,
      "sellerEmail": "kolusugusi@mailinator.com",
      "subjectToAuction": "no",
      "auctionDate": "1980-12-08",
      "onlineBidding": true,
      "biddingDeadline": "2023-12-17",
      "listAgent": "Sint beatae ea fugia",
      "teamId": "",
      "listTeamID": "Adipisicing aliquid ",
      "liscensedSupervisor": "",
      "licensedSupervisor": "Unde voluptatem in n",
      "appointmentPhone": "+1 (465) 135-6146",
      "appointmentPhoneDesc": "cell",
      "officePhoneExt": "+1 (156) 407-1722",
      "agentAlternatePhone": "+1 (425) 409-9959",
      "alternatePhoneDesc": "cell",
      "nightPhone": "+1 (765) 823-6456",
      "faxPhone": "+1 (492) 265-1181",
      "allowOnlineAppointmentsViaMatrix": "no",
      "idxContactInfo": "Laudantium cum accu",
      "coListAgent": "Ad quis quia do ut v",
      "showingInstructions": [],
      "buyerAgencyCompensation": "Quo amet nihil quos",
      "subAgencyCompensation": "Officiis aute nulla ",
      "bonus": "Eum labore non in ut",
      "bonusEndDate": "1990-10-20",
      "variableCompensation": null,
      "link1": "",
      "link2": "",
      "floorPlanUrl": "",
      "interactiveFloorPlanURL": "https://streampluse.com/",
      "videoTourLink": "",
      "videoTourLink1": "https://streampluse.com/",
      "webHyperLink1": "https://streampluse.com/",
      "virtualTourLink1": "https://streampluse.com/",
      "webHyperLink2": "https://streampluse.com/",
      "virtualTourLink2": "https://streampluse.com/",
      "images": [],
      "userId": userId
    };

    const propertyResponse = await axios.post(`${API_BASE}/properties`, propertyData, {
      headers: {
        'Authorization': `Bearer ${registerResponse.data.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Property created successfully!');
    console.log('Property ID:', propertyResponse.data.id);
    console.log('Property Address:', `${propertyResponse.data.streetNo} ${propertyResponse.data.streetName}, ${propertyResponse.data.city}, ${propertyResponse.data.state}`);

    console.log('\n🎉 All tests passed! Property creation is working correctly.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n🔍 Validation errors:');
      console.log(JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.response?.status === 401) {
      console.log('\n🔍 Authentication error. Check if the JWT token is valid.');
    }
  }
}

// Run the test
testPropertyCreation(); 