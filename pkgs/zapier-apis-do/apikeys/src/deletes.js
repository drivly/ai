// Delete Apikeys for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/apikeys/${bundle.inputData.id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'deleteApikeys',
  noun: 'Apikeys',

  display: {
    label: 'Delete Apikeys',
    description: 'Deletes a Apikeys.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Apikeys to delete',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      deleted: true,
    },
  },
}
