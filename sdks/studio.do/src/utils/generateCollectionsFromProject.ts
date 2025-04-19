import { Collection } from '../types'

/**
 * Creates a collection configuration from a noun
 * @param noun The noun to create a collection from
 * @returns A collection configuration
 */
function createCollectionFromNoun(noun: any): Collection {
  const defaultSchema = [
    { name: 'uid', type: 'text', required: true },
    { name: 'data', type: 'json' },
  ]

  const fields = noun.schema?.length > 0 ? noun.schema : defaultSchema

  return {
    slug: noun.singular?.toLowerCase() || `${noun.name}-collection`,
    admin: {
      useAsTitle: 'uid',
      group: noun.group || 'Collections',
      description: `Collection for ${noun.name}`,
    },
    fields,
  }
}

/**
 * Creates task fields from a function
 * @param func The function to create fields from
 * @returns Fields for a task
 */
function createTaskFieldsFromFunction(func: any) {
  return [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'function', type: 'relationship', relationTo: 'functions' },
    { name: 'inputs', type: 'json' },
    { name: 'status', type: 'select', options: ['pending', 'running', 'completed', 'failed'] },
    { name: 'result', type: 'json' },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
  ]
}

/**
 * Creates workflow fields from a workflow
 * @param workflow The workflow to create fields from
 * @returns Fields for a workflow
 */
function createWorkflowFieldsFromWorkflow(workflow: any) {
  return [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text' },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'function', type: 'relationship', relationTo: 'functions' },
        { name: 'inputs', type: 'json' },
        { name: 'condition', type: 'code', language: 'javascript' },
      ],
    },
    { name: 'status', type: 'select', options: ['active', 'draft', 'archived'] },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
  ]
}

/**
 * Generates collections from nouns, functions, and workflows
 * @param nouns Array of nouns from a project
 * @param functions Array of functions from a project
 * @param workflows Array of workflows from a project
 * @returns Array of collection configurations
 */
export function generateCollectionsFromProject(nouns: any[], functions: any[], workflows: any[]): Collection[] {
  const collections: Collection[] = []

  nouns.forEach((noun) => {
    collections.push(createCollectionFromNoun(noun))
  })

  if (functions.length > 0) {
    collections.push({
      slug: 'tasks',
      admin: {
        useAsTitle: 'name',
        group: 'System',
        description: 'Tasks derived from Functions',
      },
      fields: createTaskFieldsFromFunction(functions[0]),
    })
  }

  if (workflows.length > 0) {
    collections.push({
      slug: 'workflows',
      admin: {
        useAsTitle: 'name',
        group: 'System',
        description: 'Workflows for automation',
      },
      fields: createWorkflowFieldsFromWorkflow(workflows[0]),
    })
  }

  return collections
}
