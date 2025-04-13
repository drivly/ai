#!/usr/bin/env tsx
/**
 * Domain Status Checker
 *
 * This script checks the status of domains from domains.config.ts by:
 * 1. Performing NS lookup for each domain
 * 2. Fetching the root path (/) for each domain
 * 3. Cross-referencing with Vercel linked domains for the drivly/ai project
 *
 * Usage: pnpm tsx scripts/domain-status-checker.ts
 */

import dns from 'node:dns'
import { promisify } from 'node:util'
import { domainsConfig, DomainsConfig, domains } from '../config/domains.config'

const resolveNs = promisify(dns.resolveNs)

interface DomainStatus {
  domain: string
  nsRecords: string[] | null
  fetchStatus: {
    status: number | null
    error?: string
  }
  vercelLinked: boolean
  vercelStatus?: string
}

export type { DomainStatus }
export { checkNsRecords, fetchDomainRoot, getVercelLinkedDomains }

async function checkNsRecords(domain: string): Promise<string[] | null> {
  try {
    const nsRecords = await resolveNs(domain)
    return nsRecords
  } catch (error: any) {
    console.error(`Error resolving NS records for ${domain}:`, error.message)
    return null
  }
}

async function fetchDomainRoot(domain: string): Promise<{ status: number | null; error?: string }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 seconds timeout

    const response = await fetch(`https://${domain}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Domain-Status-Checker/1.0',
      },
      redirect: 'follow',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return { status: response.status }
  } catch (error: any) {
    return {
      status: null,
      error: error.message,
    }
  }
}

interface VercelDomain {
  name: string
  verification: {
    status: string
  }
}

interface VercelDomainsResponse {
  domains: VercelDomain[]
}

async function getVercelLinkedDomains(): Promise<{ domain: string; status: string }[]> {
  const vercelToken = process.env.VERCEL_TOKEN

  if (!vercelToken) {
    console.error('VERCEL_TOKEN environment variable is not set')
    return []
  }

  try {
    const response = await fetch('https://api.vercel.com/v9/projects/ai/domains', {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Vercel API returned ${response.status}: ${await response.text()}`)
    }

    const data = (await response.json()) as VercelDomainsResponse
    return data.domains.map((domain: VercelDomain) => ({
      domain: domain.name,
      status: domain.verification.status,
    }))
  } catch (error: any) {
    console.error('Error fetching Vercel domains:', error.message)
    return []
  }
}

interface DomainsExport {
  domains?: string[]
}

async function checkDomains() {
  const domainsToCheck = domains

  console.log(`Found ${domainsToCheck.length} domains to check`)

  const vercelDomains = await getVercelLinkedDomains()
  console.log(`Found ${vercelDomains.length} domains linked in Vercel`)

  const domainStatuses: DomainStatus[] = []

  for (const domain of domainsToCheck) {
    console.log(`Checking domain: ${domain}`)

    const nsRecords = await checkNsRecords(domain)

    const fetchStatus = await fetchDomainRoot(domain)

    const vercelDomain = vercelDomains.find((d) => d.domain === domain)

    domainStatuses.push({
      domain,
      nsRecords,
      fetchStatus,
      vercelLinked: !!vercelDomain,
      vercelStatus: vercelDomain?.status,
    })
  }

  console.log('\n=== Domain Status Report ===\n')

  for (const status of domainStatuses) {
    console.log(`Domain: ${status.domain}`)
    console.log(`NS Records: ${status.nsRecords ? status.nsRecords.join(', ') : 'None found'}`)
    console.log(`Fetch Status: ${status.fetchStatus.status || 'Failed'} ${status.fetchStatus.error ? `(${status.fetchStatus.error})` : ''}`)
    console.log(`Vercel Linked: ${status.vercelLinked ? 'Yes' : 'No'}`)
    if (status.vercelLinked) {
      console.log(`Vercel Status: ${status.vercelStatus}`)
    }
    console.log('---')
  }

  console.log('\n=== Cross-Reference Report ===\n')

  const domainsNotInVercel = domainsToCheck.filter((domain) => !vercelDomains.some((vd) => vd.domain === domain))

  if (domainsNotInVercel.length > 0) {
    console.log('Domains in config but not linked in Vercel:')
    domainsNotInVercel.forEach((domain) => console.log(`- ${domain}`))
  } else {
    console.log('All domains in config are linked in Vercel')
  }

  console.log('')

  const domainsNotInConfig = vercelDomains.filter((vd) => !domainsToCheck.includes(vd.domain)).map((vd) => vd.domain)

  if (domainsNotInConfig.length > 0) {
    console.log('Domains linked in Vercel but not in config:')
    domainsNotInConfig.forEach((domain) => console.log(`- ${domain}`))
  } else {
    console.log('All Vercel linked domains are in config')
  }
}

checkDomains().catch((error) => {
  console.error('Error running domain checker:', error)
  process.exit(1)
})
