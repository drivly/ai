import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Pricing } from '@/components/sites/pages/pricing'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'

async function PricingPage(props: { params: Promise<{ domain: string }> }) {
  const { domain } = await props.params

  return (
    <div className='container mx-auto max-w-5xl px-4 pt-24 pb-12 md:pt-32'>
      <Link href='/' className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <Pricing />
    </div>
  )
}

export default withSitesWrapper(PricingPage)
