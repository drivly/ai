'use client'

import { Button } from '@/components/ui/button'
import { ScrollAreaRoot, ScrollAreaViewport } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Check, Search, X } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useOptionListPanel, type UseOptionListPanelProps } from '../hooks/use-option-list-panel'
import { SELECTION_STEP_MAP } from '../lib/constants'
import type { SearchOption } from '../lib/types'
import { KEY_FOR_INVALID_DATES, minDelay } from '../lib/utils'
import { OptionAvatar } from './option-avatar'
import Spinner from './spinner'

interface OptionListPanelProps extends UseOptionListPanelProps {
  headerSuffix?: React.ReactNode
  isLoading?: boolean
}

export function OptionListPanel(props: OptionListPanelProps) {
  const {
    focusedIndex,
    inputRef,
    inputValue,
    isSearchMode,
    itemRefs,
    navigableFlatItems,
    parentScrollRef,
    totalSize,
    virtualizableDisplayList,
    virtualItems,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleInputKeyDown,
    handleClearClick,
    handleItemClick,
    handleItemMouseEnter,
    handleItemMouseLeave,
  } = useOptionListPanel(props)

  const { title, selectedItem, headerSuffix = '', isLoading } = props

  // Track which item is currently being selected (loading state)
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null)

  // Enhanced click handler to show loading state
  const handleItemClickWithLoading = async (item: SearchOption, isSelected: boolean) => {
    if (isSelected) {
      handleItemClick(item, isSelected)
      return
    }

    // Set loading state
    setLoadingItemId(`${item.value}-${item.label}`)

    await minDelay(Promise.resolve(handleItemClick(item, isSelected)), 500)

    setLoadingItemId(null)
  }

  return (
    <div className='flex flex-col space-y-3 font-sans'>
      <div className='flex items-center space-x-2'>
        <div className='flex items-center'>
          <span
            className={cn(
              'mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold shadow-[0_0_10px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-500',

              props.title === 'integration' && selectedItem && !selectedItem.value?.includes('.')
                ? 'border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 text-emerald-700 ring-1 ring-gray-200 dark:border-zinc-700 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-950 dark:text-emerald-400 dark:ring-1 dark:ring-white/10'
                : props.title === 'integration' && selectedItem?.value?.includes('.')
                  ? 'border-emerald-200 bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/50 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-emerald-400/20'
                  : selectedItem && props.title !== 'integration'
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/50 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-emerald-400/20'
                    : 'border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 ring-1 ring-gray-200 dark:border-zinc-700 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-950 dark:text-white dark:ring-1 dark:ring-white/10',
            )}>
            {SELECTION_STEP_MAP[title]}
          </span>
          <h2 className='flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200'>
            Select <span className='capitalize'>{title}</span>
            {headerSuffix}
          </h2>
        </div>
      </div>
      <div className='group relative'>
        <ScrollAreaRoot className='h-[340px] rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-200 group-hover:border-gray-300 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:group-hover:border-zinc-700'>
          <ScrollAreaViewport ref={parentScrollRef} className='h-[340px] w-full'>
            <div className='sticky top-0 z-10 border-b border-gray-200/70 bg-gray-50/90 p-1 backdrop-blur-sm dark:border-b dark:border-zinc-800/30 dark:bg-zinc-900/80'>
              <div className='relative px-2 py-2'>
                {isSearchMode && <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-zinc-500/80' />}
                <input
                  ref={inputRef}
                  type='text'
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleInputBlur}
                  spellCheck={false}
                  className={`w-full rounded-md border-0 bg-transparent py-1 text-sm text-zinc-700 focus:ring-0 focus:outline-none dark:text-zinc-300 ${
                    isSearchMode ? 'pl-8 placeholder:text-gray-400 dark:placeholder:text-zinc-500/70' : 'pl-3 font-medium'
                  }`}
                  readOnly={!isSearchMode}
                />
                {(inputValue || (!isSearchMode && selectedItem)) && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 transform cursor-pointer p-0 text-gray-400 hover:bg-transparent hover:text-gray-600 dark:text-zinc-500/80 dark:hover:text-zinc-300'
                    onClick={handleClearClick}>
                    <span className='sr-only'>Clear</span>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>
            <div className='relative mt-1 mb-1.5 p-1' style={{ height: `${totalSize}px`, padding: '0 1px' }}>
              {isLoading ? (
                <div className='flex h-full flex-col items-center justify-start gap-2 px-3 pt-8 text-sm text-zinc-500 dark:text-zinc-400'>
                  <Spinner height={24} width={24} className='text-muted-foreground/50' />
                  <span className='text-muted-foreground/50 animate-pulse font-normal'>Assembling your tools...</span>
                </div>
              ) : virtualItems.length > 0 ? (
                virtualItems.map((virtualRow) => {
                  const displayItem = virtualizableDisplayList[virtualRow.index]

                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0 4px',
                      }}>
                      {displayItem.type === 'groupHeader'
                        ? props.groupingStrategy === 'groupByKey' &&
                          displayItem.data.displayKey !== KEY_FOR_INVALID_DATES && (
                            <div className='font-inter flex h-9 w-full items-center justify-between gap-2 px-3 text-xs'>
                              <span className='font-inter font-medium text-zinc-500 dark:text-zinc-300'>{displayItem.data.displayKey}</span>
                              <Separator className='bg-border/50 h-px w-full flex-1' />
                            </div>
                          )
                        : (() => {
                            const item = displayItem.data as SearchOption
                            const originalIndex = displayItem.originalIndexInNavigableFlatItems
                            const isItemSelected = selectedItem?.value === item.value && selectedItem?.label === item.label
                            const isFocused = focusedIndex === originalIndex && originalIndex !== -1
                            const isLoading = loadingItemId === `${item.value}-${item.label}`

                            return (
                              <Fragment>
                                <Button
                                  ref={(el) => {
                                    if (originalIndex !== -1) itemRefs.current[originalIndex] = el
                                  }}
                                  variant='ghost'
                                  className={cn(
                                    'flex h-10 w-full shrink-0 cursor-pointer justify-start rounded-md px-3 text-sm transition-all duration-200',
                                    props.groupingStrategy === 'groupByKey' && 'pl-6',
                                    isLoading && 'bg-gray-50 dark:bg-zinc-800/50',
                                    `${
                                      isItemSelected
                                        ? 'bg-gray-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                                        : isFocused
                                          ? 'bg-gray-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                                          : 'text-zinc-600 hover:bg-gray-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'
                                    }`,
                                  )}
                                  onClick={() => handleItemClickWithLoading(item, isItemSelected)}
                                  onMouseEnter={() => handleItemMouseEnter(originalIndex)}
                                  onMouseLeave={() => handleItemMouseLeave()}>
                                  <div className='flex w-full items-center gap-2'>
                                    <OptionAvatar logoUrl={item.logoUrl} size={20} direction='up' imageIndex={0} />
                                    <span className='line-clamp-1 truncate'>{item.label}</span>
                                    {isLoading ? (
                                      <Spinner height={16} width={16} className='text-muted-foreground/50 ml-auto' />
                                    ) : isItemSelected ? (
                                      <Check className='ml-auto h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                                    ) : null}
                                  </div>
                                </Button>
                                {displayItem.originalIndexInNavigableFlatItems < navigableFlatItems.length - 1 && (
                                  <Separator className='my-1 shrink-0 bg-gray-200/60 dark:bg-zinc-800/40' />
                                )}
                              </Fragment>
                            )
                          })()}
                    </div>
                  )
                })
              ) : (
                <div className='px-3 py-8 text-center text-sm text-gray-400 dark:text-zinc-500'>
                  No {title.toLowerCase()} found {isSearchMode && inputValue ? `\nmatching "${inputValue}"` : ''}
                </div>
              )}
            </div>
          </ScrollAreaViewport>
        </ScrollAreaRoot>
      </div>
    </div>
  )
}
