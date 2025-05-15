'use client'

import { AnimatePresence, motion } from 'motion/react'
import useMeasure from 'react-use-measure'
import { createRequiredContext } from './hooks/create-required-context'

const [usePanel, PanelProvider] = createRequiredContext<{ value: string }>()

interface RootContentProps extends React.ComponentProps<'div'> {
  children: React.ReactNode
  value: string
}

export function Root({ children, value, ...rest }: RootContentProps) {
  let [ref, bounds] = useMeasure()

  return (
    <motion.div
      animate={{ height: bounds.height > 0 ? bounds.height : undefined }}
      transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
      style={{ overflow: 'hidden', position: 'relative' }}>
      <div ref={ref}>
        <PanelProvider value={{ value }}>
          <div {...rest}>{children}</div>
        </PanelProvider>
      </div>
    </motion.div>
  )
}

export function Content({ children, value, ...rest }: RootContentProps) {
  const panelContext = usePanel()
  const isActive = panelContext.value === value

  return (
    <AnimatePresence mode='popLayout' initial={false}>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              type: 'ease',
              ease: 'easeInOut',
              duration: 0.3,
              delay: 0.2,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              type: 'ease',
              ease: 'easeInOut',
              duration: 0.3,
            },
          }}>
          <div {...rest}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
