// Delete Models for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/models/${bundle.inputData.id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'deleteModels',
  noun: 'Models',

  display: {
    label: 'Delete Models',
    description: 'Deletes a Models.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Models to delete',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      deleted: true,
    },
  },
}
