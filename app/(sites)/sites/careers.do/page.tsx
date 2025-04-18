import { Careers } from '@/components/sites/pages/careers'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join us and shape the future of Agentic work',
}

export default withSitesWrapper({ WrappedPage: Careers, withFaqs: false, withCallToAction: false, minimal: true })

// flag for minimal nav, footer
// minimal: true
// default: false
