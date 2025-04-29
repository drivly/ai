import { Careers } from './careers'
import { ApplicationProvider } from './application-context'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join us and shape the future of Agentic work',
}

function CareersPage() {
  return (
    <ApplicationProvider>
      <Careers />
    </ApplicationProvider>
  )
}

export default withSitesWrapper({ WrappedPage: CareersPage, withCallToAction: false, minimal: true })

// flag for minimal nav, footer
