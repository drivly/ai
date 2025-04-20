// List Nouns search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/nouns`,
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
  if (inputData.singular) {
    where.singular = { equals: inputData.singular }
  }
  if (inputData.plural) {
    where.plural = { equals: inputData.plural }
  }
  if (inputData.possessive) {
    where.possessive = { equals: inputData.possessive }
  }
  if (inputData.pluralPossessive) {
    where.pluralPossessive = { equals: inputData.pluralPossessive }
  }
  if (inputData.verb) {
    where.verb = { equals: inputData.verb }
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
  if (inputData.type) {
    where.type = { equals: inputData.type }
  }
  if (inputData.resources) {
    where.resources = { equals: inputData.resources }
  }

  return where
}

module.exports = {
  key: 'findNouns',
  noun: 'Nouns',

  display: {
    label: 'Find Nouns',
    description: 'Finds Nouns in your account.',
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
        key: 'singular',
        label: 'Singular',
        type: 'string',
        required: false,
        helpText: 'Filter by Singular',
      },
      {
        key: 'plural',
        label: 'Plural',
        type: 'string',
        required: false,
        helpText: 'Filter by Plural',
      },
      {
        key: 'possessive',
        label: 'Possessive',
        type: 'string',
        required: false,
        helpText: 'Filter by Possessive',
      },
      {
        key: 'pluralPossessive',
        label: 'PluralPossessive',
        type: 'string',
        required: false,
        helpText: 'Filter by PluralPossessive',
      },
      {
        key: 'verb',
        label: 'Verb',
        type: 'string',
        required: false,
        helpText: 'Filter by Verb',
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
        key: 'type',
        label: 'Type',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related things',
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
        key: 'singular',
        label: 'Singular',
      },
      {
        key: 'plural',
        label: 'Plural',
      },
      {
        key: 'possessive',
        label: 'Possessive',
      },
      {
        key: 'pluralPossessive',
        label: 'PluralPossessive',
      },
      {
        key: 'verb',
        label: 'Verb',
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
        key: 'type',
        label: 'Type',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
