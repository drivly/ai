// Get Functions for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/functions/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getFunctions',
  noun: 'Functions',

  display: {
    label: 'Get Functions',
    description: 'Gets a Functions by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Functions to retrieve',
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
