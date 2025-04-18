// Authentication for Evals Zapier App
module.exports = {
  type: 'custom',

  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      helpText: 'Your AI Primitives API key',
    },
    {
      key: 'apiUrl',
      label: 'API URL',
      type: 'string',
      required: true,
      default: 'https://ai.do',
      helpText: 'The URL of the AI Primitives API',
    },
  ],

  test: {
    url: '{{bundle.authData.apiUrl}}/api/evals',
    method: 'GET',
    headers: {
      Authorization: 'Bearer {{bundle.authData.apiKey}}',
      'Content-Type': 'application/json',
    },
    params: {
      limit: 1,
    },
    body: {},
    removeMissingValuesFrom: {},
  },

  connectionLabel: '{{bundle.authData.apiUrl}}',
}
