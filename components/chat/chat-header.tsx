import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function ChatHeader({ chatId, model, modelValue, setModelValue }: { chatId: string; model: string; modelValue: string; setModelValue: (value: string) => void }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setModelValue(e.target.value)
    },
    [setModelValue],
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }, [])

  return (
    <header className='flex h-14 shrink-0 items-center border-b px-4 md:px-6'>
      <div className='flex flex-1 items-center gap-6'>
        <h1 className='font-ibm z-10 text-lg font-medium sm:text-base'>GPT.do</h1>
        <div className='text-muted-foreground max-w-md flex-grow text-sm'>
          <Input
            type='text'
            value={modelValue}
            onChange={handleModelChange}
            onKeyDown={handleKeyDown}
            placeholder='Enter model name (e.g. gpt-4o)'
            className='w-full min-w-[200px]'
            style={{ width: `${Math.max(200, modelValue.length * 10)}px` }}
          />
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' asChild>
          <Link href={isHomePage ? '/chat' : '/'}>
            <X className='h-5 w-5' />
            <span className='sr-only'>Close</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
