import { Fragment } from 'react'
import { ModelsNavbar } from './sites-navbar'

export default function ModelsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { domain?: string; provider?: string; model?: string; integration?: string; action?: string }
}) {
  const paramsPromise = Promise.resolve(params)

  return (
    <Fragment>
      <ModelsNavbar params={paramsPromise} />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </Fragment>
  )
}
