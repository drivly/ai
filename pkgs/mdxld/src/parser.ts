import { parse as parseYAML, stringify as stringifyYAML } from 'yaml'
import type { MDXLD, ParseOptions, SpecialProperty } from './types.js'

const SPECIAL_PROPERTIES: SpecialProperty[] = ['type', 'context', 'id', 'language', 'base', 'vocab', 'list', 'set', 'reverse']

function extractFrontmatter(mdx: string): { frontmatter: string; content: string } {
  // Check for proper frontmatter delimiters
  if (!mdx.startsWith('---\n')) {
    return { frontmatter: '', content: mdx }
  }

  // Find the closing delimiter
  const endMatch = mdx.slice(4).match(/\n---\n/)
  if (!endMatch || typeof endMatch.index !== 'number') {
    throw new Error('Failed to parse YAML frontmatter')
  }

  // Extract frontmatter and content
  const endIndex = endMatch.index
  const frontmatter = mdx.slice(4, 4 + endIndex).trim()
  const content = mdx.slice(4 + endIndex + 5)

  if (!frontmatter) {
    return { frontmatter: '', content: mdx }
  }

  return { frontmatter, content }
}

function escapeAtPrefix(yaml: string): string {
  return yaml.replace(/^@/gm, '__AT__')
}

function unescapeAtPrefix(yaml: string): string {
  return yaml.replace(/__AT__/g, '@')
}

function processFrontmatter(yaml: Record<string, unknown>, options: ParseOptions = {}): { data: Record<string, unknown> } & Record<string, unknown> {
  const data: Record<string, unknown> = {}
  const metadata: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(yaml)) {
    const quotedMatch = key.match(/^(['"])@(.+)\1$/)
    if (quotedMatch) {
      const unquotedKey = quotedMatch[2]
      if (SPECIAL_PROPERTIES.includes(unquotedKey as SpecialProperty)) {
        metadata[unquotedKey] = value
        if (unquotedKey === 'set' && Array.isArray(value)) {
          metadata[unquotedKey] = new Set(value)
        } else if (unquotedKey === 'list' && !Array.isArray(value)) {
          metadata[unquotedKey] = [value]
        }
      } else {
        data[options.allowAtPrefix ? `@${unquotedKey}` : `$${unquotedKey}`] = value
      }
      continue
    }

    if (key.startsWith('@') || key.startsWith('$')) {
      const cleanKey = key.slice(1)
      if (SPECIAL_PROPERTIES.includes(cleanKey as SpecialProperty)) {
        if (cleanKey === 'set' && Array.isArray(value)) {
          metadata[cleanKey] = new Set(value)
        } else if (cleanKey === 'list' && !Array.isArray(value)) {
          metadata[cleanKey] = [value]
        } else {
          metadata[cleanKey] = value
        }
      } else {
        const prefix = options.allowAtPrefix ? '@' : '$'
        data[`${prefix}${cleanKey}`] = value
      }
    } else {
      data[key] = value
    }
  }

  return { ...metadata, data }
}

export function parse(mdx: string, options: ParseOptions = {}): MDXLD {
  const { frontmatter, content } = extractFrontmatter(mdx)

  if (!frontmatter) {
    return {
      data: {},
      content,
    }
  }

  try {
    // Use strict mode for YAML parsing to catch invalid structures
    const yaml = parseYAML(frontmatter, {
      strict: true,
      schema: 'core',
      logLevel: 'error',
    })

    if (typeof yaml !== 'object' || yaml === null || Array.isArray(yaml) || Object.keys(yaml).length === 0) {
      throw new Error('Failed to parse YAML frontmatter')
    }

    return {
      ...processFrontmatter(yaml as Record<string, unknown>, options),
      content,
    }
  } catch (error) {
    throw new Error(`Failed to parse YAML frontmatter: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function stringify(mdxld: MDXLD, options?: { useAtPrefix?: boolean }): string {
  const { data, content, ...special } = mdxld
  const prefix = options?.useAtPrefix ? '@' : '$'

  const orderedFrontmatter: Record<string, unknown> = {}

  for (const key of SPECIAL_PROPERTIES) {
    const specialKey = key as keyof Omit<MDXLD, 'data' | 'content'>
    const value = special[specialKey]
    if (value !== undefined) {
      orderedFrontmatter[`${prefix}${key}`] = value instanceof Set ? Array.from(value) : value
    }
  }

  Object.assign(orderedFrontmatter, data)

  const escapedFrontmatter = Object.fromEntries(Object.entries(orderedFrontmatter).map(([key, value]) => [escapeAtPrefix(key), value]))

  const yamlString = unescapeAtPrefix(stringifyYAML(escapedFrontmatter))
  return `---\n${yamlString}---\n${content}`
}
