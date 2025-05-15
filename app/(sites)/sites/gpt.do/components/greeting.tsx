'use client'

import { motion } from 'framer-motion'

interface GreetingProps {
  title: string
  description: string
  config: React.ReactNode
}

export const Greeting = ({ title, description, config }: GreetingProps) => {
  return (
    <div key='overview' className='mx-auto flex size-full max-w-6xl flex-col justify-start px-4 py-10'>
      <div className='mb-12 space-y-2'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-white'>
          {title}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='text-zinc-500 dark:text-zinc-400'>
          {description}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {config}
      </motion.div>
    </div>
  )
}
