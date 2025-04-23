// Create Workflows for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/workflows`,
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
  key: 'createWorkflows',
  noun: 'Workflows',

  display: {
    label: 'Create Workflows',
    description: 'Creates a new Workflows.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Workflows',
      },
      {
        key: 'type',
        label: 'Type',
        type: 'string',
        required: false,
        helpText: 'The Type of the Workflows',
      },
      {
        key: 'code',
        label: 'Code',
        type: 'string',
        required: false,
        helpText: 'The Code of the Workflows',
      },
      {
        key: 'functions',
        label: 'Functions',
        type: 'string',
        required: false,
        helpText: 'The ID of the related functions',
      },
      {
        key: 'module',
        label: 'Module',
        type: 'string',
        required: false,
        helpText: 'The ID of the related modules',
      },
      {
        key: 'package',
        label: 'Package',
        type: 'string',
        required: false,
        helpText: 'The ID of the related packages',
      },
      {
        key: 'deployment',
        label: 'Deployment',
        type: 'string',
        required: false,
        helpText: 'The ID of the related deployments',
      },
      {
        key: 'public',
        label: 'Public',
        type: 'boolean',
        required: false,
        helpText: 'The Public of the Workflows',
      },
      {
        key: 'clonedFrom',
        label: 'ClonedFrom',
        type: 'string',
        required: false,
        helpText: 'The ID of the related workflows',
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
