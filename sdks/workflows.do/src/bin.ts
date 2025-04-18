#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CLI } from './cli.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.join(__dirname, '..', '..', '..', 'package.json')
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

const cli = new CLI({
  apiKey: process.env.WORKFLOWS_DO_API_KEY || process.env.DO_API_KEY,
  configPath,
})

const args = process.argv.slice(2)
const command = args[0]

async function runCommand() {
  if (!command || command === '--help' || command === '-h') {
    showHelp()
    return
  }

  if (command === '--version' || command === '-v') {
    console.log(`workflows.do CLI v${version}`)
    return
  }

  try {
    switch (command) {
      case 'init':
        await cli.init({ force: args.includes('--force') })
        console.log('Project initialized successfully')
        break
      case 'login':
        await cli.login({ token: args[1] })
        console.log('Logged in successfully')
        break
      case 'logout':
        await cli.logout()
        console.log('Logged out successfully')
        break
      case 'pull':
        await cli.pull({ resources: args.slice(1) })
        console.log('Resources pulled successfully')
        break
      case 'push':
        await cli.push({ resources: args.slice(1) })
        console.log('Resources pushed successfully')
        break
      case 'sync':
        const syncMode = args.includes('--mode-db') ? 'database' : args.includes('--mode-local') ? 'local' : args.includes('--mode-github') ? 'github' : undefined
        await cli.sync({ mode: syncMode })
        console.log('Resources synced successfully')
        break
      case 'list':
        if (!args[1]) {
          console.error('Error: Collection name required')
          process.exit(1)
        }
        const listResult = await cli.list(args[1])
        console.log(JSON.stringify(listResult, null, 2))
        break
      case 'get':
        if (!args[1] || !args[2]) {
          console.error('Error: Collection name and ID required')
          process.exit(1)
        }
        const getResult = await cli.get(args[1], args[2])
        console.log(JSON.stringify(getResult, null, 2))
        break
      case 'create':
        if (!args[1]) {
          console.error('Error: Collection name required')
          process.exit(1)
        }
        let createData
        try {
          createData = JSON.parse(args[2] || '{}')
        } catch (e) {
          console.error('Error: Invalid JSON data')
          process.exit(1)
        }
        const createResult = await cli.create(args[1], createData)
        console.log(JSON.stringify(createResult, null, 2))
        break
      case 'update':
        if (!args[1] || !args[2]) {
          console.error('Error: Collection name and ID required')
          process.exit(1)
        }
        let updateData
        try {
          updateData = JSON.parse(args[3] || '{}')
        } catch (e) {
          console.error('Error: Invalid JSON data')
          process.exit(1)
        }
        const updateResult = await cli.update(args[1], args[2], updateData)
        console.log(JSON.stringify(updateResult, null, 2))
        break
      case 'delete':
        if (!args[1] || !args[2]) {
          console.error('Error: Collection name and ID required')
          process.exit(1)
        }
        const deleteResult = await cli.delete(args[1], args[2])
        console.log(JSON.stringify(deleteResult, null, 2))
        break
      case 'execute':
        if (!args[1]) {
          console.error('Error: Workflow ID required')
          process.exit(1)
        }
        let executeInput
        try {
          executeInput = JSON.parse(args[2] || '{}')
        } catch (e) {
          console.error('Error: Invalid JSON input')
          process.exit(1)
        }
        let executeOptions
        try {
          executeOptions = JSON.parse(args[3] || '{}')
        } catch (e) {
          console.error('Error: Invalid JSON options')
          process.exit(1)
        }
        const executeResult = await cli.executeWorkflow(args[1], executeInput, executeOptions)
        console.log(JSON.stringify(executeResult, null, 2))
        break
      case 'register':
        if (!args[1]) {
          console.error('Error: Workflow definition file path required')
          process.exit(1)
        }
        let workflowDefinition
        try {
          const workflowFile = fs.readFileSync(args[1], 'utf8')
          workflowDefinition = JSON.parse(workflowFile)
        } catch (e) {
          console.error('Error: Invalid workflow definition file')
          process.exit(1)
        }
        const registerResult = await cli.registerWorkflow(workflowDefinition)
        console.log(JSON.stringify(registerResult, null, 2))
        break
      case 'scan':
        const dirPath = args[1] || process.cwd()
        if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
          console.error(`Error: Directory not found or invalid: ${dirPath}`)
          process.exit(1)
        }
        try {
          const results = await cli.scanAndRegisterWorkflows(dirPath, {
            recursive: args.includes('--recursive'),
            dryRun: args.includes('--dry-run'),
            verbose: args.includes('--verbose'),
          })
          console.log(JSON.stringify(results, null, 2))
        } catch (err) {
          console.error(`Error scanning workflows: ${err instanceof Error ? err.message : String(err)}`)
          process.exit(1)
        }
        break
      default:
        console.error(`Unknown command: ${command}`)
        showHelp()
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
workflows.do CLI v${version}

Usage:
  workflow [command] [options]

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
  
  execute <workflowId> [input] [options]  Execute a workflow
  register <filePath>  Register a workflow from a JSON file
  scan [directory]     Scan directory for workflow files and register them

Options:
  --help, -h          Show this help message
  --version, -v       Show version information
  --recursive         Scan directories recursively when using scan command
  --dry-run           Show what would be registered without actually registering workflows
  --verbose           Display detailed information during scanning process

Environment Variables:
  WORKFLOWS_DO_API_KEY  API key for authentication
  DO_API_KEY            Alternative API key for authentication
`)
}

runCommand().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error('Unhandled error:', errorMessage)
  process.exit(1)
})
