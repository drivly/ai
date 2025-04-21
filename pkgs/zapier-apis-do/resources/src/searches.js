// List Resources search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/resources`,
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
  if (inputData.yaml) {
    where.yaml = { equals: inputData.yaml }
  }
  if (inputData.data) {
    where.data = { equals: inputData.data }
  }
  if (inputData.embedding) {
    where.embedding = { equals: inputData.embedding }
  }
  if (inputData.subjectOf) {
    where.subjectOf = { equals: inputData.subjectOf }
  }
  if (inputData.objectOf) {
    where.objectOf = { equals: inputData.objectOf }
  }

  return where
}

module.exports = {
  key: 'findResources',
  noun: 'Resources',

  display: {
    label: 'Find Resources',
    description: 'Finds Resources in your account.',
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
        key: 'yaml',
        label: 'Yaml',
        type: 'string',
        required: false,
        helpText: 'Filter by Yaml',
      },
      {
        key: 'subjectOf',
        label: 'SubjectOf',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related actions',
      },
      {
        key: 'objectOf',
        label: 'ObjectOf',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related actions',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'yaml',
        label: 'Yaml',
      },
      {
        key: 'subjectOf',
        label: 'SubjectOf',
      },
      {
        key: 'objectOf',
        label: 'ObjectOf',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
