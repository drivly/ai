// Delete Datasets for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/datasets/${bundle.inputData.id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'deleteDatasets',
  noun: 'Datasets',

  display: {
    label: 'Delete Datasets',
    description: 'Deletes a Datasets.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Datasets to delete',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      deleted: true,
    },
  },
}
