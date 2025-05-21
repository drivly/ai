import { transition } from '@/components/sites/navbar/animations'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { type Dispatch, Fragment, type SetStateAction, useState } from 'react'

export interface ChipTabsProps<TTab extends string, TContent> {
  className?: string
  tabs: TTab[]
  content: TContent[] | null
  renderContent: (content: TContent, selected: string) => React.ReactNode
}

export const ChipTabs = <TTab extends string, TContent>({ className, tabs, content, renderContent }: ChipTabsProps<TTab, TContent>) => {
  const [selected, setSelected] = useState(tabs[0])

  const hasMultipleTabs = tabs.length > 1

  return (
    <Fragment>
      <div className={cn('flex flex-wrap items-center bg-transparent', hasMultipleTabs ? 'mb-5' : 'mb-0', className)}>
        {hasMultipleTabs && tabs.map((tab) => <Chip text={tab} selected={selected === tab} setSelected={setSelected} key={tab} />)}
      </div>
      {content?.map((item, index) => <Fragment key={index}>{renderContent(item, selected)}</Fragment>)}
    </Fragment>
  )
}

interface ChipProps<T extends string> {
  text: T
  selected: boolean
  setSelected: Dispatch<SetStateAction<T>>
}

const Chip = <T extends string>({ text, selected, setSelected }: ChipProps<T>) => {
  const cleanedText = text.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <button
      onClick={() => setSelected(text)}
      className={`${selected ? 'text-primary font-medium' : 'text-muted-foreground hover:bg-muted/40 hover:dark:text-slate-200'} animate-in relative cursor-pointer px-2 py-1.5 text-xs transition-colors duration-300 focus:outline-none focus-visible:outline-none`}>
      <span className='relative z-10'>{cleanedText}</span>
      {selected && (
        <motion.span layoutId='pill-tab' transition={{ ...transition, type: 'spring', duration: 0.5 }} className='border-accent-foreground absolute inset-0 z-0 border-b-1' />
      )}
    </button>
  )
}
