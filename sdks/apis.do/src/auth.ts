import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { spawn } from 'node:child_process'
import os from 'node:os'
import crypto from 'node:crypto'
import { URL } from 'node:url'
import { writeFile } from './utils/fileUtils'

export const getConfigDir = (): string => {
  const homedir = os.homedir()

  switch (process.platform) {
    case 'win32':
      return path.join(process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming'), 'apis.do')
    case 'darwin':
      return path.join(homedir, 'Library', 'Application Support', 'apis.do')
    default:
      return path.join(homedir, '.config', 'apis.do')
  }
}

export const getApiKeyPath = (): string => {
  return path.join(getConfigDir(), 'credentials.json')
}

export const storeApiKey = async (apiKey: string): Promise<void> => {
  const configDir = getConfigDir()
  const filePath = getApiKeyPath()

  await fs.promises.mkdir(configDir, { recursive: true })

  const credentials = JSON.stringify({ apiKey }, null, 2)
  await writeFile(filePath, credentials)

  try {
    if (process.platform !== 'win32') {
      await fs.promises.chmod(filePath, 0o600)
    }
  } catch (error) {
    console.warn('Could not set secure file permissions for API key')
  }
}

export const loadApiKey = async (): Promise<string | null> => {
  try {
    const filePath = getApiKeyPath()
    const data = await fs.promises.readFile(filePath, 'utf8')
    const credentials = JSON.parse(data)
    return credentials.apiKey || null
  } catch (error) {
    return null
  }
}

export const removeApiKey = async (): Promise<boolean> => {
  try {
    const filePath = getApiKeyPath()
    await fs.promises.unlink(filePath)
    return true
  } catch (error) {
    return false
  }
}

export const generateState = (): string => {
  return crypto.randomBytes(16).toString('hex')
}

export const openBrowser = (url: string): void => {
  const command = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open'

  spawn(command, [url], {
    stdio: 'ignore',
    shell: true,
    detached: true,
  }).unref()
}

export const startLocalServer = (state: string): Promise<{ port: number; apiKey: string }> => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host}`)
      const pathname = url.pathname

      if (pathname === '/callback') {
        const receivedState = url.searchParams.get('state')
        const apiKey = url.searchParams.get('apiKey')
        const error = url.searchParams.get('error')

        if (receivedState !== state) {
          res.writeHead(400, { 'Content-Type': 'text/html' })
          res.end('<html><body><h1>Authentication Failed</h1><p>Invalid state parameter. Please try again.</p></body></html>')
          return
        }

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' })
          res.end(`<html><body><h1>Authentication Failed</h1><p>${error}</p></body></html>`)
          reject(new Error(error))
        } else if (apiKey) {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end('<html><body><h1>Authentication Successful</h1><p>You can now close this window and return to the CLI.</p></body></html>')

          server.close()

          const address = server.address()
          if (!address || typeof address === 'string') {
            resolve({ port: 0, apiKey })
          } else {
            resolve({ port: address.port, apiKey })
          }
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' })
          res.end('<html><body><h1>Authentication Failed</h1><p>No API key received. Please try again.</p></body></html>')
          reject(new Error('No API key received'))
        }
      } else {
        res.writeHead(302, { Location: '/callback?error=Invalid%20request' })
        res.end()
      }
    })

    server.on('error', (err) => {
      reject(err)
    })

    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      let port = 0

      if (address && typeof address !== 'string') {
        port = address.port
      }

      setTimeout(
        () => {
          if (server.listening) {
            server.close()
            reject(new Error('Authentication timed out after 5 minutes'))
          }
        },
        5 * 60 * 1000,
      )
    })
  })
}
