import { ZapierCollectionConfig } from '../types/collection'
import { pascalCase, titleCase } from '../utils/stringUtils'

/**
 * Generates the main app.js file for a Zapier app
 * @param collection The collection to generate the app for
 * @returns The content of the app.js file
 */
export function generateAppTemplate(collection: ZapierCollectionConfig): string {
  const collectionName = pascalCase(collection.slug)
  const collectionTitle = titleCase(collection.slug)

  return `// Generated Zapier App for ${collectionTitle}
const authentication = require('./authentication');
const creates = require('./creates');
const searches = require('./searches');
const gets = require('./gets');
const updates = require('./updates');
const deletes = require('./deletes');

module.exports = {
  version: require('../package.json').version,
  platformVersion: require('zapier-platform-core').version,
  
  authentication,
  
  beforeRequest: [
    (request, z, bundle) => {
      // Add authentication headers
      if (bundle.authData.apiKey) {
        request.headers.Authorization = \`Bearer \${bundle.authData.apiKey}\`;
      }
      return request;
    }
  ],
  
  afterResponse: [
    (response, z, bundle) => {
      // Handle response errors
      if (response.status >= 400) {
        throw new Error(\`Unexpected status code \${response.status}\`);
      }
      return response;
    }
  ],
  
  resources: {},
  
  triggers: {},
  
  searches,
  
  creates,
  
  gets,
  
  updates,
  
  deletes,
};
`
}
