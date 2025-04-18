// Update Models for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/models/${bundle.inputData.id}`,
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
  key: 'updateModels',
  noun: 'Models',

  display: {
    label: 'Update Models',
    description: 'Updates an existing Models.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Models to update',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Models',
      },
      {
        key: 'id',
        label: 'Id',
        type: 'string',
        required: false,
        helpText: 'The Id of the Models',
      },
      {
        key: 'provider',
        label: 'Provider',
        type: 'string',
        required: false,
        helpText: 'The ID of the related providers',
      },
      {
        key: 'lab',
        label: 'Lab',
        type: 'string',
        required: false,
        helpText: 'The ID of the related labs',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the Models',
      },
      {
        key: 'context_length',
        label: 'Context Length',
        type: 'number',
        required: false,
        helpText: 'The Context length of the Models',
      },
      {
        key: 'capabilities',
        label: 'Capabilities',
        type: 'string',
        required: false,
        helpText: 'JSON array of capabilities items',
      },
      {
        key: 'modelUrl',
        label: 'ModelUrl',
        type: 'string',
        required: false,
        helpText: 'The ModelUrl of the Models',
      },
      {
        key: 'imageUrl',
        label: 'ImageUrl',
        type: 'string',
        required: false,
        helpText: 'The ImageUrl of the Models',
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
