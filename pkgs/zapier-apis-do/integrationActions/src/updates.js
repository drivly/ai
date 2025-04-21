// Update IntegrationActions for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/integrationActions/${bundle.inputData.id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: inputData,
  })

  return response.data
}

module.exports = {
  key: 'updateIntegrationActions',
  noun: 'IntegrationActions',

  display: {
    label: 'Update IntegrationActions',
    description: 'Updates an existing IntegrationActions.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the IntegrationActions to update',
      },
      {
        key: 'displayName',
        label: 'DisplayName',
        type: 'string',
        required: false,
        helpText: 'The DisplayName of the IntegrationActions',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the IntegrationActions',
      },
      {
        key: 'appKey',
        label: 'AppKey',
        type: 'string',
        required: false,
        helpText: 'The AppKey of the IntegrationActions',
      },
      {
        key: 'appName',
        label: 'AppName',
        type: 'string',
        required: false,
        helpText: 'The AppName of the IntegrationActions',
      },
      {
        key: 'appId',
        label: 'AppId',
        type: 'string',
        required: false,
        helpText: 'The AppId of the IntegrationActions',
      },
      {
        key: 'version',
        label: 'Version',
        type: 'string',
        required: false,
        helpText: 'The Version of the IntegrationActions',
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
        key: 'version',
        label: 'Version',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
