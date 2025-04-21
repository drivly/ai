// Create Tags for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/tags`,
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
  key: 'createTags',
  noun: 'Tags',

  display: {
    label: 'Create Tags',
    description: 'Creates a new Tags.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'Id',
        type: 'string',
        required: false,
        helpText: 'The Id of the Tags',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'id',
        label: 'Id',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
