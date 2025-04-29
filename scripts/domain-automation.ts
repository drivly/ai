#!/usr/bin/env tsx
/**
 * Domain Automation Script
 *
 * This script automates the process of:
 * 1. Adding domains to Cloudflare for DNS management
 * 2. Adding domains to Vercel for hosting
 * 3. Updating existing domain configurations in Cloudflare and Vercel
 *
 * It uses the domain status information from domain-status-checker.ts to determine
 * which domains need to be added or updated in each service. The script will:
 * - Check if domains are already in Cloudflare and Vercel
 * - Add domains to Cloudflare if they don't exist
 * - Update existing Cloudflare zones if configuration drift is detected
 * - Create DNS records in Cloudflare pointing to Vercel
 * - Add domains to Vercel project for hosting
 * - Update existing Vercel domains if configuration drift is detected
 * - Verify domains in Vercel
 *
 * Required Environment Variables:
 * - CLOUDFLARE_API_TOKEN: API token with Zone:Edit and DNS:Edit permissions
 * - CLOUDFLARE_ACCOUNT_ID: Your Cloudflare account ID
 * - VERCEL_TOKEN: Vercel API token with domains:read and domains:write scopes
 * - VERCEL_TEAM_ID: (Optional) Your Vercel team ID if using a team account
 *
 * Usage:
 *   # Set required environment variables
 *   export CLOUDFLARE_API_TOKEN=your_token
 *   export CLOUDFLARE_ACCOUNT_ID=your_account_id
 *   export VERCEL_TOKEN=your_token
 *   export VERCEL_TEAM_ID=your_team_id  # Optional
 *
 *   # Process all domains
 *   pnpm tsx scripts/domain-automation.ts
 *
 *   # Process specific domains
 *   pnpm tsx scripts/domain-automation.ts functions.do apis.do
 *
 *   # Test without making changes (dry-run mode)
 *   pnpm tsx scripts/domain-automation.ts --dry-run
 *   # or with specific domains
 *   pnpm tsx scripts/domain-automation.ts functions.do -d
 *
 * Example Output:
 *   Found 104 domains to process
 *   Found 0 domains already linked in Vercel
 *   Found 5 zones already in Cloudflare
 *
 *   Processing domain: functions.do
 *   Domain functions.do is not in Vercel
 *   Domain functions.do is already in Cloudflare
 *   NS Records: ernest.ns.cloudflare.com, gina.ns.cloudflare.com
 *   Fetch Status: 200
 *   Adding domain functions.do to Vercel...
 *   Successfully added domain functions.do to Vercel
 *   Verifying domain functions.do on Vercel...
 *   Successfully verified domain functions.do on Vercel
 *
 * Notes:
 * - The script will continue processing domains even if some fail
 * - Domains that already exist in Cloudflare or Vercel will be skipped
 * - Authentication errors will be reported but won't stop the script
 */

import dns from 'node:dns'
import { promisify } from 'node:util'
import { readDomainsTsv } from './domain-utils'
import { checkNsRecords, fetchDomainRoot, getVercelLinkedDomains, DomainStatus } from './domain-status-checker'

const args = process.argv.slice(2)
const domainFilter = args.length > 0 ? args : null
const dryRun = args.includes('--dry-run') || args.includes('-d')

if (dryRun) {
  console.log('Running in dry-run mode. No changes will be made to Cloudflare or Vercel.')
}

if (domainFilter && !dryRun) {
  console.log(`Filtering domains to: ${domainFilter.filter((arg) => !arg.startsWith('-')).join(', ')}`)
}

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4'

const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const VERCEL_PROJECT_ID = 'ai'
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID

interface CloudflareZone {
  id: string
  name: string
  status: string
}

interface CloudflareZonesResponse {
  success: boolean
  errors: any[]
  messages: any[]
  result: CloudflareZone[]
}

interface CloudflareDNSRecord {
  id: string
  name: string
  type: string
  content: string
  ttl: number
}

interface CloudflareDNSRecordsResponse {
  success: boolean
  errors: any[]
  messages: any[]
  result: CloudflareDNSRecord[]
}

interface CloudflareZoneSettings {
  success: boolean
  errors: any[]
  messages: any[]
  result: CloudflareZoneSetting[]
}

interface CloudflareZoneSetting {
  id: string
  value: any
  modified_on: string
}

interface VercelDomainConfig {
  name: string
  apexName?: string
  projectId?: string
  redirect?: string | null
  redirectStatusCode?: number
  gitBranch?: string
}

/**
 * Update Cloudflare zone settings based on expected configuration
 * @param domain Domain to update
 * @param zoneId Cloudflare zone ID
 * @param config Expected domain configuration
 * @returns True if successful
 */
export async function updateCloudflareZone(domain: string, zoneId?: string, config?: any): Promise<boolean> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN environment variable is not set')
    return false
  }

  try {
    if (!zoneId) {
      const zones = await getCloudflareZones()
      const zone = zones.find((z) => z.name === domain)
      if (!zone) {
        console.error(`No Cloudflare zone found for domain ${domain}`)
        return false
      }
      zoneId = zone.id
    }

    const isAlias = config?.isAlias
    const targetDomain = config?.targetDomain || domain

    if (isAlias) {
      console.log(`Setting up redirect from ${domain} to ${targetDomain}`)

      const response = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/pagerules`, {
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Cloudflare API returned ${response.status}: ${await response.text()}`)
      }

      const data = await response.json()
      const existingRule = data.result.find(
        (rule: any) => rule.targets[0]?.constraint?.value === `*${domain}/*` && rule.actions.find((action: any) => action.id === 'forwarding_url'),
      )

      if (existingRule) {
        const updateResponse = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/pagerules/${existingRule.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targets: [
              {
                target: 'url',
                constraint: {
                  operator: 'matches',
                  value: `*${domain}/*`,
                },
              },
            ],
            actions: [
              {
                id: 'forwarding_url',
                value: {
                  url: `https://${targetDomain}`,
                  status_code: 301,
                },
              },
            ],
            status: 'active',
          }),
        })

        if (!updateResponse.ok) {
          throw new Error(`Cloudflare API returned ${updateResponse.status}: ${await updateResponse.text()}`)
        }
      } else {
        const createResponse = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/pagerules`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targets: [
              {
                target: 'url',
                constraint: {
                  operator: 'matches',
                  value: `*${domain}/*`,
                },
              },
            ],
            actions: [
              {
                id: 'forwarding_url',
                value: {
                  url: `https://${targetDomain}`,
                  status_code: 301,
                },
              },
            ],
            status: 'active',
          }),
        })

        if (!createResponse.ok) {
          throw new Error(`Cloudflare API returned ${createResponse.status}: ${await createResponse.text()}`)
        }
      }
    } else {
      const sslResponse = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/settings/ssl`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: 'full',
        }),
      })

      if (!sslResponse.ok) {
        throw new Error(`Cloudflare API returned ${sslResponse.status}: ${await sslResponse.text()}`)
      }

      await addCloudflareVercelDNSRecords(zoneId, domain)
    }

    return true
  } catch (error: any) {
    console.error(`Error updating Cloudflare zone for ${domain}:`, error.message)
    return false
  }
}

/**
 * Update Vercel domain settings based on expected configuration
 * @param domain Domain to update
 * @param config Expected domain configuration
 * @returns True if successful
 */
export async function updateVercelDomain(domain: string, config?: any): Promise<boolean> {
  if (!VERCEL_TOKEN) {
    console.error('VERCEL_TOKEN environment variable is not set')
    return false
  }

  const teamParam = VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : ''

  try {
    const isAlias = config?.isAlias
    const targetDomain = config?.targetDomain || domain

    const getDomainResponse = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?${teamParam}`, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!getDomainResponse.ok) {
      return await addDomainToVercel(domain)
    }

    const domainData = await getDomainResponse.json()

    const updatePayload: VercelDomainConfig = {
      name: domain,
    }

    if (isAlias) {
      updatePayload.redirect = `https://${targetDomain}`
      updatePayload.redirectStatusCode = 301
    }

    const updateResponse = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}?${teamParam}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    })

    if (!updateResponse.ok) {
      throw new Error(`Vercel API returned ${updateResponse.status}: ${await updateResponse.text()}`)
    }

    if (domainData.verification?.status !== 'valid') {
      await verifyDomainOnVercel(domain)
    }

    return true
  } catch (error: any) {
    console.error(`Error updating Vercel domain ${domain}:`, error.message)
    return false
  }
}

/**
 * Get Cloudflare zones
 * @returns List of Cloudflare zones
 */
async function getCloudflareZones(): Promise<CloudflareZone[]> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN environment variable is not set')
    return []
  }

  try {
    const response = await fetch(`${CLOUDFLARE_API_BASE}/zones?account.id=${CLOUDFLARE_ACCOUNT_ID}`, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Cloudflare API returned ${response.status}: ${await response.text()}`)
    }

    const data = (await response.json()) as CloudflareZonesResponse
    return data.result
  } catch (error: any) {
    console.error('Error fetching Cloudflare zones:', error.message)
    return []
  }
}

/**
 * Create a Cloudflare zone for a domain
 * @param domain Domain to create zone for
 * @returns Created zone or null if failed
 */
async function createCloudflareZone(domain: string): Promise<CloudflareZone | null> {
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
    console.error('CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID environment variable is not set')
    return null
  }

  try {
    const response = await fetch(`${CLOUDFLARE_API_BASE}/zones`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain,
        account: {
          id: CLOUDFLARE_ACCOUNT_ID,
        },
        jump_start: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Cloudflare API returned ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    return data.result
  } catch (error: any) {
    console.error(`Error creating Cloudflare zone for ${domain}:`, error.message)
    return null
  }
}

/**
 * Add DNS records to Cloudflare zone
 * @param zoneId Cloudflare zone ID
 * @param domain Domain to add records for
 * @returns True if successful
 */
async function addCloudflareVercelDNSRecords(zoneId: string, domain: string): Promise<boolean> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN environment variable is not set')
    return false
  }

  try {
    const response = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/dns_records`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'A',
        name: domain,
        content: '76.76.21.21', // Vercel's IP
        ttl: 1, // Auto
        proxied: false, // No Cloudflare proxy
      }),
    })

    if (!response.ok) {
      throw new Error(`Cloudflare API returned ${response.status}: ${await response.text()}`)
    }

    return true
  } catch (error: any) {
    console.error(`Error adding Cloudflare DNS records for ${domain}:`, error.message)
    return false
  }
}
/**
 * Enable email routing for a Cloudflare zone
 * @param zoneId Cloudflare zone ID
 * @param domain Domain to enable email routing for
 * @returns True if successful
 */
async function enableCloudflareEmailRouting(zoneId: string, domain: string): Promise<boolean> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN environment variable is not set')
    return false
  }

  try {
    const enableResponse = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/email/routing/enable`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!enableResponse.ok) {
      throw new Error(`Failed to enable email routing: ${enableResponse.status}: ${await enableResponse.text()}`)
    }

    const ruleResponse = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/email/routing/rules`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchers: [
          {
            type: 'all',
          },
        ],
        actions: [
          {
            type: 'worker',
            value: ['emails-do'], // Route to emails-do worker
          },
        ],
        enabled: true,
        name: 'Catch-all to emails-do worker',
        priority: 0,
      }),
    })

    if (!ruleResponse.ok) {
      throw new Error(`Failed to create email routing rule: ${ruleResponse.status}: ${await ruleResponse.text()}`)
    }

    return true
  } catch (error: any) {
    console.error(`Error enabling email routing for ${domain}:`, error.message)
    return false
  }
}

/**
 * Update existing email routing rules to use worker instead of email forwarding
 * @param zoneId Cloudflare zone ID
 * @param domain Domain to update email routing for
 * @returns True if successful
 */
async function updateEmailRoutingToWorker(zoneId: string, domain: string): Promise<boolean> {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN environment variable is not set')
    return false
  }

  try {
    const rulesResponse = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/email/routing/rules`, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!rulesResponse.ok) {
      throw new Error(`Failed to get email routing rules: ${rulesResponse.status}: ${await rulesResponse.text()}`)
    }

    const rulesData = await rulesResponse.json()
    const rules = rulesData.result || []

    const rulesToUpdate = rules.filter((rule: any) => {
      return rule.actions.some((action: any) => action.type === 'forward' && action.value.includes('emails-do@drivly.com'))
    })

    if (rulesToUpdate.length === 0) {
      console.log(`No email forwarding rules found for ${domain}`)
      return true
    }

    for (const rule of rulesToUpdate) {
      const updateResponse = await fetch(`${CLOUDFLARE_API_BASE}/zones/${zoneId}/email/routing/rules/${rule.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...rule,
          actions: [
            {
              type: 'worker',
              value: ['emails-do'], // Route to emails-do worker
            },
          ],
        }),
      })

      if (!updateResponse.ok) {
        throw new Error(`Failed to update email routing rule: ${updateResponse.status}: ${await updateResponse.text()}`)
      }

      console.log(`Updated email routing rule for ${domain} to use worker`)
    }

    return true
  } catch (error: any) {
    console.error(`Error updating email routing for ${domain}:`, error.message)
    return false
  }
}

/**
 * Add domain to Vercel project
 * @param domain Domain to add to Vercel
 * @returns True if successful
 */
async function addDomainToVercel(domain: string): Promise<boolean> {
  if (!VERCEL_TOKEN) {
    console.error('VERCEL_TOKEN environment variable is not set')
    return false
  }

  const teamParam = VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : ''

  try {
    const response = await fetch(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains?${teamParam}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      if (errorText.includes('already exists')) {
        console.log(`Domain ${domain} is already added to Vercel project`)
        return true
      }
      throw new Error(`Vercel API returned ${response.status}: ${errorText}`)
    }

    return true
  } catch (error: any) {
    console.error(`Error adding domain ${domain} to Vercel:`, error.message)
    return false
  }
}

/**
 * Verify domain on Vercel
 * @param domain Domain to verify
 * @returns True if successful
 */
async function verifyDomainOnVercel(domain: string): Promise<boolean> {
  if (!VERCEL_TOKEN) {
    console.error('VERCEL_TOKEN environment variable is not set')
    return false
  }

  const teamParam = VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : ''

  try {
    const response = await fetch(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify?${teamParam}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Vercel API returned ${response.status}: ${await response.text()}`)
    }

    return true
  } catch (error: any) {
    console.error(`Error verifying domain ${domain} on Vercel:`, error.message)
    return false
  }
}

/**
 * Main function to automate domain setup
 */
async function automateDomainsSetup() {
  const { domains: domainsFromTsv, domainsConfig } = await readDomainsTsv()

  const domainsToProcess = domainFilter ? domainsFromTsv.filter((domain) => domainFilter.some((filter) => !filter.startsWith('-') && domain.includes(filter))) : domainsFromTsv

  console.log(`Found ${domainsToProcess.length} domains to process out of ${domainsFromTsv.length} total domains`)

  const vercelDomains = await getVercelLinkedDomains()
  console.log(`Found ${vercelDomains.length} domains already linked in Vercel`)

  const cloudflareZones = await getCloudflareZones()
  console.log(`Found ${cloudflareZones.length} zones already in Cloudflare`)

  for (const domain of domainsToProcess) {
    console.log(`\nProcessing domain: ${domain}`)

    const isInVercel = vercelDomains.some((d) => d.domain === domain)
    console.log(`Domain ${domain} is ${isInVercel ? 'already' : 'not'} in Vercel`)

    const cloudflareZone = cloudflareZones.find((z) => z.name === domain)
    console.log(`Domain ${domain} is ${cloudflareZone ? 'already' : 'not'} in Cloudflare`)

    const nsRecords = await checkNsRecords(domain)
    console.log(`NS Records: ${nsRecords ? nsRecords.join(', ') : 'None found'}`)

    const fetchStatus = await fetchDomainRoot(domain)
    console.log(`Fetch Status: ${fetchStatus.status || 'Failed'} ${fetchStatus.error ? `(${fetchStatus.error})` : ''}`)

    if (!cloudflareZone) {
      console.log(`Adding domain ${domain} to Cloudflare...`)

      if (dryRun) {
        console.log(`[DRY RUN] Would create Cloudflare zone for ${domain}`)
      } else {
        const newZone = await createCloudflareZone(domain)

        if (newZone) {
          console.log(`Successfully added domain ${domain} to Cloudflare with zone ID ${newZone.id}`)

          console.log(`Adding Vercel DNS records for ${domain}...`)
          const dnsAdded = await addCloudflareVercelDNSRecords(newZone.id, domain)

          if (dnsAdded) {
            console.log(`Successfully added Vercel DNS records for ${domain}`)

            console.log(`Enabling email routing for ${domain}...`)
            const emailRoutingEnabled = await enableCloudflareEmailRouting(newZone.id, domain)

            if (emailRoutingEnabled) {
              console.log(`Successfully enabled email routing for ${domain}`)
            } else {
              console.error(`Failed to enable email routing for ${domain}`)
            }
          } else {
            console.error(`Failed to add Vercel DNS records for ${domain}`)
          }
        } else {
          console.error(`Failed to add domain ${domain} to Cloudflare`)
        }
      }
    } else {
      console.log(`Checking email routing for existing domain ${domain}...`)

      if (dryRun) {
        console.log(`[DRY RUN] Would check and update email routing for ${domain}`)
      } else {
        const emailRoutingUpdated = await updateEmailRoutingToWorker(cloudflareZone.id, domain)

        if (emailRoutingUpdated) {
          console.log(`Successfully updated email routing for ${domain}`)
        } else {
          console.error(`Failed to update email routing for ${domain}`)
        }
      }
    }

    if (!isInVercel) {
      console.log(`Adding domain ${domain} to Vercel...`)

      if (dryRun) {
        console.log(`[DRY RUN] Would add domain ${domain} to Vercel project`)
        console.log(`[DRY RUN] Would verify domain ${domain} on Vercel`)
      } else {
        const added = await addDomainToVercel(domain)

        if (added) {
          console.log(`Successfully added domain ${domain} to Vercel`)

          console.log(`Verifying domain ${domain} on Vercel...`)
          const verified = await verifyDomainOnVercel(domain)

          if (verified) {
            console.log(`Successfully verified domain ${domain} on Vercel`)
          } else {
            console.error(`Failed to verify domain ${domain} on Vercel`)
          }
        } else {
          console.error(`Failed to add domain ${domain} to Vercel`)
        }
      }
    }
  }

  console.log('\n=== Domain Automation Summary ===\n')
  console.log(`Total domains processed: ${domainsFromTsv.length}`)
  console.log(`Domains already in Vercel: ${vercelDomains.length}`)
  console.log(`Domains already in Cloudflare: ${cloudflareZones.length}`)
}

automateDomainsSetup().catch((error) => {
  console.error('Error running domain automation:', error)
  process.exit(1)
})
