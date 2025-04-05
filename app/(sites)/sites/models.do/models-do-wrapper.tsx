'use client'

import { Fragment } from 'react'
import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'

type ModelsDOParams = {
  domain?: string;
  provider?: string;
  model?: string;
  integration?: string;
  action?: string;
}

export function ModelsDoWrapper({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: ModelsDOParams 
}) {
  const paramsPromise = Promise.resolve(params)

  return (
    <Fragment>
      <SitesNavbar params={paramsPromise} />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </Fragment>
  )
}
