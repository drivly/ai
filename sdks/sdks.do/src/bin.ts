#!/usr/bin/env node

import { CLI } from './cli.js'

const cli = new CLI()

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  try {
    switch (command) {
      case 'init':
        await cli.init({ name: args[1], force: args.includes('--force') })
        break
      case 'login':
        await cli.login({ token: args[1] })
        break
      case 'logout':
        await cli.logout()
        break
      case 'list':
        const packages = await cli.listPackages()
        console.log(JSON.stringify(packages, null, 2))
        break
      case 'create':
        if (!args[1]) {
          console.error('Package name is required')
          process.exit(1)
        }
        const collections = args.slice(2).filter((arg) => !arg.startsWith('--'))
        await cli.createPackage(args[1], { collections })
        break
      case 'add':
        if (!args[1] || !args[2]) {
          console.error('Package ID and collection name are required')
          process.exit(1)
        }
        await cli.addCollection(args[1], args[2])
        break
      case 'remove':
        if (!args[1] || !args[2]) {
          console.error('Package ID and collection name are required')
          process.exit(1)
        }
        await cli.removeCollection(args[1], args[2])
        break
      case 'publish':
        if (!args[1]) {
          console.error('Package ID is required')
          process.exit(1)
        }
        await cli.publish(args[1], {
          tag: args.find((arg) => arg.startsWith('--tag='))?.split('=')[1],
          dryRun: args.includes('--dry-run'),
        })
        break
      default:
        console.log(`
sdks.do - SDK for publishing Functions, Workflows, and Databases to NPM

Usage:
  sdks init [name] [--force]        Initialize a new package
  sdks login [token]                Login to sdks.do
  sdks logout                       Logout from sdks.do
  sdks list                         List all packages
  sdks create <name> [collections]  Create a new package
  sdks add <packageId> <collection> Add a collection to a package
  sdks remove <packageId> <collection> Remove a collection from a package
  sdks publish <packageId> [--tag=latest] [--dry-run] Publish a package to NPM
        `)
        break
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
