import { spawn, ChildProcess } from 'node:child_process'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import * as http from 'node:http'

const sleep = promisify(setTimeout)

let serverProcess: ChildProcess | null = null
let isServerStartedByTests = false

/**
 * Check if server is already running on port 3000
 */
export async function isServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/health', (res) => {
      resolve(res.statusCode === 200)
    })
    
    req.on('error', () => {
      resolve(false)
    })
    
    req.setTimeout(2000, () => {
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
export async function startLocalServer(hookTimeout = 10000): Promise<string> {
  if (process.env.CI === 'true') {
    console.log('Running in CI environment, using mock API key')
    return 'test-api-key-for-ci'
  }
  
  // Check if server is already running
  const running = await isServerRunning()
  if (running) {
    console.log('Server is already running on port 3000')
    return process.env.APIS_DO_API_KEY || process.env.DO_API_KEY || 'test-api-key'
  }
  
  console.log('Starting local server...')
  const rootDir = resolve(__dirname, '../../../../')
  
  try {
    if (process.env.USE_MOCK_SERVER === 'true') {
      console.log('Using mock server approach as specified by USE_MOCK_SERVER')
      return 'test-api-key-mock'
    }
    
    serverProcess = spawn('pnpm', ['dev'], {
      cwd: rootDir,
      stdio: 'pipe',
      shell: true,
      detached: false, // Don't detach to ensure proper cleanup
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
    
    const maxAttempts = Math.floor((hookTimeout - 5000) / 1000)
    let attempts = 0
    
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
    
    console.log('Server startup timed out, using mock API key for tests')
    return 'test-api-key-mock'
  } catch (error) {
    console.error('Error starting server:', error)
    return 'test-api-key-mock' // Return a mock API key to allow tests to continue
  }
}

/**
 * Stop the local server if it was started by tests
 */
export async function stopLocalServer(): Promise<void> {
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
