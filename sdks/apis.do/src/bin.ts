#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CLI } from './cli.js'
import { App } from './ui/app.js' // Import from .js extension for compiled output

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.join(__dirname, '..', 'package.json')
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
  apiKey: process.env.APIS_DO_API_KEY || process.env.DO_API_KEY,
  configPath,
})

const args = process.argv.slice(2)
const command = args[0]

render(React.createElement(App, { cli, args, command, version }))
  .waitUntilExit()
  .catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Unhandled error:', errorMessage)
    process.exit(1)
  })
