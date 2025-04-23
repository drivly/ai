// Generated Zapier App for Tags
const authentication = require('./authentication')
const creates = require('./creates')
const searches = require('./searches')
const gets = require('./gets')
const updates = require('./updates')
const deletes = require('./deletes')

module.exports = {
  version: require('../package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [
    (request, z, bundle) => {
      // Add authentication headers
      if (bundle.authData.apiKey) {
        request.headers.Authorization = `Bearer ${bundle.authData.apiKey}`
      }
      return request
    },
  ],

  afterResponse: [
    (response, z, bundle) => {
      // Handle response errors
      if (response.status >= 400) {
        throw new Error(`Unexpected status code ${response.status}`)
      }
      return response
    },
  ],

  resources: {},

  triggers: {},

  searches,

  creates,

  gets,

  updates,

  deletes,
}
