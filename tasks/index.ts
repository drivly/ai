import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
import { handleGithubEvent } from './handleGithubEvent'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './schemaUtils'
import { processCodeFunctionTask } from './processCodeFunction'

export const tasks = [executeFunctionTask, generateCodeTask, processCodeFunctionTask]
export const workflows = [handleGithubEvent]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema }
