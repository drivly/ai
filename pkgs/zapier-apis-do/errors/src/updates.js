// Update Errors for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/errors/${bundle.inputData.id}`,
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
  key: 'updateErrors',
  noun: 'Errors',

  display: {
    label: 'Update Errors',
    description: 'Updates an existing Errors.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Errors to update',
      },
      {
        key: 'message',
        label: 'Message',
        type: 'string',
        required: false,
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
