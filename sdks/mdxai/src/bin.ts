#!/usr/bin/env node
import { CLI } from './cli.js'

const cli = new CLI()
const [command, ...args] = process.argv.slice(2)

async function run() {
  if (!command || command === '--help' || command === '-h') {
    showHelp()
    return
  }
  
  try {
    switch (command) {
      case 'init':
        await cli.init()
        break
      case 'generate':
        await cli.generate(args[0], JSON.parse(args[1] || '{}'))
        break
      case 'edit':
        await cli.edit(args[0], JSON.parse(args[1] || '{}'))
        break
      case 'batch':
        await cli.batch(args[0], JSON.parse(args[1] || '{}'))
        break
      default:
        console.error(`Unknown command: ${command}`)
        showHelp()
    }
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

function showHelp() {
  console.log(`
  mdxai - CLI to recursively generate and edit MDX files using AI
  
  Commands:
    init                   Initialize configuration
    generate <path> [opts] Generate new MDX file(s)
    edit <path> [opts]     Edit existing MDX file(s)
    batch <pattern> [opts] Process multiple files
  `)
}

run()
