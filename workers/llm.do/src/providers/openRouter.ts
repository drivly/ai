import { env } from 'cloudflare:workers'

export async function fetchFromProvider(
  {
    body,
    headers: { Authorization: apiKey },
  }: {
    body: any
    headers: { Authorization: string | undefined }
  },
  method: string,
  path: string,
) {
  return await fetch(
    // TODO: Get account and gateway ids from env
    `https://gateway.ai.cloudflare.com/v1/${env.ACCOUNT_ID}/${env.GATEWAY_ID}/openrouter/v1${path}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey || '',
      },
      body: JSON.stringify(body),
    },
  )
}
