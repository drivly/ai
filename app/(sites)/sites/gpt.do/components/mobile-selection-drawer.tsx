import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useCallback } from 'react'
import type { ChatConfigChangeType, ConfigOption } from '../lib/types'

interface MobileSelectionDrawerProps {
  title: ChatConfigChangeType
  options: ReadonlyArray<ConfigOption>
  selectedItem?: ConfigOption | null
  updateOption: (type: ChatConfigChangeType, option: ConfigOption | null) => void
  placeholder?: string
  className?: string
}

export const MobileSelectionDrawer = ({ title, options, selectedItem, updateOption, placeholder = `Select ${title}`, className }: MobileSelectionDrawerProps) => {
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
    },
    [selectedItem, options, updateOption, title],
  )

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='ghost' className={cn('hover:bg-background/80 h-9 flex-1 border-0 bg-transparent px-2 py-1 shadow-none', className)}>
          <div className='flex items-center gap-1.5'>
            <span className='max-w-[120px] truncate text-sm font-normal'>{selectedItem ? selectedItem.label : placeholder}</span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-[65vh] bg-zinc-100 dark:bg-zinc-900'>
        <DrawerHeader className='sr-only'>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{placeholder}</DrawerDescription>
        </DrawerHeader>
        <Command className='space-y-3 bg-transparent pt-4'>
          <CommandInput
            placeholder={`Search ${title.toLowerCase()}...`}
            className='border-border font-inter !h-10 border bg-transparent px-2 text-sm text-zinc-700 dark:text-zinc-300'
            withIcon={false}
          />
          <CommandList className='max-h-[65vh]'>
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup className='flex flex-col space-y-4'>
              {options.map((option) => (
                <CommandItem
                  key={option.label}
                  value={option.label}
                  onSelect={handleSelect}
                  className='rounded-md py-2 leading-[22px] tracking-wide text-zinc-700 hover:bg-gray-100 hover:text-zinc-900 aria-selected:bg-gray-100 sm:py-1 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 aria-selected:dark:bg-zinc-800'>
                  {option.label}
                  <Check className={cn('ml-auto h-4 w-4', selectedItem?.label === option.label ? 'text-emerald-600 opacity-100 dark:text-emerald-400' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DrawerContent>
    </Drawer>
  )
}
