// Get Models for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/models/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getModels',
  noun: 'Models',

  display: {
    label: 'Get Models',
    description: 'Gets a Models by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Models to retrieve',
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
        key: 'id',
        label: 'Id',
      },
      {
        key: 'provider',
        label: 'Provider',
      },
      {
        key: 'lab',
        label: 'Lab',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'context_length',
        label: 'Context Length',
      },
      {
        key: 'capabilities',
        label: 'Capabilities',
      },
      {
        key: 'modelUrl',
        label: 'ModelUrl',
      },
      {
        key: 'imageUrl',
        label: 'ImageUrl',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
