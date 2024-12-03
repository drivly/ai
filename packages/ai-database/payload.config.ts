import path from 'path'
import { buildConfig } from 'payload'
import { collections } from './index.js'

export default buildConfig({
  collections,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve('types.ts'),
  },
  db: {} as any,
})
