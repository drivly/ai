#!/usr/bin/env tsx
/**
 * Domain Status Checker
 *
 * This script checks the status of domains from domains.config.ts by:
 * 1. Performing NS lookup for each domain
 * 2. Fetching the root path (/) for each domain
 * 3. Cross-referencing with Vercel linked domains for the drivly/ai project
 * 4. Detecting configuration drift between current and expected settings
 * 5. Updating Cloudflare and Vercel configurations when drift is detected
 *
 * Usage: pnpm tsx scripts/domain-status-checker.ts
 * Usage with update: pnpm tsx scripts/domain-status-checker.ts --update
 */

import dns from 'node:dns'
import { promisify } from 'node:util'
import { readDomainsTsv } from './domain-utils'
import type { DomainsConfig } from './domain-utils'

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
  cloudflareZoneId?: string
  configurationDrift?: {
    cloudflare?: {
      dnsRecords?: boolean
      sslSettings?: boolean
    }
    vercel?: {
      projectAssociation?: boolean
      verification?: boolean
    }
  }
}

export type { DomainStatus }
export { checkNsRecords, fetchDomainRoot, getVercelLinkedDomains, compareAndUpdateDomainConfigurations }

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
  const vercelTeamId = process.env.VERCEL_TEAM_ID || 'nathan-clevengers-projects'
  const vercelProjectId = 'ai'

  if (!vercelToken) {
    console.error('VERCEL_TOKEN environment variable is not set')
    return []
  }

  const teamParam = `teamId=${vercelTeamId}`

  try {
    const url = `https://api.vercel.com/v9/projects/${vercelProjectId}/domains?${teamParam}`
    
    console.log(`Fetching Vercel domains from: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Vercel API error (${response.status}): ${errorText}`)
      
      if (response.status === 403 && errorText.includes('scope')) {
        try {
          const errorJson = JSON.parse(errorText)
          const scopeMatch = errorJson.error?.message?.match(/scope "([^"]+)"/)
          if (scopeMatch && scopeMatch[1]) {
            const extractedScope = scopeMatch[1]
            console.log(`Extracted scope from error: ${extractedScope}`)
            
            const newTeamParam = `teamId=${extractedScope}`
            const retryUrl = `https://api.vercel.com/v9/projects/${vercelProjectId}/domains?${newTeamParam}`
            
            console.log(`Retrying with extracted scope: ${retryUrl}`)
            
            const retryResponse = await fetch(retryUrl, {
              headers: {
                Authorization: `Bearer ${vercelToken}`,
              },
            })
            
            if (!retryResponse.ok) {
              console.error(`Retry failed: ${retryResponse.status}: ${await retryResponse.text()}`)
            } else {
              const retryData = (await retryResponse.json()) as VercelDomainsResponse
              return retryData.domains.map((domain: VercelDomain) => ({
                domain: domain.name,
                status: domain.verification.status,
              }))
            }
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
        }
      }
      
      console.log('Unable to fetch Vercel domains due to authentication issues.')
      console.log('This does not mean domains are not linked in Vercel.')
      console.log('Working domains (marked as ✅ Online) are likely properly linked to Vercel.')
      return []
    }

    const data = (await response.json()) as VercelDomainsResponse
    return data.domains.map((domain: VercelDomain) => ({
      domain: domain.name,
      status: domain.verification.status,
    }))
  } catch (error: any) {
    console.error('Error fetching Vercel domains:', error.message)
    console.log('This does not mean domains are not linked in Vercel.')
    console.log('Working domains (marked as ✅ Online) are likely properly linked to Vercel.')
    return []
  }
}

interface DomainsExport {
  domains?: string[]
}

/**
 * Get the expected domain configuration from domains TSV
 * @param domain Domain to get configuration for
 * @param config DomainsConfig object from readDomainsTsv
 * @returns Expected domain configuration
 */
function getExpectedDomainConfig(domain: string, config: DomainsConfig) {
  const aliasTarget = config.aliases[domain]
  const targetDomain = aliasTarget || domain

  const domainConfig = config.domains[targetDomain]

  return {
    domain,
    targetDomain,
    isAlias: !!aliasTarget,
    aliasTarget,
    parent: domainConfig?.parent,
  }
}

/**
 * Check if Cloudflare configuration needs updating
 * @param status Current domain status
 * @param expectedConfig Expected domain configuration
 * @returns Whether Cloudflare configuration needs updating
 */
function needsCloudflareUpdate(status: DomainStatus, expectedConfig: ReturnType<typeof getExpectedDomainConfig>) {
  if (!status.nsRecords || !status.nsRecords.some((record) => record.includes('cloudflare.com'))) {
    return true
  }

  if (expectedConfig.isAlias) {
    return true // We'll check the actual records in the update function
  }

  return !!status.configurationDrift?.cloudflare
}

/**
 * Check if Vercel configuration needs updating
 * @param status Current domain status
 * @param expectedConfig Expected domain configuration
 * @returns Whether Vercel configuration needs updating
 */
function needsVercelUpdate(status: DomainStatus, expectedConfig: ReturnType<typeof getExpectedDomainConfig>) {
  if (!status.vercelLinked) {
    return true
  }

  if (status.vercelStatus !== 'valid') {
    return true
  }

  if (expectedConfig.isAlias) {
    return true // We'll check the actual configuration in the update function
  }

  return !!status.configurationDrift?.vercel
}

/**
 * Compare current domain configurations with expected configurations and update if needed
 * @param domainStatuses Domain statuses collected by the checker
 * @param updateConfigurations Whether to update configurations when drift is detected
 */
async function compareAndUpdateDomainConfigurations(domainStatuses: DomainStatus[], updateConfigurations = false) {
  console.log('\n=== Configuration Drift Analysis ===\n')

  const { domainsConfig } = await readDomainsTsv()
  const driftsDetected = []

  for (const status of domainStatuses) {
    const expectedConfig = getExpectedDomainConfig(status.domain, domainsConfig)

    const cloudflareNeedsUpdate = needsCloudflareUpdate(status, expectedConfig)
    const vercelNeedsUpdate = needsVercelUpdate(status, expectedConfig)

    if (cloudflareNeedsUpdate || vercelNeedsUpdate) {
      console.log(`Domain: ${status.domain}`)

      if (expectedConfig.isAlias) {
        console.log(`  Alias to: ${expectedConfig.aliasTarget}`)
      }

      if (cloudflareNeedsUpdate) {
        console.log('  Cloudflare configuration needs updating')
        driftsDetected.push({ domain: status.domain, service: 'cloudflare' })

        if (updateConfigurations) {
          console.log('  Updating Cloudflare configuration...')
          try {
            const { updateCloudflareZone } = await import('./domain-automation')
            await updateCloudflareZone(status.domain, status.cloudflareZoneId, expectedConfig)
            console.log('  Cloudflare configuration updated successfully')
          } catch (error: any) {
            console.error(`  Error updating Cloudflare configuration: ${error.message}`)
          }
        }
      }

      if (vercelNeedsUpdate) {
        console.log('  Vercel configuration needs updating')
        driftsDetected.push({ domain: status.domain, service: 'vercel' })

        if (updateConfigurations) {
          console.log('  Updating Vercel configuration...')
          try {
            const { updateVercelDomain } = await import('./domain-automation')
            await updateVercelDomain(status.domain, expectedConfig)
            console.log('  Vercel configuration updated successfully')
          } catch (error: any) {
            console.error(`  Error updating Vercel configuration: ${error.message}`)
          }
        }
      }

      console.log('---')
    }
  }

  if (driftsDetected.length === 0) {
    console.log('No configuration drift detected for any domains')
  } else {
    console.log(`\nConfiguration drift detected for ${driftsDetected.length} domain/service combinations`)

    if (!updateConfigurations) {
      console.log('\nTo update configurations, run:')
      console.log('pnpm tsx scripts/domain-status-checker.ts --update')
    }
  }

  return driftsDetected
}

async function checkDomains() {
  const args = process.argv.slice(2)
  const updateConfigurations = args.includes('--update')

  if (updateConfigurations) {
    console.log('Running with --update flag. Will update configurations when drift is detected.')
  }

  const { domains: domainsFromTsv, domainsConfig } = await readDomainsTsv()
  const domainsToCheck = domainsFromTsv

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

  await compareAndUpdateDomainConfigurations(domainStatuses, updateConfigurations)
}

checkDomains().catch((error) => {
  console.error('Error running domain checker:', error)
  process.exit(1)
})
