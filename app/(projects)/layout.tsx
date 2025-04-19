import React from 'react'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div className='project-layout'>{children}</div>
      </body>
    </html>
  )
}
