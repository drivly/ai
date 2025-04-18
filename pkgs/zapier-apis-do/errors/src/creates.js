// Create Errors for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/errors`,
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
  key: 'createErrors',
  noun: 'Errors',

  display: {
    label: 'Create Errors',
    description: 'Creates a new Errors.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'message',
        label: 'Message',
        type: 'string',
        required: true,
        helpText: 'The Message of the Errors',
      },
      {
        key: 'stack',
        label: 'Stack',
        type: 'string',
        required: false,
        helpText: 'The Stack of the Errors',
      },
      {
        key: 'digest',
        label: 'Digest',
        type: 'string',
        required: false,
        helpText: 'The Digest of the Errors',
      },
      {
        key: 'url',
        label: 'Url',
        type: 'string',
        required: false,
        helpText: 'The Url of the Errors',
      },
      {
        key: 'source',
        label: 'Source',
        type: 'string',
        required: false,
        helpText: 'The Source of the Errors',
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
