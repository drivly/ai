// Delete Triggers for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/triggers/${bundle.inputData.id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'deleteTriggers',
  noun: 'Triggers',

  display: {
    label: 'Delete Triggers',
    description: 'Deletes a Triggers.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Triggers to delete',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      deleted: true,
    },
  },
}
