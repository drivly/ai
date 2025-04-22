import { siteContent } from '@/.ai/functions/content'
import { findSiteContent } from '@/lib/sites'
import { cache } from 'react'

export const getContent = cache(async (domain: string) => {
  const content = await findSiteContent(domain, true)
  return await siteContent(content || { domain })
})
