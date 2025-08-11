// Simple test script to debug login API
const axios = require('axios');

const API_BASE = 'http://localhost:3200';

async function testLogin() {
  try {
    console.log('🧪 Testing Login API...\n');

    // Test 1: Register a new user
    console.log('1️⃣ Registering a new user...');
    const registerData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('User ID:', registerResponse.data.user.id);
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...\n');

    // Test 2: Login with the same credentials
    console.log('2️⃣ Testing login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('User ID:', loginResponse.data.user.id);
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...\n');

    // Test 3: Test profile endpoint
    console.log('3️⃣ Testing profile endpoint...');
    const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    console.log('✅ Profile retrieved:', profileResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 This suggests a password comparison issue.');
      console.log('Check if the password is being hashed correctly during registration.');
    }
    
    if (error.response?.status === 409) {
      console.log('\n🔍 User already exists. Try with a different email.');
    }
  }
}

// Run the test
testLogin(); 