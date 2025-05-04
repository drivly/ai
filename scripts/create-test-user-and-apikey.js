import { getPayload } from 'payload';
import config from '../payload.config.js';

/**
 * Creates a test user with admin privileges and generates an API key for testing
 */
async function createTestUserAndApiKey() {
  try {
    console.log('Starting test user and API key creation...');

    const payload = await getPayload({ config });

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

    const existingApiKeys = await payload.find({
      collection: 'apikeys',
      where: {
        name: { equals: 'Test API Key' },
      },
    });

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
      
      const apiKeyValue = apiKey.apiKey;
      console.log(`API key created: ${apiKeyValue}`);
      console.log('DO_API_KEY=' + apiKeyValue);
      return apiKeyValue;
    } else {
      const apiKeyValue = existingApiKeys.docs[0].apiKey;
      console.log(`API key already exists: ${apiKeyValue || '[hidden]'}`);
      
      if (!apiKeyValue) {
        console.log('API key is hidden. Creating a new one...');
        await payload.delete({
          collection: 'apikeys',
          id: existingApiKeys.docs[0].id,
        });
        
        return await createTestUserAndApiKey();
      }
      
      console.log('DO_API_KEY=' + apiKeyValue);
      return apiKeyValue;
    }
  } catch (error) {
    console.error('Error creating test user and API key:', error);
    throw error;
  }
}

createTestUserAndApiKey()
  .then(() => {
    console.log('Test user and API key creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
