import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'

import { Fragment } from 'react'

type PagePromiseParams<T extends object> = {
  params: Promise<T>
}

type DomainPageProps = PagePromiseParams<{ domain?: string; slug?: string }>

export const withSitesNavbar = <TPage extends DomainPageProps>(WrappedPage: React.ComponentType<TPage>) => {
  return async (props: TPage) => (
    <Fragment>
      <SitesNavbar {...props} />
      <main className='flex-1 overflow-x-hidden'>
        <WrappedPage {...props} />
      </main>
    </Fragment>
  )
}
