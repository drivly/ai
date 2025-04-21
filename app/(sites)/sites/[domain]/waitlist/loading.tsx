'use client'

import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className='font-geist flex min-h-screen flex-col items-center justify-center bg-black text-white'>
      <Loader2 className='h-8 w-8 animate-spin' />
    </div>
  )
}
