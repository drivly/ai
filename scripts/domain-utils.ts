#!/usr/bin/env tsx
/**
 * Domain Utilities
 *
 * This file contains utilities for working with domain configurations,
 * including reading from the TSV file and mapping to the existing config structure.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

export interface DomainConfig {
  /** Parent domain if this is a subdomain */
  parent?: string
  /** Description of the domain's purpose */
  description?: string
}

export interface DomainsConfig {
  /** Domain to configuration mapping */
  domains: Record<string, DomainConfig>
  /** Domain aliases (e.g., databases.do -> database.do) */
  aliases: Record<string, string>
}

/**
 * Read domains from TSV file
 *
 * TSV file format:
 * domain\tcategory\tdescription
 *
 * - domain: Domain name (e.g., functions.do)
 * - category: Parent domain if this is a subdomain (e.g., database.do)
 * - description: Description of the domain's purpose
 *
 * @returns Promise resolving to an object containing domains array and domainsConfig
 */
export async function readDomainsTsv(): Promise<{ domains: string[]; domainsConfig: DomainsConfig }> {
  const tsvPath = path.join(process.cwd(), 'sites', '.domains.tsv')

  try {
    const content = await fs.readFile(tsvPath, 'utf-8')

    const lines = content.split('\n').filter((line) => line.trim())

    const dataLines = lines.slice(1)

    const domains: string[] = []
    const domainConfigs: Record<string, DomainConfig> = {}
    const aliases: Record<string, string> = {}

    for (const line of dataLines) {
      const [domainName, category, description] = line.split('\t').map((item) => item?.trim() || '')

      if (!domainName) continue

      domains.push(domainName)

      const domainConfig: DomainConfig = {}

      if (category) {
        if (category.endsWith('.do') || category.includes('.')) {
          domainConfig.parent = category
          aliases[domainName] = category
        }
      }

      if (description) {
        domainConfig.description = description
      }

      domainConfigs[domainName] = domainConfig
    }

    return {
      domains,
      domainsConfig: {
        domains: domainConfigs,
        aliases,
      },
    }
  } catch (error) {
    console.error(`Error reading domains TSV file: ${error instanceof Error ? error.message : String(error)}`)
    return {
      domains: [],
      domainsConfig: {
        domains: {},
        aliases: {},
      },
    }
  }
}
