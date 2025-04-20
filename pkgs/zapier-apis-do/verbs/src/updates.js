// Update Verbs for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/verbs/${bundle.inputData.id}`,
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
  key: 'updateVerbs',
  noun: 'Verbs',

  display: {
    label: 'Update Verbs',
    description: 'Updates an existing Verbs.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Verbs to update',
      },
      {
        key: 'action',
        label: 'Action',
        type: 'string',
        required: false,
        helpText: 'The Action of the Verbs',
      },
      {
        key: 'act',
        label: 'Act',
        type: 'string',
        required: false,
        helpText: 'The Act of the Verbs',
      },
      {
        key: 'activity',
        label: 'Activity',
        type: 'string',
        required: false,
        helpText: 'The Activity of the Verbs',
      },
      {
        key: 'event',
        label: 'Event',
        type: 'string',
        required: false,
        helpText: 'The Event of the Verbs',
      },
      {
        key: 'subject',
        label: 'Subject',
        type: 'string',
        required: false,
        helpText: 'The Subject of the Verbs',
      },
      {
        key: 'object',
        label: 'Object',
        type: 'string',
        required: false,
        helpText: 'The Object of the Verbs',
      },
      {
        key: 'inverse',
        label: 'Inverse',
        type: 'string',
        required: false,
        helpText: 'The Inverse of the Verbs',
      },
      {
        key: 'inverseAct',
        label: 'InverseAct',
        type: 'string',
        required: false,
        helpText: 'The InverseAct of the Verbs',
      },
      {
        key: 'inverseActivity',
        label: 'InverseActivity',
        type: 'string',
        required: false,
        helpText: 'The InverseActivity of the Verbs',
      },
      {
        key: 'inverseEvent',
        label: 'InverseEvent',
        type: 'string',
        required: false,
        helpText: 'The InverseEvent of the Verbs',
      },
      {
        key: 'inverseSubject',
        label: 'InverseSubject',
        type: 'string',
        required: false,
        helpText: 'The InverseSubject of the Verbs',
      },
      {
        key: 'inverseObject',
        label: 'InverseObject',
        type: 'string',
        required: false,
        helpText: 'The InverseObject of the Verbs',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'action',
        label: 'Action',
      },
      {
        key: 'act',
        label: 'Act',
      },
      {
        key: 'activity',
        label: 'Activity',
      },
      {
        key: 'event',
        label: 'Event',
      },
      {
        key: 'subject',
        label: 'Subject',
      },
      {
        key: 'object',
        label: 'Object',
      },
      {
        key: 'inverse',
        label: 'Inverse',
      },
      {
        key: 'inverseAct',
        label: 'InverseAct',
      },
      {
        key: 'inverseActivity',
        label: 'InverseActivity',
      },
      {
        key: 'inverseEvent',
        label: 'InverseEvent',
      },
      {
        key: 'inverseSubject',
        label: 'InverseSubject',
      },
      {
        key: 'inverseObject',
        label: 'InverseObject',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
