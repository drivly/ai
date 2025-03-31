import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
import { generateThingEmbedding } from './generateThingEmbedding'
import { handleGithubEvent } from './handleGithubEvent'
import { hybridSearchThings, searchThings } from './searchThings'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './schemaUtils'

export const tasks = [executeFunctionTask, generateCodeTask, generateThingEmbedding, searchThings, hybridSearchThings]
export const workflows = [handleGithubEvent]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema }
