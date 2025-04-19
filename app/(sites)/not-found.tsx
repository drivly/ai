import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import Link from 'next/link'

/**
 * Standard HTML-based 404 page for site routes
 * This follows Next.js conventions for not-found pages
 */
function NotFoundPage() {
  return (
    <div className='container mx-auto max-w-6xl px-3 py-20 text-center'>
      <h1 className='mb-4 text-4xl font-bold'>404 - Page Not Found</h1>
      <p className='mb-8 text-lg'>The page you are looking for does not exist.</p>
      <Link href='/' className='text-blue-500 hover:underline'>
        Return to Home
      </Link>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: NotFoundPage })
