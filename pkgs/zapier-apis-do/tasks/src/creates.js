// Create Tasks for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/tasks`,
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
  key: 'createTasks',
  noun: 'Tasks',

  display: {
    label: 'Create Tasks',
    description: 'Creates a new Tasks.',
  },

  operation: {
    perform,

    inputFields: [
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
