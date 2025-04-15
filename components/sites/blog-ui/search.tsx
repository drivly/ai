'use client'

import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

interface SearchProps {
  value: string
  onChange: (value: string) => void
}

export function Search({ value, onChange }: SearchProps) {
  return (
    <div className='relative'>
      <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
      <Input
        type='search'
        placeholder='Search...'
        className='border-input bg-background dark:bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
