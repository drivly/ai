import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { generateAppTemplate } from './templates/app'
import { generateAuthenticationTemplate } from './templates/authentication'
import { generateCreateTemplate } from './templates/create'
import { generateListTemplate } from './templates/list'
import { generateGetTemplate } from './templates/get'
import { generateUpdateTemplate } from './templates/update'
import { generateDeleteTemplate } from './templates/delete'
import { ZapierCollectionConfig } from './types/collection'
import { camelCase, pascalCase, kebabCase } from './utils/stringUtils'

// Import collections dynamically
async function getCollections(collectionsPath?: string) {
  try {
    // Dynamic import for ESM compatibility
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const resolvedPath = collectionsPath || path.resolve(__dirname, '../../../collections/index.js')
    const collectionsModule = await import(resolvedPath)
    return collectionsModule.collections || []
  } catch (error) {
    console.error('Error importing collections:', error)
    return []
  }
}

// Main function to generate Zapier apps
export async function main(options: { collectionsPath?: string; outputDir?: string } = {}) {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    // Ensure output directories exist
    const outputDir = options.outputDir ? path.resolve(options.outputDir) : path.resolve(__dirname, '../apps')

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Get collections
    const collections = await getCollections(options.collectionsPath)

    if (!collections || collections.length === 0) {
      console.error('No collections found')
      return
    }

    console.log(`Found ${collections.length} collections`)

    // Generate Zapier apps for each collection
    for (const collection of collections) {
      const collectionSlug = collection.slug
      const collectionName = pascalCase(collectionSlug)
      const collectionDir = path.resolve(outputDir, collectionSlug)

      // Create collection directory
      if (!fs.existsSync(collectionDir)) {
        fs.mkdirSync(collectionDir, { recursive: true })
      }

      // Create src directory
      const srcDir = path.resolve(collectionDir, 'src')
      if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir, { recursive: true })
      }

      // Create test directory
      const testDir = path.resolve(collectionDir, 'test')
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true })
      }

      // Generate app.js
      const appContent = generateAppTemplate(collection)
      fs.writeFileSync(path.resolve(srcDir, 'index.js'), appContent)

      // Generate authentication.js
      const authContent = generateAuthenticationTemplate(collection)
      fs.writeFileSync(path.resolve(srcDir, 'authentication.js'), authContent)

      // Generate CRUD operations
      const createContent = generateCreateTemplate(collection)
      fs.writeFileSync(path.resolve(srcDir, 'creates.js'), createContent)

      const listContent = generateListTemplate(collection)
      fs.writeFileSync(path.resolve(srcDir, 'searches.js'), listContent)

      const getContent = generateGetTemplate(collection)
      fs.writeFileSync(path.resolve(srcDir, 'gets.js'), getContent)

      const updateContent = generateUpdateTemplate(collection)
      fs.writeFileSync(path.resolve(srcDir, 'updates.js'), updateContent)

      const deleteContent = generateDeleteTemplate(collection)
      fs.writeFileSync(path.resolve(srcDir, 'deletes.js'), deleteContent)

      // Generate package.json
      const packageJson = {
        name: `ai-primitives-zapier-${collectionSlug}`,
        version: '1.0.0',
        description: `Zapier integration for AI Primitives ${collectionName}`,
        main: 'src/index.js',
        scripts: {
          test: 'jest --testTimeout 10000',
          build: 'tsc',
          deploy: 'zapier push',
        },
        dependencies: {
          'zapier-platform-core': '^15.5.1',
        },
        devDependencies: {
          jest: '^29.7.0',
        },
        private: true,
      }

      fs.writeFileSync(path.resolve(collectionDir, 'package.json'), JSON.stringify(packageJson, null, 2))

      // Generate .gitignore
      const gitignore = `
# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# Build
/lib

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`
      fs.writeFileSync(path.resolve(collectionDir, '.gitignore'), gitignore.trim())

      // Generate .zapierapprc
      const zapierAppRc = {
        id: `ai-primitives-${collectionSlug}`,
        key: `ai-primitives-${collectionSlug}`,
      }

      fs.writeFileSync(path.resolve(collectionDir, '.zapierapprc'), JSON.stringify(zapierAppRc, null, 2))

      console.log(`Generated Zapier app for ${collectionName}`)
    }

    console.log('All Zapier apps generated successfully!')
  } catch (error) {
    console.error('Error generating Zapier apps:', error)
  }
}
