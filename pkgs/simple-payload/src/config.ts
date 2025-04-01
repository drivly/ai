import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

/**
 * Creates a payload configuration with sensible defaults
 * that can be extended with custom options
 */
export const createPayloadConfig = (options: any = {}) => {
  const collections = options.collections || []

  const config = buildConfig({
    admin: {
      user: options.admin?.user || 'users',
      meta: {
        titleSuffix: options.admin?.titleSuffix || '- Payload CMS',
        ...options.admin?.meta,
      },
      ...options.admin,
    },
    
    collections: options.collections || collections,
    
    editor: options.editor || lexicalEditor(),
    
    db: options.db || mongooseAdapter({
      url: options.databaseUri || process.env.DATABASE_URI || '',
    }),
    
    secret: options.secret || process.env.PAYLOAD_SECRET || '',
    
    ...options,
  })
  
  return config
}
