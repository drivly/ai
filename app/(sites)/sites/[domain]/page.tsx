import { HeroSection } from '@/components/sites/sections/hero-section'
import { DotdoLinkSection } from '@/components/sites/sections/dotdo-link-section'
import { Particles } from '@/components/sites/magicui/particles'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { getGlowColor } from '@/domains.config'
import { getSession } from '@/lib/auth/context/get-context-props'
import { findSiteContent } from '@/lib/sites'
import { Metadata } from 'next'
import Link from 'next/link'

type MetadataParams = { params: Promise<{ domain: string }> }

export async function generateMetadata({ params }: MetadataParams): Promise<Metadata> {
  const resolvedParams = await params
  const { domain } = resolvedParams
  const content = await findSiteContent(domain)

  return {
    title: content.title,
    description: content.description,
  }
}

type PageParams = { domain: string }

interface PageProps {
  params: Promise<PageParams>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

const DotDoPage = async (props: { params: { domain: string }; searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const { domain } = props.params
  await getSession()

  const site = domain === '%5Bdomain%5D' ? 'workflows.do' : (domain ?? 'llm.do')
  const content = await findSiteContent(domain, true)

  const glowColor = (content as any).brandColor || getGlowColor(site)

  return (
    <>
      <div className='mx-auto flex min-h-screen flex-col justify-between'>
        <main className='relative flex flex-1 flex-col overflow-hidden'>
          {/* Hero Section with enhanced styling */}
          <div className='relative z-20 mt-20 flex-1 md:mt-32'>
            <HeroSection
              title={content.headline || content.title}
              description={content.subhead || content.description}
              badge={content.badge}
              codeExample={content.codeExample}
              codeLang={content.codeLang}
              domain={site}
              buttonText={site === 'functions.do' ? "Explore Functions.do" : "Join waitlist"}
            />

            {/* Documentation link section */}
            {site === 'functions.do' && (
              <div className="mx-auto mt-16 max-w-3xl text-center">
                <Link 
                  href="/docs/functions" 
                  className="inline-flex items-center justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-1"
                >
                  View Documentation
                </Link>
              </div>
            )}

            {/* Improved link section with additional context */}
            <section className="mx-auto mt-24 max-w-5xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Part of the .do Ecosystem
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-400">
                {site === 'functions.do' 
                  ? "Functions.do works seamlessly with other .do services to provide a complete development platform."
                  : "Explore the complete .do ecosystem of developer tools and services."}
              </p>
              <DotdoLinkSection />
            </section>
          </div>

          {/* Improved particle effect */}
          <Particles
            className='absolute inset-0 -z-10'
            quantity={100}
            staticity={30}
            color={glowColor}
            vx={0.1}
            vy={0.1}
          />
        </main>
      </div>
    </>
  )
}

export default withSitesWrapper({
  WrappedPage: DotDoPage
})
