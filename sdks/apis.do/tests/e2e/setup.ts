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
    
    req.end()
  })
}

/**
 * Start a local server if one is not already running
 */
export async function startLocalServer(): Promise<string> {
  const running = await isServerRunning()
  if (running) {
    console.log('Server is already running on port 3000')
    return process.env.APIS_DO_API_KEY || process.env.DO_API_KEY || ''
  }
  
  console.log('Starting local server...')
  const rootDir = resolve(__dirname, '../../../../')
  serverProcess = spawn('pnpm', ['dev'], {
    cwd: rootDir,
    stdio: 'pipe',
    shell: true,
    detached: false,
  })
  
  isServerStartedByTests = true
  
  let attempts = 0
  const maxAttempts = 60
  while (attempts < maxAttempts) {
    const ready = await isServerRunning()
    if (ready) {
      console.log('Local server is ready on port 3000')
      break
    }
    
    console.log(`Waiting for server to start (${attempts+1}/${maxAttempts})...`)
    await sleep(1000)
    attempts++
  }
  
  if (attempts >= maxAttempts) {
    throw new Error('Server failed to start after 60 seconds')
  }
  
  return process.env.APIS_DO_API_KEY || process.env.DO_API_KEY || ''
}

/**
 * Stop the local server if it was started by tests
 */
export async function stopLocalServer(): Promise<void> {
  if (serverProcess && isServerStartedByTests) {
    console.log('Stopping local server...')
    if (process.platform === 'win32' && serverProcess.pid) {
      spawn('taskkill', ['/pid', serverProcess.pid.toString(), '/f', '/t'])
    } else if (serverProcess.pid) {
      process.kill(-serverProcess.pid, 'SIGINT')
    }
    serverProcess = null
    isServerStartedByTests = false
  }
}
