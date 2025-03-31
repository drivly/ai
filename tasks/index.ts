import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
import { handleGithubEvent } from './handleGithubEvent'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './schemaUtils'
import { processCodeFunctionWrapperTask } from './processCodeFunctionWrapper'

export const tasks = [executeFunctionTask, generateCodeTask, processCodeFunctionWrapperTask]
export const workflows = [handleGithubEvent]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema }
