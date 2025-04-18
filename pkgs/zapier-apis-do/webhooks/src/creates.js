// Create Webhooks for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/webhooks`,
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
  key: 'createWebhooks',
  noun: 'Webhooks',

  display: {
    label: 'Create Webhooks',
    description: 'Creates a new Webhooks.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Webhooks',
      },
      {
        key: 'url',
        label: 'Url',
        type: 'string',
        required: true,
        helpText: 'The Url of the Webhooks',
      },
      {
        key: 'filters',
        label: 'Filters',
        type: 'string',
        required: false,
        helpText: 'JSON array of filters items',
      },
      {
        key: 'enabled',
        label: 'Enabled',
        type: 'boolean',
        required: false,
        helpText: 'The Enabled of the Webhooks',
      },
      {
        key: 'secret',
        label: 'Secret',
        type: 'string',
        required: false,
        helpText: 'The Secret of the Webhooks',
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
