import { ReactNode } from 'react'

export const metadata = {
  title: 'API Reference',
  description: 'API Reference Documentation',
}

export default function ReferenceLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
