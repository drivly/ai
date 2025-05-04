import { getPayload } from 'payload';
import config from '../payload.config.js';
import fetch from 'node-fetch';

/**
 * Script to test database.do authentication with Payload CMS
 * This script:
 * 1. Creates a test user with admin privileges
 * 2. Creates an API key for testing
 * 3. Tests authentication with the API key
 * 4. Creates a test resource using the API key
 */
async function testDatabaseDoAuth() {
  try {
    console.log('Starting database.do authentication test...');
    
    const payload = await getPayload({ config });
    
    console.log('Checking for existing test user...');
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: 'test@example.com' },
      },
    });

    let userId;
    
    if (existingUsers.docs.length === 0) {
      console.log('Creating test user...');
      const testUser = await payload.create({
        collection: 'users',
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'test-password',
          role: 'admin',
          emailVerified: true,
        },
      });
      userId = testUser.id;
      console.log(`Test user created with ID: ${userId}`);
    } else {
      userId = existingUsers.docs[0].id;
      console.log(`Test user already exists with ID: ${userId}`);
    }
    
    console.log('Checking for existing API key...');
    const existingApiKeys = await payload.find({
      collection: 'apikeys',
      where: {
        name: { equals: 'Test API Key' },
      },
    });

    let apiKeyValue;
    
    if (existingApiKeys.docs.length === 0) {
      console.log('Creating API key...');
      const apiKey = await payload.create({
        collection: 'apikeys',
        data: {
          name: 'Test API Key',
          description: 'API key for automated tests',
          email: 'test@example.com',
        },
      });
      
      apiKeyValue = apiKey.apiKey;
      console.log(`API key created: ${apiKeyValue}`);
    } else {
      apiKeyValue = existingApiKeys.docs[0].apiKey;
      console.log(`API key already exists: ${apiKeyValue || '[hidden]'}`);
      
      if (!apiKeyValue) {
        console.log('API key is hidden. Creating a new one...');
        await payload.delete({
          collection: 'apikeys',
          id: existingApiKeys.docs[0].id,
        });
        
        const apiKey = await payload.create({
          collection: 'apikeys',
          data: {
            name: 'Test API Key',
            description: 'API key for automated tests',
            email: 'test@example.com',
          },
        });
        
        apiKeyValue = apiKey.apiKey;
        console.log(`New API key created: ${apiKeyValue}`);
      }
    }
    
    console.log('Testing authentication with API key...');
    const authResponse = await fetch('http://localhost:3000/api/things', {
      headers: {
        'Authorization': `Bearer ${apiKeyValue}`,
      },
    });
    
    if (authResponse.ok) {
      console.log('Authentication successful!');
    } else {
      console.error(`Authentication failed with status: ${authResponse.status}`);
      console.error(await authResponse.text());
    }
    
    console.log('Creating a test resource...');
    const createResponse = await fetch('http://localhost:3000/api/things', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyValue}`,
      },
      body: JSON.stringify({
        name: `Test Resource ${Date.now()}`,
        data: {
          testKey: 'testValue',
          number: 42,
        },
      }),
    });
    
    if (createResponse.ok) {
      const resource = await createResponse.json();
      console.log('Test resource created successfully:');
      console.log(JSON.stringify(resource, null, 2));
      
      console.log('Cleaning up test resource...');
      const deleteResponse = await fetch(`http://localhost:3000/api/things/${resource.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKeyValue}`,
        },
      });
      
      if (deleteResponse.ok) {
        console.log('Test resource deleted successfully');
      } else {
        console.error(`Failed to delete test resource: ${deleteResponse.status}`);
      }
    } else {
      console.error(`Failed to create test resource: ${createResponse.status}`);
      console.error(await createResponse.text());
    }
    
    console.log('\nTo use this API key in your tests, set the following environment variable:');
    console.log(`DO_API_KEY=${apiKeyValue}`);
    
    return apiKeyValue;
  } catch (error) {
    console.error('Error testing database.do authentication:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

testDatabaseDoAuth();
