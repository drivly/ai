import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PricingPage(props: { params: Promise<{ domain: string }> }) {
  const { domain } = await props.params

  return (
    <div className='container mx-auto max-w-4xl px-4 pt-24 pb-12 md:pt-32'>
      <Link href={`/sites/${domain}`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Pricing</h1>
        <div className='prose dark:prose-invert mt-8 max-w-none'>
          <p>Choose the plan that's right for your needs.</p>
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-lg border p-6'>
              <h3 className='text-xl font-bold'>Free</h3>
              <div className='mt-2 text-3xl font-bold'>$0</div>
              <p className='mt-4'>Basic features for individuals</p>
            </div>
            <div className='rounded-lg border p-6 shadow-md'>
              <h3 className='text-xl font-bold'>Pro</h3>
              <div className='mt-2 text-3xl font-bold'>$49</div>
              <p className='mt-4'>Advanced features for power users</p>
            </div>
            <div className='rounded-lg border p-6'>
              <h3 className='text-xl font-bold'>Enterprise</h3>
              <div className='mt-2 text-3xl font-bold'>Contact us</div>
              <p className='mt-4'>Custom solutions for teams</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
