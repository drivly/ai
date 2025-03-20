import { CloudflareOptions, WorkerMetadata } from '../types'

/**
 * Deploys a worker to Cloudflare Workers for Platforms
 * @param code Bundled code to deploy
 * @param metadata Worker metadata
 * @param options Cloudflare options
 * @returns Deployment URL
 */
export async function deployToCloudflare(code: string, metadata: WorkerMetadata, options: CloudflareOptions = {}): Promise<string> {
  const { accountId = process.env.CF_ACCOUNT_ID, apiToken = process.env.CF_API_TOKEN, namespaceId = process.env.CF_NAMESPACE_ID } = options

  if (!accountId) {
    throw new Error('Cloudflare account ID is required')
  }

  if (!apiToken) {
    throw new Error('Cloudflare API token is required')
  }

  if (!namespaceId) {
    throw new Error('Cloudflare Workers for Platforms namespace ID is required')
  }

  // Create a unique script name
  const scriptName = `worker-${Date.now()}`

  // Create the form data
  const formData = new FormData()

  // Add the worker code
  const codeBlob = new Blob([code], { type: 'application/javascript' })
  formData.append('worker.js', codeBlob, 'worker.js')

  // Add the metadata
  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: 'application/json',
  })
  formData.append('metadata', metadataBlob, 'metadata.json')

  // Deploy the worker
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/dispatch/namespaces/${namespaceId}/scripts/${scriptName}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Cloudflare API error: ${error.errors?.[0]?.message || response.statusText}`)
  }

  const result = await response.json()
  return `https://${scriptName}.${result.result.subdomain}.workers.dev`
}
