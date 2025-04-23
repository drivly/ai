import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { generateZapierApps } from '../pkgs/payload-zapier-apps/dist'

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

      const packageJson = {
        name: 'zapier-apis-do',
        version: '0.1.0',
        description: 'Zapier integration APIs for Payload CMS collections',
        private: true,
        scripts: {
          build: "echo 'No build step required'",
        },
      }

      fs.writeFileSync(path.resolve(outputDir, 'package.json'), JSON.stringify(packageJson, null, 2))

      const readmeContent = `# Zapier APIs

Generated Zapier integration APIs for Payload CMS collections.

This package is automatically generated using the \`payload-zapier-apps\` package.

To regenerate the APIs, run:

\`\`\`bash
pnpm run generate-zapier-apps
\`\`\`
`
      fs.writeFileSync(path.resolve(outputDir, 'README.md'), readmeContent)
    }

    console.log(`Generating Zapier apps in ${outputDir}...`)

    await generateZapierApps({
      outputDir,
    })

    console.log('Zapier apps generation completed successfully!')
  } catch (error) {
    console.error('Error generating Zapier apps:', error)
    process.exit(1)
  }
}

main()
