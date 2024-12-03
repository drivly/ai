import path from 'path'
import { buildConfig } from 'payload'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { collections } from './index.js'

export default buildConfig({
  collections,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve('types.ts'),
  },
  db: vercelPostgresAdapter(),
})
