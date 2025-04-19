import type { Metadata } from 'next'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { findSiteContent } from '@/lib/sites'
import { HeroSection } from '@/components/sites/sections/hero-section'
import { Particles } from '@/components/sites/magicui/particles'
import { DotdoLinkSection } from '@/components/sites/sections/dotdo-link-section'
import { getGlowColor } from '@/domains.config'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params
  const project = await fetchProjectByDomain(domain)
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }
  
  return {
    title: project.name,
    description: `${project.name} - powered by Business-as-Code`,
  }
}

export default async function ProjectLandingPage({ params }: { params: Promise<{ domain: string }> }) {
  try {
    const { domain } = await params
    const project = await fetchProjectByDomain(domain)
    
    if (!project) {
      return <div>Project Not Found</div>
    }
    
    const content = { 
      title: project.name,
      description: `${project.name} - powered by Business-as-Code`,
      headline: project.name,
      subhead: `${project.name} - powered by Business-as-Code`
    }
    
    const glowColor = getGlowColor(domain)
    
    return (
      <>
        <div className='hero-glow-container' style={{ '--glow-color': glowColor } as React.CSSProperties}>
          <HeroSection
            codeExample={content.subhead}
            codeLang='json'
            badge={content.headline}
            buttonText='Admin Dashboard'
            buttonHref='/admin'
            title={content.headline}
            description={content.subhead}
            domain={domain}
          />
        </div>
        <DotdoLinkSection />
        <Particles className='absolute inset-0 -z-10' quantity={50} ease={70} size={0.05} staticity={40} color={'#ffffff'} />
      </>
    )
  } catch (error) {
    console.error('Error in ProjectLandingPage:', error)
    return <div>Error loading project</div>
  }
}
