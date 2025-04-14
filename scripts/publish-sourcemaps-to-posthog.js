import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const shouldUploadSourcemaps = process.env.NODE_ENV === 'production'

const config = {
  apiKey: process.env.POSTHOG_API_KEY,
  host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  sourceRoot: path.resolve(projectRoot, '.next'),
  projectId: 'ai', // Project name in PostHog
  version: process.env.APP_VERSION || new Date().toISOString(), // Use app version or timestamp
}

async function findSourcemaps(dir) {
  const sourcemaps = []

  async function scan(directory) {
    const files = await fs.readdir(directory, { withFileTypes: true })
    
    for (const file of files) {
      const filePath = path.join(directory, file.name)
      
      if (file.isDirectory()) {
        await scan(filePath)
      } else if (file.name.endsWith('.map') && file.name.includes('.js.map')) {
        const fileContent = await fs.readFile(filePath, 'utf8')
        try {
          JSON.parse(fileContent)
          const originalFile = filePath.replace('.map', '')
          
          try {
            await fs.access(originalFile)
            sourcemaps.push({
              mapPath: filePath,
              filePath: originalFile,
              name: path.relative(config.sourceRoot, originalFile)
            })
          } catch (err) {
          }
        } catch (err) {
          console.warn(`Invalid sourcemap JSON in ${filePath}`)
        }
      }
    }
  }

  await scan(dir)
  return sourcemaps
}

async function uploadSourcemaps(sourcemaps) {
  if (!config.apiKey) {
    console.warn('PostHog API key not found. Skipping sourcemap upload.')
    return
  }

  console.log(`Uploading ${sourcemaps.length} sourcemaps to PostHog...`)
  
  for (const sourcemap of sourcemaps) {
    try {
      const mapContent = await fs.readFile(sourcemap.mapPath, 'utf8')
      const fileContent = await fs.readFile(sourcemap.filePath, 'utf8')
      
      const url = `${config.host}/api/projects/${config.projectId}/sourcemaps/upload_source_map/`
      
      const formData = new FormData()
      formData.append('source_map', new Blob([mapContent], { type: 'application/json' }), path.basename(sourcemap.mapPath))
      formData.append('minified_file', new Blob([fileContent], { type: 'application/javascript' }), path.basename(sourcemap.filePath))
      formData.append('name', sourcemap.name)
      formData.append('version', config.version)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to upload sourcemap: ${error}`)
      }
      
      console.log(`Successfully uploaded ${sourcemap.name}`)
    } catch (error) {
      console.error(`Error uploading sourcemap ${sourcemap.name}:`, error.message)
    }
  }
}

async function main() {
  try {
    if (!shouldUploadSourcemaps) {
      console.log('Skipping sourcemap upload in non-production environment')
      return
    }
    
    console.log('Starting PostHog sourcemap upload...')
    const sourcemaps = await findSourcemaps(config.sourceRoot)
    
    if (sourcemaps.length === 0) {
      console.log('No sourcemaps found. Make sure sourcemaps are being generated.')
      return
    }
    
    await uploadSourcemaps(sourcemaps)
    console.log('Successfully completed PostHog sourcemap upload')
  } catch (error) {
    console.error('Failed to upload sourcemaps:', error)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { main, findSourcemaps, uploadSourcemaps }
