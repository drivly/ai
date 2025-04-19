import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'

/**
 * Standard HTML-based 404 page for site routes
 * This follows Next.js conventions for not-found pages
 */
function NotFoundPage() {
  return (
    <div className="container mx-auto max-w-6xl px-3 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <a href="/" className="text-blue-500 hover:underline">
        Return to Home
      </a>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: NotFoundPage })
