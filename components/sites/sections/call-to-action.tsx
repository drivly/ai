import { Button } from '@drivly/ui/button'
import { cn } from '@drivly/ui/lib'
import { GridPattern } from '../magicui/grid-pattern'

export default function CallToAction() {
  return (
    <section className='inset-shadow-xl relative mb-32 h-[400px] overflow-hidden rounded-t-[32px] border-t border-gray-800/50 py-24 sm:py-32'>
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray={'4 2'}
          className={cn('text-gray-500 opacity-30 [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]')}
        />
      </div>
      <div className='relative z-10 container mx-auto mt-12 px-4 text-center sm:mt-0 sm:px-6 lg:px-8'>
        <h2 className='mb-8 text-4xl font-medium tracking-tight sm:mb-10 sm:text-5xl'>
          <span className='text-gray-400'>Do Work.</span> <span className='text-white'>With AI.</span>
        </h2>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button className='bg-white px-8 py-3 text-base text-black hover:bg-gray-200 hover:text-black'>Join the waitlist</Button>
          <Button variant='outline' className='border-gray-700 px-12 py-3 text-base text-white hover:bg-[#1A1A1D] hover:text-white' href='#'>
            Learn more
          </Button>
        </div>
      </div>
    </section>
  )
}
