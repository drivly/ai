// Create Types for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/types`,
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
  key: 'createTypes',
  noun: 'Types',

  display: {
    label: 'Create Types',
    description: 'Creates a new Types.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Types',
      },
      {
        key: 'hash',
        label: 'Hash',
        type: 'string',
        required: false,
        helpText: 'The Hash of the Types',
      },
      {
        key: 'type',
        label: 'Type',
        type: 'string',
        required: false,
        helpText: 'The Type of the Types',
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
        key: 'hash',
        label: 'Hash',
      },
      {
        key: 'type',
        label: 'Type',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
