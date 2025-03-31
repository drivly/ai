'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { recordError } from '../actions/error'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    recordError(error)
      .then((result) => {
        if (result) {
          console.log('Error recorded successfully:', result.id)
        }
      })
      .catch((err) => {
        console.error('Failed to record error:', err)
      })
  }, [error])

  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <pre>
          <code>{error.message + '\n\n' + (error.stack || '')}</code>
        </pre>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
