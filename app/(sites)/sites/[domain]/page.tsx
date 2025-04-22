import { codeExample, siteContent } from '@/.ai/functions/content'
import { Particles } from '@/components/sites/magicui/particles'
import { DotdoLinkSection } from '@/components/sites/sections/dotdo-link-section'
import { HeroSection } from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { getGlowColor } from '@/domains.config'
import { getSession } from '@/lib/auth/context/get-context-props'
import { findSiteContent } from '@/lib/sites'
import { cache } from 'react'
import { Metadata } from 'next'
import { Faqs } from '@/components/sites/sections/faqs'

export const dynamic = 'force-dynamic'

const _getContent = cache(async (domain: string) => {
  const content = await findSiteContent(domain, true)
  return await siteContent(content || { domain })
})

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params
  const content = await _getContent(domain)

  return {
    title: content.seo.title,
    description: content.seo.description,
  }
}

// need to be able to render the specific website from the slug and throw not found if the slug is not found
async function DotDoPage(props: { params: { domain: string }; searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { domain } = props.params
  const searchParams = props.searchParams
  await getSession()

  const site = domain === '%5Bdomain%5D' ? 'workflows.do' : (domain ?? 'workflows.do')
  const content = await _getContent(domain)

  const glowColor = (content as any).brandColor || getGlowColor(site)

  return (
    <>
      <div className='hero-glow-container' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <HeroSection
          codeExample={content.codeExample}
          codeLang={content.codeLang}
          badge={content.badge}
          title={content.hero.headline}
          description={content.hero.subheadline}
          buttonText='Join waitlist'
          domain={site}
        />
      </div>
      <DotdoLinkSection />
      <Particles className='absolute inset-0 -z-10' quantity={50} ease={70} size={0.05} staticity={40} color={'#ffffff'} />
      <Faqs faqs={content.faqs} />
    </>
  )
}

export default withSitesWrapper({ WrappedPage: DotDoPage })
// Get Started // Join
// --- Request access
// email onboarding with questions react-email // templates
// from Bryant's email - simple email template domain specific
//
//
// login with Github
