// Get Webhooks for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/webhooks/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getWebhooks',
  noun: 'Webhooks',

  display: {
    label: 'Get Webhooks',
    description: 'Gets a Webhooks by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Webhooks to retrieve',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: 'Name',
      },
      {
        key: 'url',
        label: 'Url',
      },
      {
        key: 'filters',
        label: 'Filters',
      },
      {
        key: 'enabled',
        label: 'Enabled',
      },
      {
        key: 'secret',
        label: 'Secret',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
