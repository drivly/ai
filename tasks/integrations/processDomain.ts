import type { Payload } from 'payload'

type ProcessDomainInput = {
  domainId: string
  operation: 'create' | 'update' | 'delete'
  domain?: string
  vercelId?: string
  cloudflareId?: string
  updateConfig?: boolean
}

type Domain = {
  id: string
  name: string
  domain: string
  project: string | { id: string }
  status: 'pending' | 'active' | 'error'
  hostnames: Array<{ hostname: string }>
  vercelId?: string
  cloudflareId?: string
  errorMessage?: string
}

type Project = {
  id: string
  name: string
  domain?: string
  domains?: Array<{ id: string }>
}

/**
 * Process a domain change by integrating with Cloudflare for SaaS and Vercel
 */
export const processDomain = async (args: {
  payload: Payload
  job: {
    payload: ProcessDomainInput
  }
}) => {
  const { payload } = args
  const { domainId, operation, domain, vercelId, cloudflareId, updateConfig } = args.job.payload

  try {
    if (operation === 'delete') {
      if (vercelId) {
        await removeVercelDomain(vercelId)
      }

      if (cloudflareId) {
        await removeCloudflareCustomHostname(cloudflareId)
      }

      return
    }

    const domainDoc = (await payload.findByID({
      collection: 'domains' as any,
      id: domainId,
    })) as unknown as Domain

    if (!domainDoc) {
      throw new Error(`Domain with ID ${domainId} not found`)
    }

    const project = (await payload.findByID({
      collection: 'projects' as any,
      id: typeof domainDoc.project === 'string' ? domainDoc.project : domainDoc.project.id,
    })) as unknown as Project

    if (!project) {
      throw new Error(`Project not found for domain ${domainDoc.domain}`)
    }

    let vercelDomainInfo
    let cloudflareDomainInfo

    if (operation === 'update' && updateConfig) {
      vercelDomainInfo = await updateVercelDomain(domainDoc.domain, project.name, domainDoc.vercelId)
      cloudflareDomainInfo = await updateCloudflareCustomHostname(domainDoc.domain, project.name, domainDoc.cloudflareId)
    } else {
      vercelDomainInfo = await addVercelDomain(domainDoc.domain, project.name)
      cloudflareDomainInfo = await addCloudflareCustomHostname(domainDoc.domain, project.name)
    }

    await payload.update({
      collection: 'domains' as any,
      id: domainId,
      data: {
        status: vercelDomainInfo.status === 'active' && cloudflareDomainInfo.status === 'active' ? 'active' : 'pending',
        vercelId: vercelDomainInfo.id,
        cloudflareId: cloudflareDomainInfo.id,
        hostnames: [{ hostname: vercelDomainInfo.hostname }, ...cloudflareDomainInfo.hostnames.map((h) => ({ hostname: h }))],
        errorMessage:
          vercelDomainInfo.error || cloudflareDomainInfo.error ? `Vercel: ${vercelDomainInfo.error || 'OK'}, Cloudflare: ${cloudflareDomainInfo.error || 'OK'}` : undefined,
      },
    })
  } catch (error: unknown) {
    console.error(`Error processing domain ${domain || domainId}:`, error)

    if (operation !== 'delete') {
      await payload.update({
        collection: 'domains' as any,
        id: domainId,
        data: {
          status: 'error',
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      })
    }
  }
}

/**
 * Update an existing Vercel domain
 */
async function updateVercelDomain(domain: string, projectName: string, existingDomainId?: string) {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    if (!vercelToken) {
      throw new Error('VERCEL_TOKEN environment variable not set')
    }

    if (!existingDomainId) {
      return await addVercelDomain(domain, projectName)
    }

    const { domainsConfig } = await import('@/domains.config')
    const isAlias = !!domainsConfig.aliases[domain]
    const targetDomain = domainsConfig.aliases[domain] || domain

    const updatePayload: any = {
      name: domain,
    }

    if (isAlias) {
      updatePayload.redirect = `https://${targetDomain}`
      updatePayload.redirectStatusCode = 301
    }

    const response = await fetch(`https://api.vercel.com/v9/projects/${projectName}/domains/${domain}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 404) {
        return await addVercelDomain(domain, projectName)
      }
      throw new Error(data.error?.message || 'Unknown error from Vercel API')
    }

    return {
      id: data.id || existingDomainId,
      status: data.verification?.status || 'pending',
      hostname: data.name,
      error: null,
    }
  } catch (error: unknown) {
    console.error('Vercel API error during domain update:', error)
    return { id: existingDomainId, status: 'error', hostname: domain, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Add a domain to Vercel project
 */
async function addVercelDomain(domain: string, projectName: string) {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    if (!vercelToken) {
      throw new Error('VERCEL_TOKEN environment variable not set')
    }

    const response = await fetch(`https://api.vercel.com/v9/projects/${projectName}/domains`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Unknown error from Vercel API')
    }

    return {
      id: data.id,
      status: data.verification?.status || 'pending',
      hostname: data.name,
      error: null,
    }
  } catch (error: unknown) {
    console.error('Vercel API error:', error)
    return { id: null, status: 'error', hostname: domain, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Remove a domain from Vercel project
 */
async function removeVercelDomain(domainId: string) {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    if (!vercelToken) {
      throw new Error('VERCEL_TOKEN environment variable not set')
    }

    const response = await fetch(`https://api.vercel.com/v9/domains/${domainId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error?.message || 'Unknown error from Vercel API')
    }

    return true
  } catch (error: unknown) {
    console.error('Vercel API error during domain removal:', error)
    throw error
  }
}

/**
 * Update an existing Cloudflare custom hostname
 */
async function updateCloudflareCustomHostname(domain: string, projectName: string, existingHostnameId?: string) {
  try {
    const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN
    const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID

    if (!cloudflareToken || !cloudflareZoneId) {
      throw new Error('Cloudflare credentials not set in environment variables')
    }

    if (!existingHostnameId) {
      return await addCloudflareCustomHostname(domain, projectName)
    }

    const { domainsConfig } = await import('@/domains.config')
    const isAlias = !!domainsConfig.aliases[domain]
    const targetDomain = domainsConfig.aliases[domain] || domain

    if (isAlias) {
      const rulesResponse = await fetch(`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/pagerules`, {
        headers: {
          Authorization: `Bearer ${cloudflareToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!rulesResponse.ok) {
        throw new Error(`Cloudflare API returned ${rulesResponse.status}: ${await rulesResponse.text()}`)
      }

      const rulesData = await rulesResponse.json()
      const existingRule = rulesData.result.find(
        (rule: any) => rule.targets[0]?.constraint?.value === `*${domain}/*` && rule.actions.find((action: any) => action.id === 'forwarding_url'),
      )

      const pageRulePayload = {
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
      }

      if (existingRule) {
        await fetch(`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/pagerules/${existingRule.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${cloudflareToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageRulePayload),
        })
      } else {
        await fetch(`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/pagerules`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cloudflareToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageRulePayload),
        })
      }
    }

    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/custom_hostnames/${existingHostnameId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${cloudflareToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ssl: {
          method: 'http',
          type: 'dv',
        },
        custom_metadata: {
          project: projectName,
          isAlias: isAlias,
          targetDomain: isAlias ? targetDomain : undefined,
        },
      }),
    })

    const data = await response.json()

    if (!data.success) {
      if (data.errors?.[0]?.code === 1407) {
        // Custom hostname not found
        return await addCloudflareCustomHostname(domain, projectName)
      }
      throw new Error(data.errors?.[0]?.message || 'Unknown error from Cloudflare API')
    }

    return {
      id: data.result.id,
      status: data.result.status === 'active' ? 'active' : 'pending',
      hostnames: [data.result.hostname],
      error: null,
    }
  } catch (error: unknown) {
    console.error('Cloudflare API error during hostname update:', error)
    return { id: existingHostnameId, status: 'error', hostnames: [domain], error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Add a custom hostname to Cloudflare for SaaS
 */
async function addCloudflareCustomHostname(domain: string, projectName: string) {
  try {
    const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN
    const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID

    if (!cloudflareToken || !cloudflareZoneId) {
      throw new Error('Cloudflare credentials not set in environment variables')
    }

    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/custom_hostnames`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cloudflareToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hostname: domain,
        ssl: {
          method: 'http',
          type: 'dv',
        },
        custom_metadata: {
          project: projectName,
        },
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Unknown error from Cloudflare API')
    }

    return {
      id: data.result.id,
      status: data.result.status === 'active' ? 'active' : 'pending',
      hostnames: [data.result.hostname],
      error: null,
    }
  } catch (error: unknown) {
    console.error('Cloudflare API error:', error)
    return { id: null, status: 'error', hostnames: [domain], error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Remove a custom hostname from Cloudflare for SaaS
 */
async function removeCloudflareCustomHostname(hostnameId: string) {
  try {
    const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN
    const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID

    if (!cloudflareToken || !cloudflareZoneId) {
      throw new Error('Cloudflare credentials not set in environment variables')
    }

    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/custom_hostnames/${hostnameId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cloudflareToken}`,
      },
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Unknown error from Cloudflare API')
    }

    return true
  } catch (error: unknown) {
    console.error('Cloudflare API error during hostname removal:', error)
    throw error
  }
}
