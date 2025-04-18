import { CloudflareOptions, WorkerMetadata } from '../types'

/**
 * Deploys a worker to Cloudflare Workers for Platforms
 * @param code Bundled code to deploy
 * @param metadata Worker metadata
 * @param options Cloudflare options
 * @returns Deployment URL
 */
export async function deployToCloudflare(code: string, metadata: WorkerMetadata, options: CloudflareOptions = {}): Promise<string> {
  const { accountId = process.env.CF_ACCOUNT_ID, apiToken = process.env.CF_API_TOKEN, namespaceId = process.env.CF_NAMESPACE_ID, maxRetries = 3, retryDelay = 1000 } = options

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

  const metadataWithProcessedBindings = {
    ...metadata,
    bindings: metadata.bindings?.map((binding) => {
      switch (binding.type) {
        case 'plain_text':
        case 'secret_text':
        case 'kv_namespace':
        case 'durable_object_namespace':
        case 'wasm_module':
        case 'service':
        case 'r2_bucket':
        case 'analytics_engine':
        case 'queue':
          return binding
        default:
          console.warn(`Unknown binding type: ${(binding as any).type}`)
          return binding
      }
    }),
  }

  const metadataBlob = new Blob([JSON.stringify(metadataWithProcessedBindings)], {
    type: 'application/json',
  })
  formData.append('metadata', metadataBlob, 'metadata.json')

  let lastError: Error | null = null
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/dispatch/namespaces/${namespaceId}/scripts/${scriptName}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        return `https://${scriptName}.${result.result.subdomain}.workers.dev`
      }

      try {
        const error = await response.json()
        if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
          lastError = new Error(`Cloudflare API error: ${error.errors.map((e: any) => `${e.code}: ${e.message}`).join(', ')}`)
        } else if (error.message) {
          lastError = new Error(`Cloudflare API error: ${error.message}`)
        } else {
          lastError = new Error(`Cloudflare API error: ${response.status} - ${response.statusText}`)
        }
      } catch (parseError) {
        lastError = new Error(`Cloudflare API error: ${response.status} - ${response.statusText}. Unable to parse error details.`)
      }

      if (response.status < 500 && response.status !== 429) {
        break // Don't retry if not a transient error
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }

    attempt++
    if (attempt < maxRetries) {
      const delay = retryDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random() * 0.5)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Failed to deploy worker after multiple attempts')
}
