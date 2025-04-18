// Update Webhooks for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/webhooks/${bundle.inputData.id}`,
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
  key: 'updateWebhooks',
  noun: 'Webhooks',

  display: {
    label: 'Update Webhooks',
    description: 'Updates an existing Webhooks.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Webhooks to update',
      },
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
        required: false,
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
