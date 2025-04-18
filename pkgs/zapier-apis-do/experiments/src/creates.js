// Create Experiments for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/experiments`,
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
  key: 'createExperiments',
  noun: 'Experiments',

  display: {
    label: 'Create Experiments',
    description: 'Creates a new Experiments.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
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
        required: true,
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
