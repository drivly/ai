// Create IntegrationTriggers for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/integrationTriggers`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: bundle.inputData,
  })

  return response.data
}

module.exports = {
  key: 'createIntegrationTriggers',
  noun: 'IntegrationTriggers',

  display: {
    label: 'Create IntegrationTriggers',
    description: 'Creates a new IntegrationTriggers.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'displayName',
        label: 'DisplayName',
        type: 'string',
        required: false,
        helpText: 'The DisplayName of the IntegrationTriggers',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the IntegrationTriggers',
      },
      {
        key: 'appKey',
        label: 'AppKey',
        type: 'string',
        required: false,
        helpText: 'The AppKey of the IntegrationTriggers',
      },
      {
        key: 'appName',
        label: 'AppName',
        type: 'string',
        required: false,
        helpText: 'The AppName of the IntegrationTriggers',
      },
      {
        key: 'appId',
        label: 'AppId',
        type: 'string',
        required: false,
        helpText: 'The AppId of the IntegrationTriggers',
      },
      {
        key: 'logo',
        label: 'Logo',
        type: 'string',
        required: false,
        helpText: 'The Logo of the IntegrationTriggers',
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
