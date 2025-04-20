// Get IntegrationTriggers for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/integrationTriggers/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getIntegrationTriggers',
  noun: 'IntegrationTriggers',

  display: {
    label: 'Get IntegrationTriggers',
    description: 'Gets a IntegrationTriggers by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the IntegrationTriggers to retrieve',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'displayName',
        label: 'DisplayName',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'appKey',
        label: 'AppKey',
      },
      {
        key: 'appName',
        label: 'AppName',
      },
      {
        key: 'appId',
        label: 'AppId',
      },
      {
        key: 'logo',
        label: 'Logo',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
