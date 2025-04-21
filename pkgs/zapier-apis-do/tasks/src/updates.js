// Update Tasks for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/tasks/${bundle.inputData.id}`,
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
  key: 'updateTasks',
  noun: 'Tasks',

  display: {
    label: 'Update Tasks',
    description: 'Updates an existing Tasks.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Tasks to update',
      },
      {
        key: 'queue',
        label: 'Queue',
        type: 'string',
        required: false,
        helpText: 'The ID of the related queues',
      },
      {
        key: 'assigned',
        label: 'Assigned',
        type: 'string',
        required: false,
        helpText: 'The ID of the related users',
      },
      {
        key: 'parent',
        label: 'Parent',
        type: 'string',
        required: false,
        helpText: 'The ID of the related tasks',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the Tasks',
      },
      {
        key: 'dependentOn',
        label: 'DependentOn',
        type: 'string',
        required: false,
        helpText: 'The ID of the related tasks',
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
