// List Workflows search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/workflows`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      limit: bundle.inputData.limit || 10,
      page: bundle.inputData.page || 1,
      where: JSON.stringify(buildWhereClause(bundle.inputData)),
    },
  })

  return response.data.docs || []
}

// Build the where clause for filtering
const buildWhereClause = (inputData) => {
  const where = {}

  // Add filters for each field if provided
  if (inputData.name) {
    where.name = { equals: inputData.name }
  }
  if (inputData.type) {
    where.type = { equals: inputData.type }
  }
  if (inputData.code) {
    where.code = { equals: inputData.code }
  }
  if (inputData.functions) {
    where.functions = { equals: inputData.functions }
  }
  if (inputData.module) {
    where.module = { equals: inputData.module }
  }
  if (inputData.package) {
    where.package = { equals: inputData.package }
  }
  if (inputData.deployment) {
    where.deployment = { equals: inputData.deployment }
  }
  if (inputData.public) {
    where.public = { equals: inputData.public }
  }
  if (inputData.clonedFrom) {
    where.clonedFrom = { equals: inputData.clonedFrom }
  }
  if (inputData.pricing) {
    where.pricing = { equals: inputData.pricing }
  }

  return where
}

module.exports = {
  key: 'findWorkflows',
  noun: 'Workflows',

  display: {
    label: 'Find Workflows',
    description: 'Finds Workflows in your account.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'limit',
        label: 'Limit',
        type: 'integer',
        required: false,
        default: 10,
        helpText: 'Maximum number of records to return',
      },
      {
        key: 'page',
        label: 'Page',
        type: 'integer',
        required: false,
        default: 1,
        helpText: 'Page number for pagination',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'Filter by Name',
      },
      {
        key: 'type',
        label: 'Type',
        type: 'string',
        required: false,
        helpText: 'Filter by Type',
      },
      {
        key: 'code',
        label: 'Code',
        type: 'string',
        required: false,
        helpText: 'Filter by Code',
      },
      {
        key: 'functions',
        label: 'Functions',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related functions',
      },
      {
        key: 'module',
        label: 'Module',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related modules',
      },
      {
        key: 'package',
        label: 'Package',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related packages',
      },
      {
        key: 'deployment',
        label: 'Deployment',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related deployments',
      },
      {
        key: 'clonedFrom',
        label: 'ClonedFrom',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related workflows',
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
