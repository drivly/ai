import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
import { handleGithubEvent } from './handleGithubEvent'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './schemaUtils'

export const tasks = [executeFunctionTask, generateCodeTask]
export const workflows = [handleGithubEvent]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema }
