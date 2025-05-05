import { GridPatternDashed } from '@/components/sites/magicui/grid-pattern-dashed'
import { Particles } from '@/components/sites/magicui/particles'
import { getCookie } from '@/lib/actions/cookie.action'
import { Fragment } from 'react'
import { PositionCard } from './position-card'
import { CAREERS_DO_APPLIED_COOKIE_NAME, jobPositions } from './schema'

export const Careers = async () => {
  const appliedPositions = await getCookie(CAREERS_DO_APPLIED_COOKIE_NAME.value)

  return (
    <Fragment>
      {/* Fixed background effects */}
      <div className='fixed inset-0 -z-10 overflow-hidden'>
        {/* Green glow effect with reduced opacity */}
        <div
          className='absolute top-0 right-0 left-0 h-[100vh] opacity-20 blur-2xl'
          style={{
            background: 'radial-gradient(circle at center top, #98D2C0, transparent 30%)',
          }}
        />

        {/* Particles effect with fewer particles and reduced size */}
        <Particles className='absolute inset-0' quantity={20} ease={70} size={0.03} staticity={40} color={'#ffffff'} />
      </div>

      {/* Scrollable grid pattern at the top */}
      <div className='absolute top-0 right-0 left-0 -z-10 h-[60vh] overflow-hidden opacity-60'>
        <GridPatternDashed />
      </div>

      {/* Page content */}
      <div className='relative z-10 container mx-auto px-3 py-24 md:pt-36 xl:px-0'>
        <div className='mx-auto mb-16 max-w-3xl'>
          <div className='mb-12 text-center'>
            <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl leading-none font-medium tracking-tight text-balance text-transparent sm:text-7xl dark:from-white dark:to-white/40'>
              Join the team
            </h1>
            <p className='text-muted-foreground text-xl'>Come build the future of work.</p>
          </div>

          <div className='text-center'>
            <p className='mb-6 text-gray-300'>
              We believe business processes should feel like clean, composable code — readable by humans, executable by AI, and powerful enough to transform entire industries.
            </p>
            <p className='mb-6 text-gray-300'>
              We’re not just building another AI tool — we’re creating a platform where Functions, Workflows, and Agents collaborate to perform real, economically valuable work.
              Our stack powers fully autonomous operations for leading companies, combining automation, intelligence, and human-in-the-loop design.
            </p>
            <p className='mb-6 text-gray-300'>If you're excited to build practical AI systems that make a real impact, we’d love to work with you.</p>
          </div>

          {/* Job Cards */}
          <div className='my-10 border-t border-gray-800/50'>
            <h2 className='mt-10 mb-4 text-xl font-semibold'>Open Positions</h2>
            <div className='grid gap-4'>
              {jobPositions.map((position) => (
                <PositionCard key={position.id} job={position} hasApplied={appliedPositions.includes(position.position)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
