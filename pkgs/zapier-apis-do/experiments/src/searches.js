// List Experiments search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/experiments`,
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
  if (inputData.description) {
    where.description = { equals: inputData.description }
  }
  if (inputData.status) {
    where.status = { equals: inputData.status }
  }
  if (inputData.provider) {
    where.provider = { equals: inputData.provider }
  }
  if (inputData.variants) {
    where.variants = { equals: inputData.variants }
  }
  if (inputData.metrics) {
    where.metrics = { equals: inputData.metrics }
  }
  if (inputData.trafficAllocation) {
    where.trafficAllocation = { equals: inputData.trafficAllocation }
  }
  if (inputData.targeting) {
    where.targeting = { equals: inputData.targeting }
  }
  if (inputData.duration) {
    where.duration = { equals: inputData.duration }
  }
  if (inputData.results) {
    where.results = { equals: inputData.results }
  }

  return where
}

module.exports = {
  key: 'findExperiments',
  noun: 'Experiments',

  display: {
    label: 'Find Experiments',
    description: 'Finds Experiments in your account.',
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
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'Filter by Description',
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
        key: 'description',
        label: 'Description',
      },
      {
        key: 'variants',
        label: 'Variants',
      },
      {
        key: 'metrics',
        label: 'Metrics',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
