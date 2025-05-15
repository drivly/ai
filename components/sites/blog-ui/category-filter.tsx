'use client'

import { BlogCategory } from '@/app/(sites)/sites/[domain]/blog/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import { useCallback } from 'react'

interface CategoryFilterProps {
  categories: ReadonlyArray<BlogCategory>
  selectedCategories: BlogCategory[]
  onSelectCategories: (categories: BlogCategory[]) => void
}

export function CategoryFilter({ categories, selectedCategories, onSelectCategories }: CategoryFilterProps) {
  const toggleCategory = useCallback(
    (category: BlogCategory | null) => {
      if (category === null) {
        onSelectCategories([])
      } else {
        if (selectedCategories.includes(category)) {
          onSelectCategories(selectedCategories.filter((c) => c !== category))
        } else {
          onSelectCategories([...selectedCategories, category])
        }
      }
    },
    [selectedCategories, onSelectCategories],
  )

  return (
    <div className='flex flex-wrap items-center gap-3 sm:gap-2'>
      <Badge
        variant={selectedCategories.length === 0 ? 'solid' : 'default'}
        className={cn(
          'cursor-pointer px-3 py-1.5 text-sm sm:px-2.5 sm:py-1 sm:text-xs',
          selectedCategories.length === 0 ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
        )}
        onClick={() => toggleCategory(null)}>
        All
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategories.includes(category) ? 'solid' : 'default'}
          className={cn(
            'cursor-pointer px-3 py-1.5 text-sm capitalize sm:px-2.5 sm:py-1 sm:text-xs',
            selectedCategories.includes(category) ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
          )}
          onClick={() => toggleCategory(category)}>
          {category}
        </Badge>
      ))}

      {selectedCategories.length > 0 && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onSelectCategories([])}
          className={`text-muted-foreground hover:text-primary h-8 cursor-pointer rounded-full px-3 py-1.5 text-sm transition-colors sm:h-7 sm:px-2.5 sm:py-1 sm:text-xs [&_svg:not([class*='size-'])]:size-3.5`}>
          <XIcon className='h-2 w-2' />
          Clear ({selectedCategories.length})
        </Button>
      )}
    </div>
  )
}
