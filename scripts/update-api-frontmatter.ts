import fs from 'fs'
import path from 'path'

/**
 * Script to update the YAML frontmatter in API documentation files
 * to use the label field for titles
 */
const updateApiFrontmatter = async () => {
  try {
    console.log('Updating API documentation frontmatter...')

    const apisDir = path.resolve(process.cwd(), 'content/apis')
    if (!fs.existsSync(apisDir)) {
      console.error('APIs directory does not exist')
      process.exit(1)
    }

    const subdirs = fs
      .readdirSync(apisDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    for (const subdir of subdirs) {
      const subdirPath = path.join(apisDir, subdir)

      const files = fs.readdirSync(subdirPath).filter((file) => file.endsWith('.mdx'))

      for (const file of files) {
        const filePath = path.join(subdirPath, file)
        const content = fs.readFileSync(filePath, 'utf-8')

        const slug = path.basename(file, '.mdx')

        const label = slug
          .replace(/([A-Z])/g, ' $1')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/^./, (str) => str.toUpperCase())
          .trim()

        const updatedContent = content.replace(/---\s*\ntitle:\s*([^\n]+)/, `---\ntitle: ${label}`)

        fs.writeFileSync(filePath, updatedContent)

        console.log(`Updated frontmatter for ${subdir}/${slug}`)
      }
    }

    console.log('API documentation frontmatter update complete')
  } catch (error) {
    console.error('Error updating API documentation frontmatter:', error)
    process.exit(1)
  }
}

updateApiFrontmatter()
