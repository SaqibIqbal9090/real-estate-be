const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testPasswordResetFlow() {
  try {
    console.log('🔄 Testing Password Reset Flow...\n');

    // Test 1: Forgot Password
    console.log('1️⃣ Testing forgot password endpoint...');
    const forgotPasswordResponse = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      email: 'test@example.com'
    });
    
    console.log('✅ Forgot password response:', forgotPasswordResponse.data);
    console.log('📧 Response indicates email was sent (if user exists)\n');

    // Test 2: Verify Reset Token (with invalid token)
    console.log('2️⃣ Testing token verification with invalid token...');
    try {
      const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-reset-token`, {
        token: 'invalid-token-123'
      });
      console.log('✅ Token verification response:', verifyResponse.data);
    } catch (error) {
      console.log('❌ Expected error for invalid token:', error.response?.data || error.message);
    }
    console.log();

    // Test 3: Reset Password (with invalid token)
    console.log('3️⃣ Testing reset password with invalid token...');
    try {
      const resetResponse = await axios.post(`${BASE_URL}/auth/reset-password`, {
        token: 'invalid-token-123',
        password: 'newPassword123'
      });
      console.log('✅ Reset password response:', resetResponse.data);
    } catch (error) {
      console.log('❌ Expected error for invalid token:', error.response?.data || error.message);
    }
    console.log();

    // Test 4: Reset Password (with invalid password format)
    console.log('4️⃣ Testing reset password with invalid password format...');
    try {
      const resetResponse = await axios.post(`${BASE_URL}/auth/reset-password`, {
        token: 'some-token',
        password: '123' // Too short
      });
      console.log('✅ Reset password response:', resetResponse.data);
    } catch (error) {
      console.log('❌ Expected validation error:', error.response?.data || error.message);
    }
    console.log();

    console.log('🎉 Password reset flow testing completed!');
    console.log('\n📋 Summary of endpoints created:');
    console.log('   • POST /auth/forgot-password - Send reset email');
    console.log('   • POST /auth/verify-reset-token - Verify reset token');
    console.log('   • POST /auth/reset-password - Reset password with token');

  } catch (error) {
    console.error('❌ Error testing password reset flow:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testPasswordResetFlow();

