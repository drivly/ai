// Create EvalRuns for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/evalRuns`,
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
  key: 'createEvalRuns',
  noun: 'EvalRuns',

  display: {
    label: 'Create EvalRuns',
    description: 'Creates a new EvalRuns.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the EvalRuns',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the EvalRuns',
      },
      {
        key: 'testIds',
        label: 'TestIds',
        type: 'string',
        required: false,
        helpText: 'JSON array of testIds items',
      },
      {
        key: 'results',
        label: 'Results',
        type: 'string',
        required: false,
        helpText: 'JSON array of results items',
      },
      {
        key: 'startedAt',
        label: 'StartedAt',
        type: 'string',
        required: false,
        helpText: 'The StartedAt of the EvalRuns',
      },
      {
        key: 'completedAt',
        label: 'CompletedAt',
        type: 'string',
        required: false,
        helpText: 'The CompletedAt of the EvalRuns',
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
        key: 'testIds',
        label: 'TestIds',
      },
      {
        key: 'results',
        label: 'Results',
      },
      {
        key: 'startedAt',
        label: 'StartedAt',
      },
      {
        key: 'completedAt',
        label: 'CompletedAt',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
