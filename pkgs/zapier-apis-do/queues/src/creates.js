// Create Queues for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/queues`,
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
  key: 'createQueues',
  noun: 'Queues',

  display: {
    label: 'Create Queues',
    description: 'Creates a new Queues.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the Queues',
      },
      {
        key: 'role',
        label: 'Role',
        type: 'string',
        required: true,
        helpText: 'The ID of the related roles',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: 'Name',
      },
      {
        key: 'role',
        label: 'Role',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
