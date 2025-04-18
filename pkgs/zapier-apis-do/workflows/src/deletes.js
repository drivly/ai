// Delete Workflows for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/workflows/${bundle.inputData.id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'deleteWorkflows',
  noun: 'Workflows',

  display: {
    label: 'Delete Workflows',
    description: 'Deletes a Workflows.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Workflows to delete',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      deleted: true,
    },
  },
}
