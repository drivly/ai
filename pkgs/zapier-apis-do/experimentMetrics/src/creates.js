// Create ExperimentMetrics for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/experimentMetrics`,
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
  key: 'createExperimentMetrics',
  noun: 'ExperimentMetrics',

  display: {
    label: 'Create ExperimentMetrics',
    description: 'Creates a new ExperimentMetrics.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'experimentId',
        label: 'ExperimentId',
        type: 'string',
        required: true,
        helpText: 'The ID of the related experiments',
      },
      {
        key: 'variantId',
        label: 'VariantId',
        type: 'string',
        required: true,
        helpText: 'The VariantId of the ExperimentMetrics',
      },
      {
        key: 'userId',
        label: 'UserId',
        type: 'string',
        required: false,
        helpText: 'The UserId of the ExperimentMetrics',
      },
      {
        key: 'sessionId',
        label: 'SessionId',
        type: 'string',
        required: false,
        helpText: 'The SessionId of the ExperimentMetrics',
      },
      {
        key: 'metricName',
        label: 'MetricName',
        type: 'string',
        required: true,
        helpText: 'The MetricName of the ExperimentMetrics',
      },
      {
        key: 'value',
        label: 'Value',
        type: 'number',
        required: true,
        helpText: 'The Value of the ExperimentMetrics',
      },
      {
        key: 'timestamp',
        label: 'Timestamp',
        type: 'string',
        required: false,
        helpText: 'The Timestamp of the ExperimentMetrics',
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
