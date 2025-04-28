import { spawn, ChildProcess } from 'node:child_process'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import * as http from 'node:http'

const sleep = promisify(setTimeout)

let serverProcess: ChildProcess | null = null
let isServerStartedByTests = false

// Check if we're running in a CI environment
const isCI = process.env.CI === 'true'

/**
 * Check if server is already running on port 3000
 */
export async function isServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('Checking if server is running on port 3000...')
    const req = http.get('http://localhost:3000/api/health', (res) => {
      console.log(`Server health check response: ${res.statusCode}`)
      resolve(res.statusCode === 200)
    })
    
    req.on('error', (error) => {
      console.log(`Server health check error: ${error.message}`)
      resolve(false)
    })
    
    req.setTimeout(5000, () => {
      console.log('Server health check timed out')
      req.destroy()
      resolve(false)
    })
    
    req.end()
  })
}

/**
 * Start a local server if one is not already running
 * 
 * @param hookTimeout - The timeout for the test hook in milliseconds
 * @returns API key for testing
 */
export async function startLocalServer(hookTimeout = 60000): Promise<string> {
  console.log(`Environment: ${isCI ? 'CI' : 'Local'}, Hook timeout: ${hookTimeout}ms`)
  
  if (isCI) {
    console.log('Running in CI environment, skipping server startup')
    return process.env.APIS_DO_API_KEY || process.env.DO_API_KEY || 'test-api-key'
  }
  
  // Check if server is already running
  const running = await isServerRunning()
  if (running) {
    console.log('Server is already running on port 3000')
    return process.env.APIS_DO_API_KEY || process.env.DO_API_KEY || 'test-api-key'
  }
  
  console.log('Starting local server...')
  const rootDir = resolve(__dirname, '../../../../')
  console.log(`Root directory: ${rootDir}`)
  
  try {
    serverProcess = spawn('pnpm', ['dev'], {
      cwd: rootDir,
      stdio: 'pipe',
      shell: true,
      detached: false, // Don't detach to ensure proper cleanup
      env: { ...process.env, FORCE_COLOR: 'true' }, // Enable colored output
    })
    
    serverProcess.on('error', (error) => {
      console.error('Server process error:', error)
    })
    
    if (serverProcess.stdout) {
      serverProcess.stdout.on('data', (data) => {
        console.log(`Server stdout: ${data}`)
      })
    }
    
    if (serverProcess.stderr) {
      serverProcess.stderr.on('data', (data) => {
        console.error(`Server stderr: ${data}`)
      })
    }
    
    isServerStartedByTests = true
    
    const maxAttempts = Math.floor((hookTimeout - 10000) / 1000)
    let attempts = 0
    
    console.log(`Will try server health check up to ${maxAttempts} times...`)
    
    while (attempts < maxAttempts) {
      const ready = await isServerRunning()
      if (ready) {
        console.log('Local server is ready on port 3000')
        return process.env.APIS_DO_API_KEY || process.env.DO_API_KEY || 'test-api-key'
      }
      
      console.log(`Waiting for server to start (${attempts+1}/${maxAttempts})...`)
      await sleep(1000)
      attempts++
    }
    
    console.error('Server startup timed out after', maxAttempts, 'attempts')
    throw new Error(`Server startup timed out after ${maxAttempts} attempts`)
  } catch (error) {
    console.error('Error starting server:', error)
    throw new Error('Failed to start local server: ' + error)
  }
}

/**
 * Stop the local server if it was started by tests
 */
export async function stopLocalServer(): Promise<void> {
  if (isCI) {
    console.log('Running in CI environment, no server to stop')
    return
  }
  
  if (serverProcess && isServerStartedByTests) {
    console.log('Stopping local server...')
    try {
      if (process.platform === 'win32' && serverProcess.pid) {
        spawn('taskkill', ['/pid', serverProcess.pid.toString(), '/f', '/t'])
      } else if (serverProcess.pid) {
        process.kill(serverProcess.pid, 'SIGINT')
      }
      
      await sleep(1000)
    } catch (error) {
      console.error('Error stopping server:', error)
    } finally {
      serverProcess = null
      isServerStartedByTests = false
    }
  }
}
