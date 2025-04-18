// Get ExperimentMetrics for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/experimentMetrics/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getExperimentMetrics',
  noun: 'ExperimentMetrics',

  display: {
    label: 'Get ExperimentMetrics',
    description: 'Gets a ExperimentMetrics by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the ExperimentMetrics to retrieve',
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
