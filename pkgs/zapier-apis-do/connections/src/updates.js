// Update Connections for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/connections/${bundle.inputData.id}`,
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
  key: 'updateConnections',
  noun: 'Connections',

  display: {
    label: 'Update Connections',
    description: 'Updates an existing Connections.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Connections to update',
      },
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
        required: false,
        helpText: 'The ID of the related users',
      },
      {
        key: 'integration',
        label: 'Integration',
        type: 'string',
        required: false,
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
