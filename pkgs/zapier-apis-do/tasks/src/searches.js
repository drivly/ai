// List Tasks search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/tasks`,
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
  if (inputData.status) {
    where.status = { equals: inputData.status }
  }
  if (inputData.queue) {
    where.queue = { equals: inputData.queue }
  }
  if (inputData.assigned) {
    where.assigned = { equals: inputData.assigned }
  }
  if (inputData.parent) {
    where.parent = { equals: inputData.parent }
  }
  if (inputData.description) {
    where.description = { equals: inputData.description }
  }
  if (inputData.subtasks) {
    where.subtasks = { equals: inputData.subtasks }
  }
  if (inputData.dependentOn) {
    where.dependentOn = { equals: inputData.dependentOn }
  }
  if (inputData.dependents) {
    where.dependents = { equals: inputData.dependents }
  }
  if (inputData.metadata) {
    where.metadata = { equals: inputData.metadata }
  }
  if (inputData.linearMetadata) {
    where.linearMetadata = { equals: inputData.linearMetadata }
  }

  return where
}

module.exports = {
  key: 'findTasks',
  noun: 'Tasks',

  display: {
    label: 'Find Tasks',
    description: 'Finds Tasks in your account.',
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
        key: 'queue',
        label: 'Queue',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related queues',
      },
      {
        key: 'assigned',
        label: 'Assigned',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related users',
      },
      {
        key: 'parent',
        label: 'Parent',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related tasks',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'Filter by Description',
      },
      {
        key: 'dependentOn',
        label: 'DependentOn',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related tasks',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'queue',
        label: 'Queue',
      },
      {
        key: 'assigned',
        label: 'Assigned',
      },
      {
        key: 'parent',
        label: 'Parent',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'dependentOn',
        label: 'DependentOn',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
