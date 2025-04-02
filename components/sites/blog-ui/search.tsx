'use client'

import { Input } from '@/components/sites/input'
import { SearchIcon } from 'lucide-react'

interface SearchProps {
  value: string
  onChange: (value: string) => void
}

export function Search({ value, onChange }: SearchProps) {
  return (
    <div className='relative'>
      <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
      <Input type='search' placeholder='Search...' className='pl-10' value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
