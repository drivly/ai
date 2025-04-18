// Create Events for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/events`,
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
  key: 'createEvents',
  noun: 'Events',

  display: {
    label: 'Create Events',
    description: 'Creates a new Events.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'type',
        label: 'Type',
        type: 'string',
        required: false,
        helpText: 'The Type of the Events',
      },
      {
        key: 'source',
        label: 'Source',
        type: 'string',
        required: false,
        helpText: 'The Source of the Events',
      },
      {
        key: 'subject',
        label: 'Subject',
        type: 'string',
        required: false,
        helpText: 'The ID of the related resources',
      },
      {
        key: 'action',
        label: 'Action',
        type: 'string',
        required: false,
        helpText: 'The ID of the related actions',
      },
      {
        key: 'trigger',
        label: 'Trigger',
        type: 'string',
        required: false,
        helpText: 'The ID of the related triggers',
      },
      {
        key: 'search',
        label: 'Search',
        type: 'string',
        required: false,
        helpText: 'The ID of the related searches',
      },
      {
        key: 'function',
        label: 'Function',
        type: 'string',
        required: false,
        helpText: 'The ID of the related functions',
      },
      {
        key: 'workflow',
        label: 'Workflow',
        type: 'string',
        required: false,
        helpText: 'The ID of the related workflows',
      },
      {
        key: 'agent',
        label: 'Agent',
        type: 'string',
        required: false,
        helpText: 'The ID of the related agents',
      },
      {
        key: 'generations',
        label: 'Generations',
        type: 'string',
        required: false,
        helpText: 'The ID of the related generations',
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
