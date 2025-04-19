'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('MDXLD error:', error)
  }, [error])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4'>
      <h2 className='mb-4 text-2xl font-bold'>Something went wrong!</h2>
      <p className='mb-4'>There was an error loading the MDXLD content.</p>
      <button onClick={() => reset()} className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
        Try again
      </button>
    </div>
  )
}
