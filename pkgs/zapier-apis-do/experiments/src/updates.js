// Update Experiments for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/experiments/${bundle.inputData.id}`,
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
  key: 'updateExperiments',
  noun: 'Experiments',

  display: {
    label: 'Update Experiments',
    description: 'Updates an existing Experiments.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Experiments to update',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Experiments',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the Experiments',
      },
      {
        key: 'variants',
        label: 'Variants',
        type: 'string',
        required: false,
        helpText: 'JSON array of variants items',
      },
      {
        key: 'metrics',
        label: 'Metrics',
        type: 'string',
        required: false,
        helpText: 'JSON array of metrics items',
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
        key: 'description',
        label: 'Description',
      },
      {
        key: 'variants',
        label: 'Variants',
      },
      {
        key: 'metrics',
        label: 'Metrics',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
