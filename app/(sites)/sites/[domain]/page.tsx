import { heroContent } from '@/components/sites/constants/content'
import Particles from '@/components/sites/magicui/particles'
import DotdoSection from '@/components/sites/sections/dotdo'
import HeroSection from '@/components/sites/sections/hero'
import { withSitesNavbar } from '@/components/sites/with-sites-navbar'
import { domainsConfig, getGlowColor } from '@/domains.config'
import { notFound } from 'next/navigation'

// need to be able to render the specific website from the slug and throw not found if the slug is not found
async function DotDoPage({ params }: { params: Promise<{ domain?: string }> }) {
  const { domain } = await params

  const site = domain ?? 'llm.do'

  const glowColor = getGlowColor(site)

  return (
    <>
      <div className='hero-glow-container' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <HeroSection
          codeExample={heroContent.codeExample}
          badge={heroContent.badge}
          buttonText={heroContent.buttonText}
          title={heroContent.title}
          description={heroContent.description}
        />
      </div>
      <DotdoSection />
      <Particles className='absolute inset-0 -z-10' quantity={50} ease={70} size={0.05} staticity={40} color={'#ffffff'} />
    </>
  )
}

export default withSitesNavbar(DotDoPage)
// Get Started // Join
// --- Request access
// email onboarding with questions react-email // templates
// from Bryant's email - simple email template domain specific
//
//
// login with Github
