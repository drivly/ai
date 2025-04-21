// Get Workflows for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/workflows/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getWorkflows',
  noun: 'Workflows',

  display: {
    label: 'Get Workflows',
    description: 'Gets a Workflows by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Workflows to retrieve',
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
        key: 'type',
        label: 'Type',
      },
      {
        key: 'code',
        label: 'Code',
      },
      {
        key: 'functions',
        label: 'Functions',
      },
      {
        key: 'module',
        label: 'Module',
      },
      {
        key: 'package',
        label: 'Package',
      },
      {
        key: 'deployment',
        label: 'Deployment',
      },
      {
        key: 'public',
        label: 'Public',
      },
      {
        key: 'clonedFrom',
        label: 'ClonedFrom',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
