'use client'

import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'

type ModelsDOParams = {
  domain?: string;
  provider?: string;
  model?: string;
  integration?: string;
  action?: string;
}

export function SitesNavbarAdapter(props: any) {
  if (props.params && typeof props.params.then === 'function') {
    return <SitesNavbar params={props.params} />
  }
  
  const params = props.params || {}
  const paramsPromise = Promise.resolve({
    domain: params.domain || props.domain,
    provider: params.provider || props.provider,
    model: params.model || props.model,
    integration: params.integration || props.integration,
    action: params.action || props.action
  } as ModelsDOParams)
  
  return <SitesNavbar params={paramsPromise} />
}
