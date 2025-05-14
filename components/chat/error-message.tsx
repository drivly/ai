import { motion } from 'framer-motion'
import { Button } from '../ui/button'

function ErrorMessage({ onReload }: { onReload: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center px-8 py-6'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='mb-4 flex items-center justify-center'>
        <motion.div initial={{ rotate: 0 }} animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }} className='text-4xl text-red-500'>
          ⚠️
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-center text-xl font-bold text-transparent'>
        Something went wrong
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='mt-2 max-w-md text-center text-[14px] leading-[24px] text-zinc-500'>
        Please try again or reload the conversation.
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='mt-4'>
        <Button onClick={onReload} className='border-border border-2 outline-none' variant='default'>
          Reload
        </Button>
      </motion.div>
    </div>
  )
}

export { ErrorMessage }
