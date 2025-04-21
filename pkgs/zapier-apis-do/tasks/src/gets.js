// Get Tasks for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/tasks/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getTasks',
  noun: 'Tasks',

  display: {
    label: 'Get Tasks',
    description: 'Gets a Tasks by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Tasks to retrieve',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'queue',
        label: 'Queue',
      },
      {
        key: 'assigned',
        label: 'Assigned',
      },
      {
        key: 'parent',
        label: 'Parent',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'dependentOn',
        label: 'DependentOn',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
