// List EvalResults search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/evalResults`,
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
  if (inputData.testId) {
    where.testId = { equals: inputData.testId }
  }
  if (inputData.output) {
    where.output = { equals: inputData.output }
  }
  if (inputData.score) {
    where.score = { equals: inputData.score }
  }
  if (inputData.metrics) {
    where.metrics = { equals: inputData.metrics }
  }
  if (inputData.duration) {
    where.duration = { equals: inputData.duration }
  }
  if (inputData.error) {
    where.error = { equals: inputData.error }
  }

  return where
}

module.exports = {
  key: 'findEvalResults',
  noun: 'EvalResults',

  display: {
    label: 'Find EvalResults',
    description: 'Finds EvalResults in your account.',
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
        key: 'testId',
        label: 'TestId',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related evals',
      },
      {
        key: 'score',
        label: 'Score',
        type: 'number',
        required: false,
        helpText: 'Filter by Score',
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'number',
        required: false,
        helpText: 'Filter by Duration',
      },
      {
        key: 'error',
        label: 'Error',
        type: 'string',
        required: false,
        helpText: 'Filter by Error',
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
        key: 'testId',
        label: 'TestId',
      },
      {
        key: 'score',
        label: 'Score',
      },
      {
        key: 'duration',
        label: 'Duration',
      },
      {
        key: 'error',
        label: 'Error',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
