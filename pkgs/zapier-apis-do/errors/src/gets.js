// Get Errors for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/errors/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getErrors',
  noun: 'Errors',

  display: {
    label: 'Get Errors',
    description: 'Gets a Errors by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Errors to retrieve',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'message',
        label: 'Message',
      },
      {
        key: 'stack',
        label: 'Stack',
      },
      {
        key: 'digest',
        label: 'Digest',
      },
      {
        key: 'url',
        label: 'Url',
      },
      {
        key: 'source',
        label: 'Source',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
