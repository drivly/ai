import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { generateZapierApps } from '../pkgs/payload-zapier-apps'

/**
 * Script to generate Zapier apps for Payload CMS collections
 * Outputs to pkgs/zapier-apis-do directory
 */
async function main() {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    const outputDir = path.resolve(__dirname, '../pkgs/zapier-apis-do')
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    console.log(`Generating Zapier apps in ${outputDir}...`)
    
    await generateZapierApps({
      outputDir
    })
    
    console.log('Zapier apps generation completed successfully!')
  } catch (error) {
    console.error('Error generating Zapier apps:', error)
    process.exit(1)
  }
}

main()
