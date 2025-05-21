#!/usr/bin/env node
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Script to run database.do tests with proper authentication
 * This script:
 * 1. Creates a test user with admin privileges
 * 2. Creates an API key for testing
 * 3. Runs the database.do tests with the API key
 */
async function runDatabaseDoTests() {
  let payload
  let serverProcess

  try {
    console.log('Starting Payload server...')

    serverProcess = spawn('pnpm', ['dev'], {
      cwd: resolve(__dirname, '..'),
      env: {
        ...process.env,
        PAYLOAD_PORT: '3002', // Use a different port to avoid conflicts
      },
      stdio: 'pipe',
    })

    serverProcess.stdout.on('data', (data) => {
      console.log(`[Server]: ${data.toString().trim()}`)
    })

    serverProcess.stderr.on('data', (data) => {
      console.error(`[Server Error]: ${data.toString().trim()}`)
    })

    console.log('Waiting for server to start...')
    await new Promise((resolve) => setTimeout(resolve, 5000))

    payload = await getPayload({ config })

    console.log('Checking for existing test user...')
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: 'test@example.com' },
      },
    })

    let userId

    if (existingUsers.docs.length === 0) {
      console.log('Creating test user...')
      const testUser = await payload.create({
        collection: 'users',
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'test-password',
          role: 'admin',
          emailVerified: true,
        },
      })
      userId = testUser.id
      console.log(`Test user created with ID: ${userId}`)
    } else {
      userId = existingUsers.docs[0].id
      console.log(`Test user already exists with ID: ${userId}`)
    }

    console.log('Checking for existing API key...')
    const existingApiKeys = await payload.find({
      collection: 'apikeys',
      where: {
        name: { equals: 'Test API Key' },
      },
    })

    let apiKeyValue

    if (existingApiKeys.docs.length === 0) {
      console.log('Creating API key...')
      const apiKey = await payload.create({
        collection: 'apikeys',
        data: {
          name: 'Test API Key',
          description: 'API key for automated tests',
          email: 'test@example.com',
        },
      })

      apiKeyValue = apiKey.apiKey
      console.log(`API key created: ${apiKeyValue}`)
    } else {
      apiKeyValue = existingApiKeys.docs[0].apiKey
      console.log(`API key already exists: ${apiKeyValue || '[hidden]'}`)

      if (!apiKeyValue) {
        console.log('API key is hidden. Creating a new one...')
        await payload.delete({
          collection: 'apikeys',
          id: existingApiKeys.docs[0].id,
        })

        const apiKey = await payload.create({
          collection: 'apikeys',
          data: {
            name: 'Test API Key',
            description: 'API key for automated tests',
            email: 'test@example.com',
          },
        })

        apiKeyValue = apiKey.apiKey
        console.log(`New API key created: ${apiKeyValue}`)
      }
    }

    console.log('Running database.do tests...')
    const testProcess = spawn('pnpm', ['test'], {
      cwd: resolve(__dirname, '../sdks/database.do'),
      env: {
        ...process.env,
        DO_API_KEY: apiKeyValue,
        PAYLOAD_PORT: '3002',
      },
      stdio: 'inherit',
    })

    const exitCode = await new Promise((resolve) => {
      testProcess.on('close', resolve)
    })

    console.log(`Tests completed with exit code: ${exitCode}`)
    return exitCode
  } catch (error) {
    console.error('Error running database.do tests:', error)
    return 1
  } finally {
    if (payload) {
      await payload.shutdown()
    }

    if (serverProcess) {
      console.log('Shutting down Payload server...')
      serverProcess.kill()
    }
  }
}

runDatabaseDoTests()
  .then((exitCode) => {
    process.exit(exitCode)
  })
  .catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })
