// List Verbs search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/verbs`,
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
  if (inputData.action) {
    where.action = { equals: inputData.action }
  }
  if (inputData.act) {
    where.act = { equals: inputData.act }
  }
  if (inputData.activity) {
    where.activity = { equals: inputData.activity }
  }
  if (inputData.event) {
    where.event = { equals: inputData.event }
  }
  if (inputData.subject) {
    where.subject = { equals: inputData.subject }
  }
  if (inputData.object) {
    where.object = { equals: inputData.object }
  }
  if (inputData.inverse) {
    where.inverse = { equals: inputData.inverse }
  }
  if (inputData.inverseAct) {
    where.inverseAct = { equals: inputData.inverseAct }
  }
  if (inputData.inverseActivity) {
    where.inverseActivity = { equals: inputData.inverseActivity }
  }
  if (inputData.inverseEvent) {
    where.inverseEvent = { equals: inputData.inverseEvent }
  }
  if (inputData.inverseSubject) {
    where.inverseSubject = { equals: inputData.inverseSubject }
  }
  if (inputData.inverseObject) {
    where.inverseObject = { equals: inputData.inverseObject }
  }

  return where
}

module.exports = {
  key: 'findVerbs',
  noun: 'Verbs',

  display: {
    label: 'Find Verbs',
    description: 'Finds Verbs in your account.',
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
        key: 'action',
        label: 'Action',
        type: 'string',
        required: false,
        helpText: 'Filter by Action',
      },
      {
        key: 'act',
        label: 'Act',
        type: 'string',
        required: false,
        helpText: 'Filter by Act',
      },
      {
        key: 'activity',
        label: 'Activity',
        type: 'string',
        required: false,
        helpText: 'Filter by Activity',
      },
      {
        key: 'event',
        label: 'Event',
        type: 'string',
        required: false,
        helpText: 'Filter by Event',
      },
      {
        key: 'subject',
        label: 'Subject',
        type: 'string',
        required: false,
        helpText: 'Filter by Subject',
      },
      {
        key: 'object',
        label: 'Object',
        type: 'string',
        required: false,
        helpText: 'Filter by Object',
      },
      {
        key: 'inverse',
        label: 'Inverse',
        type: 'string',
        required: false,
        helpText: 'Filter by Inverse',
      },
      {
        key: 'inverseAct',
        label: 'InverseAct',
        type: 'string',
        required: false,
        helpText: 'Filter by InverseAct',
      },
      {
        key: 'inverseActivity',
        label: 'InverseActivity',
        type: 'string',
        required: false,
        helpText: 'Filter by InverseActivity',
      },
      {
        key: 'inverseEvent',
        label: 'InverseEvent',
        type: 'string',
        required: false,
        helpText: 'Filter by InverseEvent',
      },
      {
        key: 'inverseSubject',
        label: 'InverseSubject',
        type: 'string',
        required: false,
        helpText: 'Filter by InverseSubject',
      },
      {
        key: 'inverseObject',
        label: 'InverseObject',
        type: 'string',
        required: false,
        helpText: 'Filter by InverseObject',
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
