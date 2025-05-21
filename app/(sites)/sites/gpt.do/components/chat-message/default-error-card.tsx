import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KeyRound } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'

export interface DefaultErrorCardProps {
  error: Error | undefined
  integrationLogo?: string
  onReload: () => void
}

export const DefaultErrorCard = (props: DefaultErrorCardProps) => {
  const { error, integrationLogo, onReload } = props
  return (
    <motion.div className='my-4 mx-auto w-full' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
      <Card className='bg-card border-input w-full max-w-xs shadow-sm dark:border-zinc-700/60 dark:bg-zinc-800/40'>
        <CardHeader>
          <div className='flex items-center space-x-3'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='flex items-center justify-center'>
              <motion.div initial={{ rotate: 0 }} animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }} className='text-2xl'>
                {integrationLogo ? (
                  <Image src={integrationLogo || '/placeholder.svg'} alt='Integration logo' className='h-8 w-8 rounded-full' width={32} height={32} />
                ) : (
                  <KeyRound className='h-5 w-5 text-blue-400' />
                )}
              </motion.div>
            </motion.div>
            <CardTitle className='text-primary text-lg font-medium'>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='text-center text-xl font-semibold text-zinc-900 dark:text-white'>
                Something went wrong
              </motion.div>
            </CardTitle>
          </div>
          <CardDescription className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className='text-base text-zinc-500 sm:text-sm dark:text-zinc-400'>
              Try again or reload the conversation.
            </motion.div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className=''>
            <Button onClick={onReload} className='bg-destructive w-full cursor-pointer font-medium text-white hover:bg-red-700 dark:hover:bg-red-700' variant='destructive'>
              Reload
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
