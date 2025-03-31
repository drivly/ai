#!/usr/bin/env node
import { CLI } from './cli.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const version = packageJson.version

const args = process.argv.slice(2)
const command = args[0]

let config = {}
const configPath = '.ai/config.json'
try {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  }
} catch (error) {
  console.error('Error loading config:', error)
}

const cli = new CLI({
  apiKey: process.env.APIS_DO_API_KEY || process.env.DO_API_KEY,
  configPath,
})

async function main() {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp()
    return
  }

  if (command === '--version' || command === '-v') {
    console.log(`apis.do CLI v${version}`)
    return
  }

  try {
    switch (command) {
      case 'init':
        await cli.init({ force: args.includes('--force') })
        break
      case 'login':
        await cli.login({ token: args[1] })
        break
      case 'logout':
        await cli.logout()
        break
      case 'pull':
        await cli.pull({ resources: args.slice(1) })
        break
      case 'push':
        await cli.push({ resources: args.slice(1) })
        break
      case 'sync':
        await cli.sync()
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
          console.error('Error: Function ID required')
          process.exit(1)
        }
        let executeInputs
        try {
          executeInputs = JSON.parse(args[2] || '{}')
        } catch (e) {
          console.error('Error: Invalid JSON inputs')
          process.exit(1)
        }
        const executeResult = await cli.executeFunction(args[1], executeInputs)
        console.log(JSON.stringify(executeResult, null, 2))
        break
      default:
        console.error(`Unknown command: ${command}`)
        showHelp()
        process.exit(1)
    }
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

function showHelp() {
  console.log(`
apis.do CLI v${version}

Usage:
  apis [command] [options]

Commands:
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
  APIS_DO_API_KEY     API key for authentication
  DO_API_KEY          Alternative API key for authentication
`)
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
