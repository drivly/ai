import { Badge } from '@drivly/ui/badge'
import { Button } from '@drivly/ui/button'
import { RiCheckLine } from '@remixicon/react'

export const Enterprise = () => {
  return (
    <section className='container mx-auto mt-20 max-w-5xl overflow-hidden rounded-lg border border-gray-800 sm:mt-36'>
      <div className='grid grid-cols-1 bg-slate-600/15 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] p-6 md:p-12 lg:grid-cols-2'>
        <div className=''>
          <h2 className='text-2xl font-semibold text-gray-900 md:text-3xl dark:text-white'>Custom Enterprise Plans</h2>
          <p className='mt-4 text-gray-400'>
            Need custom solutions for your organization? Our enterprise plan includes all Scale features plus custom integrations, dedicated support, and advanced security options.
          </p>
          <div className='mt-8 space-y-4'>
            <Button className='w-full bg-black text-white hover:bg-gray-900 lg:w-1/2 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer'>Contact sales</Button>
          </div>
        </div>

        <div className='lg:px-24'>
          <ul className='mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400'>
            <li className='flex items-center gap-x-3'>
              <RiCheckLine className='size-4 shrink-0 text-emerald-400' aria-hidden='true' />
              <span>Dedicated account manager</span>
            </li>
            <li className='flex items-center gap-x-3'>
              <RiCheckLine className='size-4 shrink-0 text-emerald-400' aria-hidden='true' />
              <span>Custom SLAs and support</span>
            </li>
            <li className='flex items-center gap-x-3'>
              <RiCheckLine className='size-4 shrink-0 text-emerald-400' aria-hidden='true' />
              <span>Volume discounts</span>
            </li>
            <li className='flex items-center gap-x-3'>
              <RiCheckLine className='size-4 shrink-0 text-emerald-400' aria-hidden='true' />
              <span>
                SOC2 & HIPAA compliance{' '}
                <Badge variant='outline' className='ml-2 border-gray-800 text-xs font-normal text-gray-400'>
                  Coming soon
                </Badge>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
