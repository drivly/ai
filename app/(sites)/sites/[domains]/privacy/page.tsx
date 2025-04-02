import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { domainsConfig } from '@/domains.config'

export default async function PrivacyPage({ params }: { params: { domains: string } }) {
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
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Privacy Policy</h1>
        <div className='prose mt-8 max-w-none dark:prose-invert'>
          <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit {domain}.</p>
          <h2>Personal Information We Collect</h2>
          <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
          <h2>How We Use Your Personal Information</h2>
          <p>We use the information that we collect to help us screen for potential risk and fraud, and more generally to improve and optimize our Site.</p>
        </div>
      </div>
    </div>
  )
}
