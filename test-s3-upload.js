// Test script for S3 signed URL functionality
// Run with: node test-s3-upload.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';
const AUTH_TOKEN = 'your_jwt_token_here'; // Replace with actual token

async function testSingleSignedUrl() {
  console.log('Testing single signed URL generation...');
  
  try {
    const response = await fetch(`${BASE_URL}/properties/upload/single-signed-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        fileName: 'test-property-image.jpg',
        contentType: 'image/jpeg',
        expiresIn: 3600
      })
    });

    const result = await response.json();
    console.log('Single signed URL response:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('Error testing single signed URL:', error);
  }
}

async function testMultipleSignedUrls() {
  console.log('\nTesting multiple signed URLs generation...');
  
  try {
    const response = await fetch(`${BASE_URL}/properties/upload/signed-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        files: [
          {
            fileName: 'property-exterior.jpg',
            contentType: 'image/jpeg'
          },
          {
            fileName: 'property-interior.png',
            contentType: 'image/png'
          },
          {
            fileName: 'property-kitchen.jpg',
            contentType: 'image/jpeg'
          }
        ],
        expiresIn: 3600
      })
    });

    const result = await response.json();
    console.log('Multiple signed URLs response:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('Error testing multiple signed URLs:', error);
  }
}

async function testUploadToS3(signedUrl, fileKey) {
  console.log(`\nTesting upload to S3 for file: ${fileKey}`);
  
  try {
    // Create a mock file (in real usage, this would be an actual file)
    const mockFileContent = 'This is a mock image file content';
    const mockFile = Buffer.from(mockFileContent);
    
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: mockFile,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': mockFile.length.toString()
      }
    });

    if (uploadResponse.ok) {
      console.log('✅ Successfully uploaded to S3');
      console.log('File key:', fileKey);
    } else {
      console.log('❌ Failed to upload to S3');
      console.log('Status:', uploadResponse.status);
      console.log('Status text:', uploadResponse.statusText);
    }
  } catch (error) {
    console.error('Error uploading to S3:', error);
  }
}

async function runTests() {
  console.log('🚀 Starting S3 signed URL tests...\n');
  
  // Test single signed URL
  const singleResult = await testSingleSignedUrl();
  if (singleResult && singleResult.signedUrl) {
    await testUploadToS3(singleResult.signedUrl, singleResult.fileKey);
  }
  
  // Test multiple signed URLs
  const multipleResult = await testMultipleSignedUrls();
  if (multipleResult && multipleResult.signedUrls) {
    for (const fileData of multipleResult.signedUrls) {
      await testUploadToS3(fileData.signedUrl, fileData.fileKey);
    }
  }
  
  console.log('\n✅ All tests completed!');
}

// Run the tests
runTests().catch(console.error); 