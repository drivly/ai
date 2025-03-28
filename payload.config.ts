// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
// import sharp from 'sharp'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Config } from './payload.types'

import { collections } from './collections'
import { tasks, workflows } from './tasks'

import { isSuperAdmin } from './lib/hooks/isSuperAdmin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: collections as any,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload.types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  jobs: {
    addParentToTaskLog: true,
    tasks,
    workflows,
  },
  // sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    // multiTenantPlugin<Config>({
    //   tenantSelectorLabel: 'Project',
    //   // tenantsArrayField: {},
    //   // tenantField: {},
    //   collections: {
    //     functions: {},
    //     workflows: {},
    //     agents: {},
    //   },
    //   userHasAccessToAllTenants: isSuperAdmin,
    // }),
  ],
})
