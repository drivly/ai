'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatConfigChangeType, ConfigOption } from './chat-options-selector'

interface SearchableOptionSelectorProps {
  title: ChatConfigChangeType
  options: ReadonlyArray<ConfigOption>
  selectedItem?: ConfigOption | null
  updateOption: (type: ChatConfigChangeType, option: ConfigOption | null) => void
  placeholder?: string
  className?: string
  align?: 'center' | 'start' | 'end' | undefined
}

export function SearchableOptionSelector({
  title,
  options,
  selectedItem,
  updateOption,
  placeholder = `Select ${title}`,
  className,
  align = 'start',
}: SearchableOptionSelectorProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null)

  useEffect(() => {
    if (open && containerRef.current) {
      const isMobile = window.innerWidth < 640
      if (isMobile) {
        const formElement = containerRef.current.closest('form')
        if (formElement) {
          setPopoverWidth(formElement.clientWidth - 24) // Subtract padding
        }
      } else {
        setPopoverWidth(null)
      }
    }
  }, [open])

  const handleSelect = useCallback(
    (currentValue: string) => {
      if (selectedItem && currentValue === selectedItem.label) {
        updateOption(title, null)
      } else {
        const selectedOption = options.find((option) => option.label === currentValue)
        if (selectedOption) {
          updateOption(title, selectedOption)
        }
      }
      setOpen(false)
    },
    [selectedItem, options, updateOption, title],
  )

  return (
    <TooltipProvider>
      <div ref={containerRef} className='relative w-full sm:w-auto'>
        <Popover open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipContent>
              <p>{placeholder}</p>
            </TooltipContent>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className={cn(
                    'cursor-pointer justify-between px-2 text-xs text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-300',
                    'h-10 sm:h-6', // Taller on mobile, original height on sm+
                    'py-2 sm:py-0', // More padding on mobile
                    className,
                  )}>
                  <span className='mr-1 truncate'>{selectedItem ? selectedItem.label : placeholder}</span>
                  <ChevronsUpDown className='h-3 w-3 flex-shrink-0 opacity-50' />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
          </Tooltip>
          <PopoverContent
            className='border-gray-200 bg-white p-0 text-zinc-700 shadow-xl backdrop-blur-sm dark:border-zinc-700/40 dark:bg-zinc-900/95 dark:text-zinc-300'
            style={popoverWidth ? { width: `${popoverWidth}px` } : undefined}
            align={align}
            sideOffset={4}
            ref={containerRef}>
            <Command className='bg-transparent'>
              <CommandInput placeholder={`Search ${title.toLowerCase()}...`} className='h-9 bg-transparent text-zinc-700 dark:text-zinc-300' />
              <CommandList className='max-h-[300px]'>
                <CommandEmpty>No match found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.label}
                      value={option.label}
                      onSelect={handleSelect}
                      className='rounded-md py-2 text-zinc-700 hover:bg-gray-100 hover:text-zinc-900 aria-selected:bg-gray-100 sm:py-1 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 aria-selected:dark:bg-zinc-800'>
                      {option.label}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedItem?.label === option.label || selectedItem?.value === option.value ? 'text-emerald-600 opacity-100 dark:text-emerald-400' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  )
}
