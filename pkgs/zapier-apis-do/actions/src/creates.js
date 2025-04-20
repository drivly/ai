// Create Actions for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/actions`,
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
  key: 'createActions',
  noun: 'Actions',

  display: {
    label: 'Create Actions',
    description: 'Creates a new Actions.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'subject',
        label: 'Subject',
        type: 'string',
        required: false,
        helpText: 'The ID of the related resources',
      },
      {
        key: 'verb',
        label: 'Verb',
        type: 'string',
        required: false,
        helpText: 'The ID of the related verbs',
      },
      {
        key: 'object',
        label: 'Object',
        type: 'string',
        required: false,
        helpText: 'The ID of the related resources',
      },
      {
        key: 'hash',
        label: 'Hash',
        type: 'string',
        required: false,
        helpText: 'The Hash of the Actions',
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
