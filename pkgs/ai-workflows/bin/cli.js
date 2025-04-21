#!/usr/bin/env node

import { Workflow } from '../src/index.js'

const cli = {
  name: 'ai-workflows',
  description: 'CLI for managing AI workflows',
  commands: [
    {
      name: 'list',
      description: 'List available workflows',
      action: async () => {
        console.log('Available workflows:')
        console.log('- No workflows found')
      },
    },
    {
      name: 'run',
      description: 'Run a workflow',
      args: [
        {
          name: 'name',
          description: 'Workflow name',
          required: true,
        },
      ],
      action: async (args) => {
        console.log(`Running workflow: ${args.name}`)
        console.log('Workflow completed')
      },
    },
    {
      name: 'help',
      description: 'Show help information',
      action: async () => {
        console.log('AI Workflows CLI')
        console.log('----------------')
        console.log('Commands:')
        console.log('  list           List available workflows')
        console.log('  run <name>     Run a workflow by name')
        console.log('  help           Show this help information')
      },
    },
  ],
}

const args = process.argv.slice(2)
const command = args[0]

if (!command || command === 'help') {
  cli.commands.find((cmd) => cmd.name === 'help').action()
} else {
  const cmdObj = cli.commands.find((cmd) => cmd.name === command)
  if (cmdObj) {
    const cmdArgs = {}
    if (cmdObj.args) {
      cmdObj.args.forEach((arg, index) => {
        cmdArgs[arg.name] = args[index + 1]
        if (arg.required && !cmdArgs[arg.name]) {
          console.error(`Error: Missing required argument '${arg.name}'`)
          process.exit(1)
        }
      })
    }
    cmdObj.action(cmdArgs)
  } else {
    console.error(`Error: Unknown command '${command}'`)
    console.log('Run "ai-workflows help" for usage information')
    process.exit(1)
  }
}
