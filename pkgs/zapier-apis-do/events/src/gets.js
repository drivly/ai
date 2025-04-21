// Get Events for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/events/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getEvents',
  noun: 'Events',

  display: {
    label: 'Get Events',
    description: 'Gets a Events by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Events to retrieve',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'type',
        label: 'Type',
      },
      {
        key: 'source',
        label: 'Source',
      },
      {
        key: 'subject',
        label: 'Subject',
      },
      {
        key: 'action',
        label: 'Action',
      },
      {
        key: 'trigger',
        label: 'Trigger',
      },
      {
        key: 'search',
        label: 'Search',
      },
      {
        key: 'function',
        label: 'Function',
      },
      {
        key: 'workflow',
        label: 'Workflow',
      },
      {
        key: 'agent',
        label: 'Agent',
      },
      {
        key: 'generations',
        label: 'Generations',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
