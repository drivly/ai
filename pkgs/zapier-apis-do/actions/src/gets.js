// Get Actions for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/actions/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getActions',
  noun: 'Actions',

  display: {
    label: 'Get Actions',
    description: 'Gets a Actions by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Actions to retrieve',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'subject',
        label: 'Subject',
      },
      {
        key: 'verb',
        label: 'Verb',
      },
      {
        key: 'object',
        label: 'Object',
      },
      {
        key: 'hash',
        label: 'Hash',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
