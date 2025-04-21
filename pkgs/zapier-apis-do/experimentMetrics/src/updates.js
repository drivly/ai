// Update ExperimentMetrics for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/experimentMetrics/${bundle.inputData.id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: inputData,
  })

  return response.data
}

module.exports = {
  key: 'updateExperimentMetrics',
  noun: 'ExperimentMetrics',

  display: {
    label: 'Update ExperimentMetrics',
    description: 'Updates an existing ExperimentMetrics.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the ExperimentMetrics to update',
      },
      {
        key: 'experimentId',
        label: 'ExperimentId',
        type: 'string',
        required: false,
        helpText: 'The ID of the related experiments',
      },
      {
        key: 'variantId',
        label: 'VariantId',
        type: 'string',
        required: false,
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
        required: false,
        helpText: 'The MetricName of the ExperimentMetrics',
      },
      {
        key: 'value',
        label: 'Value',
        type: 'number',
        required: false,
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
