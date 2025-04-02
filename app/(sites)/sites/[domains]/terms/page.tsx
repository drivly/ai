import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { domainsConfig } from '@/domains.config'

export default async function TermsPage({ params }: { params: { domains: string } }) {
  const domain = params.domains

  if (!domain || !domainsConfig.domains[domain]) {
    return notFound()
  }

  return (
    <div className='container mx-auto max-w-4xl px-4 pt-24 pb-12 md:pt-32'>
      <Link href={`/sites/${domain}`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Terms of Service</h1>
        <div className='prose mt-8 max-w-none dark:prose-invert'>
          <p>These Terms of Service govern your use of the website located at {domain} and any related services provided by us.</p>
          <h2>Limitations</h2>
          <p>You agree that we will not be liable to you or any third party for any loss or damages of any kind.</p>
          <h2>Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws applicable to agreements made and to be performed in the United States.</p>
        </div>
      </div>
    </div>
  )
}
