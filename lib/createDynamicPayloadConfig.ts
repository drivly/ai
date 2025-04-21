import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { modifyDatabaseUri } from './modifyDatabaseUri'
import { getNounsForProject } from './getNounsForProject'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Creates a dynamic collection configuration from a noun
 * @param noun The noun to create a collection from
 * @returns A Payload collection configuration
 */
function createCollectionFromNoun(noun: any): CollectionConfig {
  const defaultSchema = [
    { name: 'uid', type: 'text', required: true },
    { name: 'data', type: 'json' },
  ]

  const fields = noun.schema?.length > 0 ? noun.schema : defaultSchema

  return {
    slug: noun.singular?.toLowerCase() || `${noun.name}-collection`,
    admin: {
      useAsTitle: 'uid',
      group: noun.group || 'Collections',
      description: `Collection for ${noun.name}`,
    },
    fields,
  }
}

/**
 * Creates a dynamic PayloadCMS configuration for a project
 * @param project The project to create a configuration for
 * @returns A Payload configuration
 */
export async function createDynamicPayloadConfig(project: any) {
  if (!project) {
    throw new Error('Project is required')
  }

  const nouns = await getNounsForProject(project.id)

  const collections = nouns.map(createCollectionFromNoun)

  const dbUri = modifyDatabaseUri(process.env.DATABASE_URI || '', project.id)

  return buildConfig({
    admin: {
      user: 'users', // Use the main users collection for authentication
      meta: {
        titleSuffix: `| ${project.name} Admin`,
      },
    },
    collections,
    editor: lexicalEditor(),
    db: mongooseAdapter({
      url: dbUri,
    }),
    typescript: {
      outputFile: path.resolve(dirname, 'payload.types.ts'),
    },
    secret: process.env.PAYLOAD_SECRET || '',
  })
}
