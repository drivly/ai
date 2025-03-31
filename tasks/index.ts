import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
import { handleGithubEvent } from './handleGithubEvent'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './schemaUtils'
import { inflectNounsTask } from './inflectNouns'
import { conjugateVerbsTask } from './conjugateVerbs'
import { deployWorkerTask } from './deployWorker'

export const tasks = [executeFunctionTask, generateCodeTask, inflectNounsTask, conjugateVerbsTask, deployWorkerTask]
export const workflows = [handleGithubEvent]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema, inflectNounsTask, conjugateVerbsTask }
