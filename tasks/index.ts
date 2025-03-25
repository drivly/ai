import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './schemaUtils'

export const tasks = [executeFunctionTask, generateCodeTask]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema }
