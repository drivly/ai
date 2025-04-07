import fs from 'fs'
import path from 'path'

/**
 * Interface for API documentation item
 */
interface ApiDoc {
  title: string
  slug: string
}

/**
 * Script to update the API documentation index file
 * Organizes API documentation links by Admin group
 */
const updateApiDocsIndex = async () => {
  try {
    console.log('Updating API documentation index...')

    const apisDir = path.resolve(process.cwd(), 'content/apis')
    if (!fs.existsSync(apisDir)) {
      console.error('APIs directory does not exist')
      process.exit(1)
    }

    const files = fs.readdirSync(apisDir).filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')

    const apisByGroup: Record<string, ApiDoc[]> = {}

    for (const file of files) {
      const filePath = path.join(apisDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const titleMatch = content.match(/title:\s*([^\n]+)/)
      const groupMatch = content.match(/group:\s*([^\n]+)/)

      const title = titleMatch ? titleMatch[1].trim() : path.basename(file, '.mdx')
      const group = groupMatch ? groupMatch[1].trim() : 'Uncategorized'

      if (!apisByGroup[group]) {
        apisByGroup[group] = []
      }

      apisByGroup[group].push({
        title,
        slug: path.basename(file, '.mdx'),
      })
    }

    const sortedGroups = Object.keys(apisByGroup).sort()

    let indexContent = `---
title: API Reference
sidebarTitle: APIs
asIndexPage: true
---

# API Reference

This section contains API documentation for all collections in the system, organized by category.

`

    for (const group of sortedGroups) {
      indexContent += `## ${group}\n\n`

      const sortedApis = apisByGroup[group].sort((a, b) => a.title.localeCompare(b.title))

      for (const api of sortedApis) {
        indexContent += `- [${api.title}](/${api.slug})\n`
      }

      indexContent += '\n'
    }

    const indexPath = path.join(apisDir, 'index.mdx')
    fs.writeFileSync(indexPath, indexContent)

    console.log('API documentation index updated successfully')
  } catch (error) {
    console.error('Error updating API documentation index:', error)
    process.exit(1)
  }
}

updateApiDocsIndex()
