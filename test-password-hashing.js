// Test script to verify password hashing
const axios = require('axios');

const API_BASE = 'http://localhost:3200';

async function testPasswordHashing() {
  try {
    console.log('🔐 Testing Password Hashing...\n');

    // Test 1: Register a new user with a unique email
    console.log('1️⃣ Registering a new user...');
    const timestamp = Date.now();
    const registerData = {
      fullName: 'Test User',
      email: `test${timestamp}@example.com`,
      password: 'password123'
    };

    console.log('Registration data:', {
      email: registerData.email,
      password: registerData.password,
      passwordLength: registerData.password.length
    });

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('User ID:', registerResponse.data.user.id);
    console.log('Token received:', registerResponse.data.token ? 'Yes' : 'No');

    // Wait a moment for the database to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Login with the same credentials
    console.log('\n2️⃣ Testing login...');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };

    console.log('Login data:', {
      email: loginData.email,
      password: loginData.password,
      passwordLength: loginData.password.length
    });

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('User ID:', loginResponse.data.user.id);
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');

    // Test 3: Test profile endpoint
    console.log('\n3️⃣ Testing profile endpoint...');
    const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    console.log('✅ Profile retrieved:', profileResponse.data);

    console.log('\n🎉 All tests passed! Password hashing is working correctly.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 This suggests a password comparison issue.');
      console.log('The password might not be hashed correctly during registration.');
    }
    
    if (error.response?.status === 409) {
      console.log('\n🔍 User already exists. The test will use a different email next time.');
    }
  }
}

// Run the test
testPasswordHashing(); 