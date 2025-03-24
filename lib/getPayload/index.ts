import payload from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Cache the Payload client to avoid multiple initializations
let cachedPayloadClient: any = null

interface GetPayloadOptions {
  initOptions?: {
    local?: boolean
    secret?: string
    mongoURL?: string
    email?: string
    password?: string
  }
}

export const getPayloadClient = async ({ initOptions }: GetPayloadOptions = {}) => {
  if (!process.env.PAYLOAD_SECRET) {
    process.env.PAYLOAD_SECRET = 'payload-secret-key'
  }

  if (!process.env.DATABASE_URI) {
    process.env.DATABASE_URI = 'mongodb://localhost/payload-local'
  }

  if (cachedPayloadClient) {
    return cachedPayloadClient
  }

  const options = {
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.DATABASE_URI,
    local: true,
    ...initOptions,
  }

  // Initialize Payload
  cachedPayloadClient = await payload.init({
    secret: options.secret,
    mongoURL: options.mongoURL,
    local: options.local,
  })

  return cachedPayloadClient
}