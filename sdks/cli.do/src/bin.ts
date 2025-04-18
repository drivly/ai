#!/usr/bin/env node
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { CLI as ApisCLI } from 'apis.do/src/cli'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.join(__dirname, '..', '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const version = packageJson.version

let config = {}
const configPath = '.ai/config.json'
try {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  }
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error('Error loading config:', errorMessage)
}

const args = process.argv.slice(2)

async function main() {
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp()
    return
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log(`cli.do v${version}`)
    return
  }

  try {
    let sdkName, sdkArgs

    if (args[0].includes('.do')) {
      sdkName = args[0]
      sdkArgs = args.slice(1)
    } else {
      sdkName = args[0] + '.do'
      sdkArgs = args.slice(1)
    }

    const sdkNameClean = sdkName.replace('.do', '')

    switch (sdkName) {
      case 'apis.do':
        await executeSdkCommand(
          'apis',
          new ApisCLI({
            apiKey: process.env.APIS_DO_API_KEY || process.env.DO_API_KEY,
            configPath,
          }),
          sdkArgs,
        )
        break
      case 'workflows.do':
        await executeSdkCommand(
          'workflows',
          new ApisCLI({
            apiKey: process.env.WORKFLOWS_DO_API_KEY || process.env.DO_API_KEY,
            configPath,
          }),
          sdkArgs,
          'workflows',
        )
        break
      case 'functions.do':
        await executeSdkCommand(
          'functions',
          new ApisCLI({
            apiKey: process.env.FUNCTIONS_DO_API_KEY || process.env.DO_API_KEY,
            configPath,
          }),
          sdkArgs,
          'functions',
        )
        break
      case 'agents.do':
        await executeSdkCommand(
          'agents',
          new ApisCLI({
            apiKey: process.env.AGENTS_DO_API_KEY || process.env.DO_API_KEY,
            configPath,
          }),
          sdkArgs,
          'agents',
        )
        break
      default:
        console.error(`Unknown SDK: ${sdkName}`)
        showHelp()
        process.exit(1)
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error: ${errorMessage}`)
    process.exit(1)
  }
}

async function executeSdkCommand(sdkName: string, cli: any, args: string[], defaultCollection?: string) {
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showSdkHelp(sdkName)
    return
  }

  const command = args[0]
  const commandArgs = args.slice(1)

  try {
    switch (command) {
      case 'init':
        await cli.init({ force: commandArgs.includes('--force') })
        console.log(`${sdkName} project initialized successfully`)
        break
      case 'login':
        await cli.login({ token: commandArgs[0] })
        console.log(`Logged in to ${sdkName} successfully`)
        break
      case 'logout':
        await cli.logout()
        console.log(`Logged out from ${sdkName} successfully`)
        break
      case 'pull':
        await cli.pull({ resources: commandArgs })
        console.log(`Resources pulled from ${sdkName} successfully`)
        break
      case 'push':
        await cli.push({ resources: commandArgs })
        console.log(`Resources pushed to ${sdkName} successfully`)
        break
      case 'sync':
        const syncMode = commandArgs.includes('--mode-db')
          ? 'database'
          : commandArgs.includes('--mode-local')
            ? 'local'
            : commandArgs.includes('--mode-github')
              ? 'github'
              : undefined
        await cli.sync({ mode: syncMode })
        console.log(`Resources synced with ${sdkName} successfully`)
        break
      case 'list':
        const listCollection = commandArgs[0] || defaultCollection
        if (!listCollection) {
          console.error('Error: Collection name required')
          process.exit(1)
        }
        const listResult = await cli.list(listCollection)
        console.log(JSON.stringify(listResult, null, 2))
        break
      case 'get':
        const getCollection = commandArgs[0] || defaultCollection
        const getId = getCollection === defaultCollection ? commandArgs[0] : commandArgs[1]
        if (!getCollection || !getId) {
          console.error('Error: Collection name and ID required')
          process.exit(1)
        }
        const getResult = await cli.get(getCollection, getId)
        console.log(JSON.stringify(getResult, null, 2))
        break
      case 'create':
        const createCollection = commandArgs[0] || defaultCollection
        if (!createCollection) {
          console.error('Error: Collection name required')
          process.exit(1)
        }
        let createData
        try {
          const dataIndex = createCollection === defaultCollection ? 0 : 1
          createData = JSON.parse(commandArgs[dataIndex] || '{}')
        } catch (e) {
          console.error('Error: Invalid JSON data')
          process.exit(1)
        }
        const createResult = await cli.create(createCollection, createData)
        console.log(JSON.stringify(createResult, null, 2))
        break
      case 'update':
        const updateCollection = commandArgs[0] || defaultCollection
        const updateId = updateCollection === defaultCollection ? commandArgs[0] : commandArgs[1]
        if (!updateCollection || !updateId) {
          console.error('Error: Collection name and ID required')
          process.exit(1)
        }
        let updateData
        try {
          const dataIndex = updateCollection === defaultCollection ? 1 : 2
          updateData = JSON.parse(commandArgs[dataIndex] || '{}')
        } catch (e) {
          console.error('Error: Invalid JSON data')
          process.exit(1)
        }
        const updateResult = await cli.update(updateCollection, updateId, updateData)
        console.log(JSON.stringify(updateResult, null, 2))
        break
      case 'delete':
        const deleteCollection = commandArgs[0] || defaultCollection
        const deleteId = deleteCollection === defaultCollection ? commandArgs[0] : commandArgs[1]
        if (!deleteCollection || !deleteId) {
          console.error('Error: Collection name and ID required')
          process.exit(1)
        }
        const deleteResult = await cli.delete(deleteCollection, deleteId)
        console.log(JSON.stringify(deleteResult, null, 2))
        break
      case 'execute':
        if (sdkName !== 'functions' && !commandArgs[0]) {
          console.error('Error: Function ID required')
          process.exit(1)
        }
        let executeInputs
        try {
          executeInputs = JSON.parse(commandArgs[1] || '{}')
        } catch (e) {
          console.error('Error: Invalid JSON inputs')
          process.exit(1)
        }
        const executeResult = await cli.executeFunction(commandArgs[0], executeInputs)
        console.log(JSON.stringify(executeResult, null, 2))
        break
      default:
        console.error(`Unknown command: ${command}`)
        showSdkHelp(sdkName)
        process.exit(1)
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(`Error: ${errorMessage}`)
    process.exit(1)
  }
}

function showHelp() {
  console.log(`
cli.do v${version}

Usage:
  do <sdk> <command> [options]
  <sdk>.do <command> [options]

Examples:
  do functions list
  functions.do list
  do workflows execute myWorkflow
  workflows.do execute myWorkflow

Available SDKs:
  apis       - APIs Gateway commands
  functions  - AI Functions commands
  workflows  - Workflows commands
  agents     - AI Agents commands

Common Commands:
  init                Initialize a new project
  login [token]       Login with API token
  logout              Remove stored credentials
  pull [resources]    Pull remote resources to local project
  push [resources]    Push local resources to remote
  sync                Sync local and remote resources
  list <collection>   List resources in a collection
  get <collection> <id>  Get a specific resource
  create <collection> [data]  Create a new resource
  update <collection> <id> [data]  Update a resource
  delete <collection> <id>  Delete a resource
  execute <functionId> [inputs]  Execute a function

Options:
  --help, -h          Show this help message
  --version, -v       Show version information

Environment Variables:
  DO_API_KEY          API key for authentication (used for all SDKs)
  APIS_DO_API_KEY     API key for apis.do
  FUNCTIONS_DO_API_KEY API key for functions.do
  WORKFLOWS_DO_API_KEY API key for workflows.do
  AGENTS_DO_API_KEY   API key for agents.do
`)
}

function showSdkHelp(sdkName: string) {
  console.log(`
${sdkName}.do CLI

Usage:
  do ${sdkName} <command> [options]
  ${sdkName}.do <command> [options]

Commands:
  init                Initialize a new project
  login [token]       Login with API token
  logout              Remove stored credentials
  pull [resources]    Pull remote resources to local project
  push [resources]    Push local resources to remote
  sync                Sync local and remote resources
    --mode-db         Use database as source of truth
    --mode-local      Use local files as source of truth
    --mode-github     Use GitHub repository as source of truth
  list <collection>   List resources in a collection
  get <collection> <id>  Get a specific resource
  create <collection> [data]  Create a new resource
  update <collection> <id> [data]  Update a resource
  delete <collection> <id>  Delete a resource
  execute <functionId> [inputs]  Execute a function

Options:
  --help, -h          Show this help message
  --version, -v       Show version information

Environment Variables:
  ${sdkName.toUpperCase()}_DO_API_KEY  API key for authentication
  DO_API_KEY          Alternative API key for authentication
`)
}

main().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error('Unhandled error:', errorMessage)
  process.exit(1)
})
