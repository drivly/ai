import { env } from 'cloudflare:workers'

export async function fetchFromProvider(
  {
    body,
    headers: { Authorization },
  }: {
    body: any
    headers: { Authorization: string | undefined }
  },
  method: string,
  path: string,
) {
  Authorization = Authorization?.startsWith('Bearer ') ? Authorization : `Bearer ${Authorization}`
  return await fetch(`https://gateway.ai.cloudflare.com/v1/${env.ACCOUNT_ID}/${env.GATEWAY_ID}/openrouter/v1${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization,
    },
    body: JSON.stringify(body),
  })
}
