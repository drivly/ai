import { motion } from 'motion/react'
import { ComponentProps } from 'react'

export function Step({ step, currentStep }: { step: number; currentStep: number }) {
  let status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete'

  return (
    <motion.div animate={status} className='relative'>
      <motion.div
        variants={{
          active: {
            scale: 1,
            transition: {
              delay: 0,
              duration: 0.2,
            },
          },
          complete: {
            scale: 1.25,
          },
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: 'tween',
          ease: 'circOut',
        }}
        // bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent
        className='bg-accent-green/30 absolute inset-0 rounded-full'
      />

      <motion.div
        initial={false}
        variants={{
          inactive: {
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--muted)',
          },
          active: {
            backgroundColor: 'var(--background)',
            borderColor: 'var(--accent)',
            color: 'var(--muted-foreground)',
          },
          complete: {
            backgroundColor: 'var(--card)',
            borderColor: 'var(--muted)',
            color: 'var(--primary-foreground)',
          },
        }}
        transition={{ duration: 0.2 }}
        className='relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold'
      >
        <div className='flex items-center justify-center'>{status === 'complete' ? <CheckIcon className='text-accent-green h-6 w-6' /> : <span>{step}</span>}</div>
      </motion.div>
    </motion.div>
  )
}

function CheckIcon(props: ComponentProps<'svg'>) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M5 13l4 4L19 7'
      />
    </svg>
  )
}
