// Update EvalResults for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/evalResults/${bundle.inputData.id}`,
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
  key: 'updateEvalResults',
  noun: 'EvalResults',

  display: {
    label: 'Update EvalResults',
    description: 'Updates an existing EvalResults.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the EvalResults to update',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the EvalResults',
      },
      {
        key: 'testId',
        label: 'TestId',
        type: 'string',
        required: false,
        helpText: 'The ID of the related evals',
      },
      {
        key: 'score',
        label: 'Score',
        type: 'number',
        required: false,
        helpText: 'The Score of the EvalResults',
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'number',
        required: false,
        helpText: 'The Duration of the EvalResults',
      },
      {
        key: 'error',
        label: 'Error',
        type: 'string',
        required: false,
        helpText: 'The Error of the EvalResults',
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
