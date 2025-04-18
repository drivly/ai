// Update Tags for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/tags/${bundle.inputData.id}`,
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
  key: 'updateTags',
  noun: 'Tags',

  display: {
    label: 'Update Tags',
    description: 'Updates an existing Tags.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Tags to update',
      },
      {
        key: 'id',
        label: 'Id',
        type: 'string',
        required: false,
        helpText: 'The Id of the Tags',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'id',
        label: 'Id',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
