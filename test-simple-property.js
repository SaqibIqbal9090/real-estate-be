const axios = require('axios');

const API_BASE_URL = 'http://localhost:3200';

async function testSimplePropertyCreation() {
  try {
    // First, login to get a token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'saqibiqbal3745@gmail.com',
      password: 'password123'
    });

    const token = loginResponse.data.access_token;
    console.log('Login successful, token received');

    // Create a simple property without rooms data first
    const simplePropertyData = {
      "listType": "sale",
      "listPrice": 250000,
      "listDate": "2024-01-01",
      "streetNo": "123",
      "streetName": "Test Street",
      "city": "Test City",
      "state": "TX",
      "zipCode": "12345",
      "county": "Test County",
      "buildingSqft": 2000,
      "yearBuilt": "2020",
      "bedrooms": ["3"],
      "bathsFull": ["2"],
      "room": [
        {
          "roomType": "bedroom",
          "roomDimension": "12x12",
          "roomLocation": "2nd"
        }
      ],
      "rooms": [
        {
          "id": "test1",
          "roomType": "bedroom",
          "roomLocation": "2nd",
          "roomDimension": "12x12",
          "features": ["closet", "window"]
        }
      ]
    };

    console.log('Creating simple property...');
    const createResponse = await axios.post(`${API_BASE_URL}/properties`, simplePropertyData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Property created successfully!');
    console.log('Property ID:', createResponse.data.property.id);
    console.log('Rooms in response:', createResponse.data.property.rooms?.length || 0);
    console.log('Rooms data:', JSON.stringify(createResponse.data.property.rooms, null, 2));

    // Now retrieve the property to verify the rooms data is in response
    console.log('\nRetrieving the created property...');
    const retrieveResponse = await axios.get(`${API_BASE_URL}/properties/${createResponse.data.property.id}`);

    console.log('Property retrieved successfully!');
    console.log('Retrieved rooms count:', retrieveResponse.data.property.rooms?.length || 0);
    console.log('Retrieved rooms data:', JSON.stringify(retrieveResponse.data.property.rooms, null, 2));

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testSimplePropertyCreation(); 