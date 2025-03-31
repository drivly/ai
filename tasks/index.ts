import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
import { handleGithubEvent } from './handleGithubEvent'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './schemaUtils'
import { processCodeFunctionWrapperTask } from './processCodeFunctionWrapper'
import { inflectNounsTask } from './inflectNouns'
import { conjugateVerbsTask } from './conjugateVerbs'

export const tasks = [executeFunctionTask, generateCodeTask, processCodeFunctionWrapperTask, inflectNounsTask, conjugateVerbsTask]
export const workflows = [handleGithubEvent]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema, inflectNounsTask, conjugateVerbsTask }
