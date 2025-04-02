'use server'

import { headers } from 'next/headers'

export async function getDomainLogo() {
  const headersList = await headers()
  const host = headersList.get('host') || 'apis.do'
  if (host.endsWith('.do') && !host.slice(0, -3).includes('.')) {
    return host
  }
  return 'Workflows.do'
}
