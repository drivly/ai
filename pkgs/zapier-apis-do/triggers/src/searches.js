// List Triggers search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/triggers`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    params: {
      limit: bundle.inputData.limit || 10,
      page: bundle.inputData.page || 1,
      where: JSON.stringify(buildWhereClause(bundle.inputData))
    }
  });

  return response.data.docs || [];
};

// Build the where clause for filtering
const buildWhereClause = (inputData) => {
  const where = {};
  
  // Add filters for each field if provided
    if (inputData.name) {
    where.name = { equals: inputData.name };
  }
    if (inputData.payload) {
    where.payload = { equals: inputData.payload };
  }
    if (inputData.config) {
    where.config = { equals: inputData.config };
  }
  
  return where;
};

module.exports = {
  key: 'findTriggers',
  noun: 'Triggers',
  
  display: {
    label: 'Find Triggers',
    description: 'Finds Triggers in your account.'
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
        helpText: 'Maximum number of records to return'
      },
      {
        key: 'page',
        label: 'Page',
        type: 'integer',
        required: false,
        default: 1,
        helpText: 'Page number for pagination'
      },
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      required: false,
      helpText: 'Filter by Name'
    }
    ],
    
    outputFields: [
      {
        key: 'id',
        label: 'ID'
      },
    {
      key: 'name',
      label: 'Name'
    }
    ],
    
    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};
