// List ExperimentMetrics search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/experimentMetrics`,
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
  if (inputData.experimentId) {
    where.experimentId = { equals: inputData.experimentId }
  }
  if (inputData.variantId) {
    where.variantId = { equals: inputData.variantId }
  }
  if (inputData.userId) {
    where.userId = { equals: inputData.userId }
  }
  if (inputData.sessionId) {
    where.sessionId = { equals: inputData.sessionId }
  }
  if (inputData.metricName) {
    where.metricName = { equals: inputData.metricName }
  }
  if (inputData.value) {
    where.value = { equals: inputData.value }
  }
  if (inputData.timestamp) {
    where.timestamp = { equals: inputData.timestamp }
  }
  if (inputData.metadata) {
    where.metadata = { equals: inputData.metadata }
  }

  return where
}

module.exports = {
  key: 'findExperimentMetrics',
  noun: 'ExperimentMetrics',

  display: {
    label: 'Find ExperimentMetrics',
    description: 'Finds ExperimentMetrics in your account.',
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
        key: 'experimentId',
        label: 'ExperimentId',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related experiments',
      },
      {
        key: 'variantId',
        label: 'VariantId',
        type: 'string',
        required: false,
        helpText: 'Filter by VariantId',
      },
      {
        key: 'userId',
        label: 'UserId',
        type: 'string',
        required: false,
        helpText: 'Filter by UserId',
      },
      {
        key: 'sessionId',
        label: 'SessionId',
        type: 'string',
        required: false,
        helpText: 'Filter by SessionId',
      },
      {
        key: 'metricName',
        label: 'MetricName',
        type: 'string',
        required: false,
        helpText: 'Filter by MetricName',
      },
      {
        key: 'value',
        label: 'Value',
        type: 'number',
        required: false,
        helpText: 'Filter by Value',
      },
      {
        key: 'timestamp',
        label: 'Timestamp',
        type: 'string',
        required: false,
        helpText: 'Filter by Timestamp',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'experimentId',
        label: 'ExperimentId',
      },
      {
        key: 'variantId',
        label: 'VariantId',
      },
      {
        key: 'userId',
        label: 'UserId',
      },
      {
        key: 'sessionId',
        label: 'SessionId',
      },
      {
        key: 'metricName',
        label: 'MetricName',
      },
      {
        key: 'value',
        label: 'Value',
      },
      {
        key: 'timestamp',
        label: 'Timestamp',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
