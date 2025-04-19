import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import type { Root, Heading, List, Link, Content, Parent } from 'mdast'
import type { MarkdownJSONOptions, MarkdownJSON } from './types.js'

/**
 * Transforms a Markdown AST into a structured JSON format optimized for readability
 *
 * @param ast - The Markdown AST (Root node from mdast)
 * @param options - Configuration options for the transformation
 * @returns A structured JSON representation of the Markdown content
 */
export function transformMarkdownToJson(ast: Root, options: MarkdownJSONOptions = {}): MarkdownJSON {
  const result: MarkdownJSON = {}
  const links: Record<string, string> = {}
  let currentSection: Record<string, unknown> = result
  let currentHeader: string | null = null
  let headerCounts: Record<string, number> = {}

  visit(ast, (node) => {
    if (node.type === 'heading') {
      const headingNode = node as Heading
      const headerText = toString(headingNode).trim()
      let headerKey = headerText

      if (headerCounts[headerKey]) {
        headerCounts[headerKey]++
        headerKey = `${headerKey} (${headerCounts[headerKey]})`
      } else {
        headerCounts[headerKey] = 1
      }

      if (options.nestedHeaders && headingNode.depth > 1) {
        if (headingNode.depth === 2) {
          const h1Headers = Object.keys(result).filter((key) => !key.includes('lists') && !key.includes('links'))

          if (h1Headers.length > 0) {
            const parentHeader = h1Headers[h1Headers.length - 1]
            result[parentHeader] = result[parentHeader] || {}
            currentSection = result[parentHeader] as Record<string, unknown>
          } else {
            currentSection = result
          }
        } else {
          currentSection = result
        }
      } else {
        currentSection = result
      }

      currentSection[headerKey] = {}
      currentHeader = headerKey
    } else if (node.type === 'list') {
      const listNode = node as List
      const items = listNode.children.map((item) => toString(item).trim())

      if (currentHeader && currentSection[currentHeader]) {
        const section = currentSection[currentHeader] as Record<string, unknown>
        if (!section.lists) {
          section.lists = []
        }
        ;(section.lists as unknown[]).push(items)
      } else {
        if (!result.lists) {
          result.lists = []
        }
        ;(result.lists as unknown[]).push(items)
      }
    } else if (node.type === 'link') {
      const linkNode = node as Link
      const linkText = toString(linkNode).trim()
      links[linkText] = linkNode.url
    }
  })

  if (Object.keys(links).length > 0) {
    const addLinksToSection = (section: Record<string, unknown>) => {
      section.links = links
    }

    if (Object.keys(result).some((key) => typeof result[key] === 'object' && key !== 'links' && key !== 'lists')) {
      for (const key in result) {
        if (typeof result[key] === 'object' && key !== 'links' && key !== 'lists') {
          addLinksToSection(result[key] as Record<string, unknown>)
        }
      }
    } else {
      addLinksToSection(result)
    }
  }

  return result
}
