// Create Functions for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/functions`,
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
  key: 'createFunctions',
  noun: 'Functions',

  display: {
    label: 'Create Functions',
    description: 'Creates a new Functions.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the Functions',
      },
      {
        key: 'public',
        label: 'Public',
        type: 'boolean',
        required: false,
        helpText: 'The Public of the Functions',
      },
      {
        key: 'clonedFrom',
        label: 'ClonedFrom',
        type: 'string',
        required: false,
        helpText: 'The ID of the related functions',
      },
      {
        key: 'schemaYaml',
        label: 'SchemaYaml',
        type: 'string',
        required: false,
        helpText: 'The SchemaYaml of the Functions',
      },
      {
        key: 'code',
        label: 'Code',
        type: 'string',
        required: false,
        helpText: 'The Code of the Functions',
      },
      {
        key: 'prompt',
        label: 'Prompt',
        type: 'string',
        required: false,
        helpText: 'The ID of the related prompts',
      },
      {
        key: 'role',
        label: 'Role',
        type: 'string',
        required: false,
        helpText: 'The Role of the Functions',
      },
      {
        key: 'user',
        label: 'User',
        type: 'string',
        required: false,
        helpText: 'The ID of the related users',
      },
      {
        key: 'agent',
        label: 'Agent',
        type: 'string',
        required: false,
        helpText: 'The ID of the related agents',
      },
      {
        key: 'examples',
        label: 'Examples',
        type: 'string',
        required: false,
        helpText: 'The ID of the related resources',
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
        key: 'public',
        label: 'Public',
      },
      {
        key: 'clonedFrom',
        label: 'ClonedFrom',
      },
      {
        key: 'schemaYaml',
        label: 'SchemaYaml',
      },
      {
        key: 'code',
        label: 'Code',
      },
      {
        key: 'prompt',
        label: 'Prompt',
      },
      {
        key: 'role',
        label: 'Role',
      },
      {
        key: 'user',
        label: 'User',
      },
      {
        key: 'agent',
        label: 'Agent',
      },
      {
        key: 'examples',
        label: 'Examples',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
