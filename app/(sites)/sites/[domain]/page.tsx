import { Particles } from '@/components/sites/magicui/particles'
import { DotdoLinkSection } from '@/components/sites/sections/dotdo-link-section'
import { HeroSection } from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { getGlowColor } from '@/domains.config'
import { getSession } from '@/lib/auth/context/get-context-props'
import { findSiteContent } from '@/lib/sites'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params
  const content = await findSiteContent(domain)

  return {
    title: content.title,
    description: content.description,
  }
}

// need to be able to render the specific website from the slug and throw not found if the slug is not found
async function DotDoPage(props: { params: { domain: string }; searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { domain } = props.params
  const searchParams = props.searchParams
  await getSession()

  const site = domain === '%5Bdomain%5D' ? 'workflows.do' : (domain ?? 'llm.do')
  const content = await findSiteContent(domain, true)

  const glowColor = (content as any).brandColor || getGlowColor(site)

  return (
    <>
      <div className='hero-glow-container' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <HeroSection
          codeExample={'codeExample' in content ? content.codeExample : 'subhead' in content ? content.subhead : ''}
          codeLang={'codeLang' in content ? content.codeLang : 'json'}
          badge={'badge' in content ? content.badge : 'headline' in content ? content.headline : ''}
          buttonText='Join waitlist'
          title={'headline' in content ? content.headline : content.title}
          description={'subhead' in content ? content.subhead : content.description}
          domain={site}
        />
      </div>
      <DotdoLinkSection />
      <Particles className='absolute inset-0 -z-10' quantity={50} ease={70} size={0.05} staticity={40} color={'#ffffff'} />
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
