import { motion } from 'motion/react'

export const Greeting = () => {
  return (
    <div key='overview' className='mx-auto flex size-full max-w-4xl flex-col justify-center px-8 md:mt-20'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-3xl font-bold text-transparent'>
        Welcome to gpt.do
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='mt-2 text-xl text-zinc-500'>
        Chat with AI across the .do universe
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className='mt-6 flex flex-wrap gap-3'>
        {['Workflows.do', 'Functions.do', 'Agents.do', 'LLM.do', 'APIs.do'].map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1, ease: 'easeInOut' }}
            className='cursor-pointer rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'>
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
