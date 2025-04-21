// List Providers search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/providers`,
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
  if (inputData.id) {
    where.id = { equals: inputData.id }
  }
  if (inputData.description) {
    where.description = { equals: inputData.description }
  }
  if (inputData.website) {
    where.website = { equals: inputData.website }
  }
  if (inputData.logoUrl) {
    where.logoUrl = { equals: inputData.logoUrl }
  }

  return where
}

module.exports = {
  key: 'findProviders',
  noun: 'Providers',

  display: {
    label: 'Find Providers',
    description: 'Finds Providers in your account.',
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
        key: 'id',
        label: 'Id',
        type: 'string',
        required: false,
        helpText: 'Filter by Id',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'Filter by Description',
      },
      {
        key: 'website',
        label: 'Website',
        type: 'string',
        required: false,
        helpText: 'Filter by Website',
      },
      {
        key: 'logoUrl',
        label: 'LogoUrl',
        type: 'string',
        required: false,
        helpText: 'Filter by LogoUrl',
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
        key: 'id',
        label: 'Id',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'website',
        label: 'Website',
      },
      {
        key: 'logoUrl',
        label: 'LogoUrl',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
