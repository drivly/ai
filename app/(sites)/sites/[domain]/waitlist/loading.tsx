'use client'

import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className='font-geist flex min-h-screen flex-col items-center justify-center bg-black text-white'>
      <div className='flex flex-col items-center justify-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <p className='text-muted-foreground mt-4'>Almost there! Securing your spot...</p>
      </div>
    </div>
  )
}
