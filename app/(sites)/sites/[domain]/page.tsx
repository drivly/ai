import { Particles } from '@/components/sites/magicui/particles'
import DotdoLinkSection from '@/components/sites/sections/dotdo-link-section'
import HeroSection from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { getGlowColor } from '@/domains.config'
import { getSession } from '@/lib/auth/context/get-context-props'
import { findSiteContent, getFallbackContent } from '@/lib/sites'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { domain: string } }): Promise<Metadata> {
  const domain = params.domain;
  
  const siteContent = findSiteContent(domain);
  const fallbackContent = getFallbackContent(domain);
  
  const content = siteContent || fallbackContent;
  
  return {
    title: content.title,
    description: content.description,
  };
}

// need to be able to render the specific website from the slug and throw not found if the slug is not found
async function DotDoPage(props: { params: Promise<{ domain: string }> }) {
  const { domain } = await props.params
  await getSession()

  const site = domain ?? 'llm.do'
  const glowColor = getGlowColor(site)
  
  const siteContent = findSiteContent(domain)
  const fallbackContent = getFallbackContent(domain, true)
  
  const content = siteContent || fallbackContent

  return (
    <>
      <div className='hero-glow-container' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <HeroSection
          codeExample={content.subhead || ''}
          badge={content.headline || ''}
          buttonText="Join waitlist"
          title={content.headline || content.title}
          description={content.subhead || content.description}
          domain={domain}
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
