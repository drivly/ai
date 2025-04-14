import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { createReadStream } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const shouldUploadSourcemaps = process.env.NODE_ENV === 'production'

if (process.env.NODE_OPTIONS?.includes('--max-old-space-size=')) {
  console.log('Using custom memory limit from NODE_OPTIONS')
} else {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`
  console.log('Setting Node.js memory limit to 4GB')
}

const config = {
  apiKey: process.env.POSTHOG_API_KEY,
  host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  sourceRoot: path.resolve(projectRoot, '.next'),
  projectId: 'ai', // Project name in PostHog
  version: process.env.APP_VERSION || new Date().toISOString(), // Use app version or timestamp
  concurrentUploads: 5,
  maxSourcemapSize: 10 * 1024 * 1024, // 10MB
}

/**
 * Check if a file exists and get its size
 */
async function getFileInfo(filePath) {
  try {
    const stats = await fs.stat(filePath)
    return { exists: true, size: stats.size }
  } catch (err) {
    return { exists: false, size: 0 }
  }
}

/**
 * Find all sourcemap files recursively in the .next directory
 * This version doesn't load the entire file content into memory
 */
async function findSourcemaps(dir) {
  const sourcemaps = []
  let skippedCount = 0

  async function scan(directory) {
    const files = await fs.readdir(directory, { withFileTypes: true })
    
    for (const file of files) {
      const filePath = path.join(directory, file.name)
      
      if (file.isDirectory()) {
        await scan(filePath)
      } else if (file.name.endsWith('.map') && file.name.includes('.js.map')) {
        const originalFile = filePath.replace('.map', '')
        const mapInfo = await getFileInfo(filePath)
        const fileInfo = await getFileInfo(originalFile)
        
        if (mapInfo.exists && fileInfo.exists) {
          if (mapInfo.size > config.maxSourcemapSize) {
            console.warn(`Skipping large sourcemap (${Math.round(mapInfo.size / 1024 / 1024)}MB): ${filePath}`)
            skippedCount++
            continue
          }
          
          sourcemaps.push({
            mapPath: filePath,
            filePath: originalFile,
            name: path.relative(config.sourceRoot, originalFile),
            mapSize: mapInfo.size,
            fileSize: fileInfo.size
          })
        }
      }
    }
  }

  await scan(dir)
  if (skippedCount > 0) {
    console.warn(`Skipped ${skippedCount} large sourcemaps to avoid memory issues`)
  }
  return sourcemaps
}

/**
 * Process sourcemaps in batches to avoid memory issues
 */
async function uploadSourcemaps(sourcemaps) {
  if (!config.apiKey) {
    console.warn('PostHog API key not found. Skipping sourcemap upload.')
    return
  }

  console.log(`Uploading ${sourcemaps.length} sourcemaps to PostHog...`)
  
  const batches = []
  for (let i = 0; i < sourcemaps.length; i += config.concurrentUploads) {
    batches.push(sourcemaps.slice(i, i + config.concurrentUploads))
  }
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} sourcemaps)`)
    
    const results = await Promise.allSettled(
      batch.map(sourcemap => uploadSingleSourcemap(sourcemap))
    )
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        successCount++
      } else {
        errorCount++
        console.error(`Error uploading sourcemap: ${result.reason}`)
      }
    })
    
    if (global.gc) {
      global.gc()
    }
  }
  
  console.log(`Sourcemap upload complete: ${successCount} succeeded, ${errorCount} failed`)
}

/**
 * Upload a single sourcemap to PostHog
 * This version uses streams to avoid loading large files into memory
 */
async function uploadSingleSourcemap(sourcemap) {
  const url = `${config.host}/api/projects/${config.projectId}/sourcemaps/upload_source_map/`
  
  const formData = new FormData()
  
  const mapStream = createReadStream(sourcemap.mapPath)
  const fileStream = createReadStream(sourcemap.filePath)
  
  formData.append('source_map', new Blob([await streamToBuffer(mapStream)], { type: 'application/json' }), path.basename(sourcemap.mapPath))
  formData.append('minified_file', new Blob([await streamToBuffer(fileStream)], { type: 'application/javascript' }), path.basename(sourcemap.filePath))
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
    throw new Error(`Failed to upload sourcemap ${sourcemap.name}: ${error}`)
  }
  
  console.log(`Successfully uploaded ${sourcemap.name}`)
  return sourcemap.name
}

/**
 * Convert a readable stream to a buffer
 */
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

/**
 * Main execution
 */
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
