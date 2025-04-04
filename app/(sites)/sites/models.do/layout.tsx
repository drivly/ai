import { Fragment } from 'react'
import { StandaloneNavbar } from './standalone-navbar'

export default function ModelsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { domain?: string; provider?: string; model?: string; integration?: string; action?: string }
}) {
  return (
    <Fragment>
      <StandaloneNavbar domain={params.domain} />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </Fragment>
  )
}
