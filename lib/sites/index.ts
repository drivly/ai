import { sites } from '@/.velite'
import { codeExample } from '@/components/sites/constants/code-example'
import { ai } from '@/ai.config'

/**
 * Site content type definition
 */
interface SiteContent {
  title: string
  description: string
  headline?: string
  subhead?: string
  brandColor?: string
  badge?: string
  codeExample?: string | object
  codeLang?: string
  content?: any
  group?: string
}

/**
 * Find site content based on domain with fallback
 * @param domain Domain to find content for
 * @param includeHero Whether to include hero content fields
 * @returns Site content with fallback if not found
 */
export async function findSiteContent(domain: string, includeHero = false): Promise<SiteContent> {
  const site = domain === '%5Bdomain%5D' ? 'workflows.do' : (domain ?? 'llm.do')

  const normalizedSite = site.replace(/\.do(\.gt|\.mw)?$/, '.do')

  const originalSite = site

  const siteContent = sites.find((s: any) => {
    const titleDomain = s.title.split(' - ')[0].toLowerCase()
    return (
      normalizedSite === titleDomain.toLowerCase() ||
      normalizedSite === titleDomain.toLowerCase().replace('.do', '') ||
      s.title.toLowerCase().includes(normalizedSite.toLowerCase())
    )
  })

  if (!siteContent) {
    try {
      const { output } = await ai.generateSiteContent({ domain: site })

      return {
        title: output.title || site,
        description: output.description || `${site} | .do Business-as-Code`,
        headline: output.headline || site,
        subhead: output.subhead || 'Powered by .do',
        badge: output.badge || 'AI without Complexity',
        codeExample: output.codeExample || codeExample,
        codeLang: output.codeLang || 'json',
        brandColor: output.brandColor,
        group: output.group || 'other',
      }
    } catch (error) {
      console.error(`Error generating content for ${site}:`, error)
      
      if (error instanceof Error && error.message?.includes('functionName')) {
        console.error('AI function execution error - missing functionName parameter')
      }
      
      const fallbackContent: SiteContent = {
        title: site,
        description: `${site} | .do Business-as-Code`,
      }

      if (includeHero) {
        return {
          ...fallbackContent,
          headline: site,
          subhead: 'Powered by .do',
          badge: 'AI without Complexity',
          codeExample: codeExample,
          codeLang: 'json',
        }
      }

      return fallbackContent
    }
  }

  return siteContent
}

// export const metadata = {
//   // metadataBase: new URL(domain),
//   alternates: {
//     canonical: '/',
//     languages: {
//       'en-US': '/en-US',
//       'de-DE': '/de-DE',
//     },
//   },
//   openGraph: {
//     images: '/og-image.png',
//   },
// }

// Title: “Business-as-Code: <br className='block sm:hidden' /> The Future of Intelligent Work”
// Subtitle: “Do more with structured Functions, reliable Workflows, and autonomous AI Agents—transforming intelligence into economically valuable, measurable outcomes.”
// 3:24
// Business as Code: The Future of Intelligent Work
// Move beyond chat with structured Functions, reliable Workflows, and autonomous AI Agents—transforming intelligence into economically valuable, measurable outcomes.
// New

// Bryant
//   3:39 PM
// Do economically valuable work with structured Functions, reliable Workflows, and autonomous AI Agents—transforming intelligence into measurable outcomes.
