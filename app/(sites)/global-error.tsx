'use client' // Error boundaries must be Client Components

// TODO: figure out if we can save errors to db via a server action

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
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
