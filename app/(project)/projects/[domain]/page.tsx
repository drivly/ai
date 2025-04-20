import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { getGlowColor } from '@/domains.config'
import { HeroSection } from '@/components/sites/sections/hero-section'
import { EmailCaptureForm } from '@/components/email-capture-form'

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
      return (
        <div className='container mx-auto max-w-6xl px-3 py-24 md:py-32'>
          <HeroSection
            title={`${domain}`}
            description='This project is coming soon! Join our waitlist to get notified when we launch.'
            buttonText='Join Waitlist'
            domain={domain}
          />
          <div className='mx-auto mt-12 max-w-md'>
            <EmailCaptureForm domain={domain} />
          </div>
        </div>
      )
    }

    const glowColor = getGlowColor(domain)

    return (
      <div className='container mx-auto max-w-6xl px-3 py-24 md:py-32'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold tracking-tight'>{project.name}</h1>
          <p className='mt-4 text-lg text-gray-600'>{project.name} - powered by Business-as-Code</p>
          <div className='mt-8'>
            <Link
              href='/admin'
              className='bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow transition-colors'
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h3 className='text-xl font-semibold'>Landing Page</h3>
            <p className='mt-2 text-gray-600'>Customize your project's landing page</p>
          </div>

          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h3 className='text-xl font-semibold'>Blog</h3>
            <p className='mt-2 text-gray-600'>Manage your project's blog posts</p>
            <div className='mt-4'>
              <Link href='/blog' className='text-primary hover:text-primary/80 font-medium'>
                View Blog
              </Link>
            </div>
          </div>

          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h3 className='text-xl font-semibold'>Admin</h3>
            <p className='mt-2 text-gray-600'>Access your project's admin dashboard</p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in ProjectLandingPage:', error)
    return <div>Error loading project</div>
  }
}
