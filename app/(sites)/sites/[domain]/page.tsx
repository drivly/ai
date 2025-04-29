import { codeExample } from '@/components/sites/constants/code-example'
import { Particles } from '@/components/sites/magicui/particles'
import { DotdoLinkSection } from '@/components/sites/sections/dotdo-link-section'
import { Faqs } from '@/components/sites/sections/faqs'
import { HeroSection } from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { getGlowColor } from '@/domains.config'
import { Metadata, ResolvingMetadata } from 'next'
import { getContent } from './content'
import { domains } from '@/domains.config'

export const revalidate = 86400 // 1 day
export const dynamicParams = true

export const generateStaticParams = async () => {
  return domains.map((domain) => ({ domain }))
}

// export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { domain } = await params
  const content = await getContent(domain)

  const siteUrl = new URL(`https://${domain}`)

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    metadataBase: siteUrl,
    openGraph: {
      images: [`${siteUrl}/og`],
    },
    twitter: {
      images: [`${siteUrl}/twitter`],
    },
  }
}

// need to be able to render the specific website from the slug and throw not found if the slug is not found
async function DotDoPage(props: { params: { domain: string } }) {
  const { domain } = props.params

  const site = domain === '%5Bdomain%5D' ? 'workflows.do' : (domain ?? 'workflows.do')
  const content = await getContent(domain)

  const glowColor = (content as any).brandColor || getGlowColor(site)

  return (
    <div className='overflow-x-hidden'>
      <div className='hero-glow-container' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <HeroSection
          codeExample={content.codeExample || codeExample}
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
    </div>
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
