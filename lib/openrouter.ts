const headers = {
  Authorization: `Bearer ${process.env.OPENROUTER_PROVISIONING_KEY}`,
}

export async function findKey(apiKey: string) {
  // We can only match on the first 3 characters, and the last 3 of the API key.
  const keyAfterIntro = apiKey.split('-v1-')[1]
  const keyLabel = keyAfterIntro.slice(0, 3) + '...' + keyAfterIntro.slice(-3)

  // Loop until we find a match or we've ran out
  let keyMatch
  let resultCount = 0
  let offset = 0
  do {
    offset += resultCount
    const res = await fetch(`https://openrouter.ai/api/v1/keys?include_disabled=false&offset=${offset}`, { headers })
      .then((x) => x.json())
      .then((x) => x.data as KeyDetails[])
    resultCount = res.length
    if (resultCount) keyMatch = res.find((key) => key.label?.split('-v1-')[1] === keyLabel)
  } while (!keyMatch && resultCount > 0)
  return keyMatch || null
}

export async function createKey(details: { name: string; limit?: number }) {
  return await fetch(`https://openrouter.ai/api/v1/keys`, {
    headers,
    method: 'POST',
    body: JSON.stringify(details),
  })
    .then((x) => x.json())
    .then((x) => ({ ...x.data, key: x.key }) as KeyDetails)
}

export async function getKeyDetails(hash: string) {
  return await fetch(`https://openrouter.ai/api/v1/keys/${hash}`, { headers })
    .then((x) => x.json())
    .then((x) => x.data as KeyDetails)
}

export async function updateKeyDetails(
  hash: string,
  details: {
    name?: string
    disabled?: boolean
    limit?: number
  },
) {
  return await fetch(`https://openrouter.ai/api/v1/keys/${hash}`, {
    headers,
    method: 'PATCH',
    body: JSON.stringify(details),
  })
    .then((x) => x.json())
    .then((x) => x.data as KeyDetails)
}

export async function getKey(apiKey: string) {
  return await fetch('https://openrouter.ai/api/v1/key', { headers: { Authorization: `Bearer ${apiKey}` } })
    .then((x) => x.json())
    .then(
      (x) =>
        x.data as {
          label: string
          usage: number
          is_free_tier: boolean
          is_provisioning_key: boolean
          rate_limit: {
            requests: number
            interval: string
          }
          limit?: number
          limit_remaining?: number
        },
    )
}

export interface KeyDetails {
  name: string
  label?: string
  limit?: number
  disabled?: boolean
  created_at?: string
  updated_at?: string
  hash?: string
  key?: string
}

export async function getGeneration(id: string | number, apiKey: string) {
  return await fetch(`https://openrouter.ai/api/v1/generations/${id}`, { headers: { Authorization: `Bearer ${apiKey}` } })
    .then((x) => x.json())
    .then((x) => x.data as Generation)
}

export interface Generation {
  id: string
  total_cost: number
  created_at: string
  model: string
  origin: string
  usage: number
  is_byok: boolean
  upstream_id?: string
  cache_discount?: number
  app_id?: number
  streamed?: boolean
  cancelled?: boolean
  provider_name?: string
  latency?: number
  moderation_latency?: number
  generation_time?: number
  finish_reason?: string
  native_finish_reason?: string
  tokens_prompt?: number
  tokens_completion?: number
  native_tokens_prompt?: number
  native_tokens_completion?: number
  native_tokens_reasoning?: number
  num_media_prompt?: number
  num_media_completion?: number
  num_search_results?: number
}
