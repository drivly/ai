import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'

import { Fragment } from 'react'

type PagePromiseParams<T extends object> = {
  params: Promise<T>
}

type DomainPageProps = PagePromiseParams<{ domain?: string; slug?: string; provider?: string; model?: string; integration?: string; action?: string }>

export const withSitesNavbar = <TPage extends Record<string, any>>(WrappedPage: React.ComponentType<TPage>) => {
  return async (props: TPage) => {
    const paramsPromise = props.params && typeof props.params.then === 'function' 
      ? props.params 
      : Promise.resolve(props.params || {});
    
    return (
      <Fragment>
        <SitesNavbar params={paramsPromise} />
        <main className='flex-1 overflow-x-hidden'>
          <WrappedPage {...props} />
        </main>
      </Fragment>
    );
  }
}
