'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        source: 'global-error-handler',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Error recorded successfully:', data.id)
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
