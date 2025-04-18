// Create Connections for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/connections`,
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
  key: 'createConnections',
  noun: 'Connections',

  display: {
    label: 'Create Connections',
    description: 'Creates a new Connections.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Connections',
      },
      {
        key: 'user',
        label: 'User',
        type: 'string',
        required: true,
        helpText: 'The ID of the related users',
      },
      {
        key: 'integration',
        label: 'Integration',
        type: 'string',
        required: true,
        helpText: 'The ID of the related integrations',
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
        key: 'user',
        label: 'User',
      },
      {
        key: 'integration',
        label: 'Integration',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
