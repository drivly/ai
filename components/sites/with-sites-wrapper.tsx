import { Footer } from '@/components/sites/footer'
import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'
import { Fragment } from 'react'
import { CallToAction } from './sections/call-to-action'
import { Faqs } from './sections/faqs'
import { auth } from '@/auth.config'
import { AuthProvider } from '@/lib/auth/context'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'

type AwaitedPageProps<TParams extends object> = {
  params: TParams
  searchParams?: { [key: string]: string | string[] | undefined }
}

type NextPageProps<TParams extends object> = {
  params: Promise<TParams>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const withSitesWrapper = <TParams extends { domain?: string; slug?: string }>({
  WrappedPage,
  minimal = false,
  withFaqs = true,
  withCallToAction = true,
}: {
  WrappedPage: React.ComponentType<AwaitedPageProps<TParams>>
  minimal?: boolean
  withFaqs?: boolean
  withCallToAction?: boolean
}) => {
  return async (props: NextPageProps<TParams>) => {
    const [awaitedParams, awaitedSearchParams] = await Promise.all([
      props.params,
      props.searchParams || Promise.resolve(undefined), // Provide a default resolved promise if searchParams is undefined
    ])

    const pageProps: AwaitedPageProps<TParams> = {
      params: awaitedParams,
      searchParams: awaitedSearchParams,
    }

    const session = await auth()
    const payload = await getPayloadWithAuth()

    let currentUser = null
    if (session?.user?.email) {
      try {
        const users = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: session.user.email,
            },
          },
        })
        if (users.docs[0]) {
          currentUser = {
            ...users.docs[0],
            collection: 'users' as const,
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    const sessionPromise = Promise.resolve(session)
    const currentUserPromise = Promise.resolve(currentUser)

    return (
      <AuthProvider sessionPromise={sessionPromise} currentUserPromise={currentUserPromise}>
        <Fragment>
          {/* Pass awaitedParams to SitesNavbar as it needs the resolved values */}
          <SitesNavbar params={awaitedParams} minimal={minimal} />
          <main className='flex-1 overflow-x-hidden border-b border-gray-800/50'>
            {/* Pass the awaited props to WrappedPage */}
            <WrappedPage {...pageProps} />
          </main>
          {withFaqs && <Faqs />}
          {withCallToAction && <CallToAction />}
          <Footer minimal={minimal} />

          {/* Add hidden iframe for cross-domain auth */}
          <iframe src='https://apis.do/login' style={{ display: 'none' }} title='Authentication sync' aria-hidden='true' />
        </Fragment>
      </AuthProvider>
    )
  }
}
