#!/usr/bin/env node

import { CLI } from './cli.js'

const cli = new CLI()

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  try {
    switch (command) {
      case 'list':
        const integrations = await cli.listIntegrations()
        console.log(JSON.stringify(integrations, null, 2))
        break
      case 'connect':
        if (!args[1]) {
          console.error('Integration name is required')
          process.exit(1)
        }
        await cli.connect(args[1], {
          token: args.find((arg) => arg.startsWith('--token='))?.split('=')[1],
        })
        break
      case 'disconnect':
        if (!args[1]) {
          console.error('Integration name is required')
          process.exit(1)
        }
        await cli.disconnect(args[1])
        break
      default:
        console.log(`
integrations.do - Unified interface for connecting applications and automating workflows across services

Usage:
  integrations list                    List all available integrations
  integrations connect <name> [--token=<token>]  Connect to an integration
  integrations disconnect <name>       Disconnect from an integration
        `)
        break
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
