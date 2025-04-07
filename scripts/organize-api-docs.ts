import fs from 'fs'
import path from 'path'

/**
 * Interface for API documentation item
 */
interface ApiDoc {
  title: string
  slug: string
  group: string
  label?: string
}

/**
 * Script to organize API documentation into subfolders by admin group
 * and update frontmatter to use label for title
 */
const organizeApiDocs = async () => {
  try {
    console.log('Organizing API documentation into subfolders by admin group...')

    const apisDir = path.resolve(process.cwd(), 'content/apis/apis')
    if (!fs.existsSync(apisDir)) {
      console.error('APIs directory does not exist')
      process.exit(1)
    }

    const files = fs.readdirSync(apisDir).filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')

    const apisByGroup: Record<string, ApiDoc[]> = {}
    const fileContents: Record<string, string> = {}

    for (const file of files) {
      const filePath = path.join(apisDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const titleMatch = content.match(/title:\s*([^\n]+)/)
      const labelMatch = content.match(/label:\s*([^\n]+)/)
      const groupMatch = content.match(/group:\s*([^\n]+)/)

      const slug = path.basename(file, '.mdx')
      const title = titleMatch ? titleMatch[1].trim() : slug
      const label = labelMatch ? labelMatch[1].trim() : title
      const group = groupMatch ? groupMatch[1].trim() : 'Uncategorized'

      if (!apisByGroup[group]) {
        apisByGroup[group] = []
      }

      apisByGroup[group].push({
        title,
        slug,
        group,
        label,
      })

      fileContents[slug] = content
    }

    for (const group of Object.keys(apisByGroup)) {
      const groupDir = path.join(apisDir, group.toLowerCase().replace(/\s+/g, '-'))

      if (!fs.existsSync(groupDir)) {
        fs.mkdirSync(groupDir, { recursive: true })
      }

      for (const api of apisByGroup[group]) {
        const oldPath = path.join(apisDir, `${api.slug}.mdx`)
        const newPath = path.join(groupDir, `${api.slug}.mdx`)

        let content = fileContents[api.slug]

        if (api.label && api.label !== api.title) {
          content = content.replace(/title:\s*([^\n]+)/, `title: ${api.label}`)
        }

        fs.writeFileSync(newPath, content)

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }

        console.log(`Moved ${api.slug} to ${group} group directory`)
      }
    }

    updateIndexFile(apisDir, apisByGroup)

    console.log('API documentation organization complete')
  } catch (error) {
    console.error('Error organizing API documentation:', error)
    process.exit(1)
  }
}

/**
 * Updates the index.mdx file with links to files in group directories
 */
const updateIndexFile = (apisDir: string, apisByGroup: Record<string, ApiDoc[]>) => {
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
      const groupPath = group.toLowerCase().replace(/\s+/g, '-')
      indexContent += `- [${api.title}](/docs/apis/${groupPath}/${api.slug})\n`
    }

    indexContent += '\n'
  }

  const indexPath = path.join(apisDir, 'index.mdx')
  fs.writeFileSync(indexPath, indexContent)

  console.log('Updated index.mdx with links to organized API documentation')
}

organizeApiDocs()
