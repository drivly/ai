import { notFound } from 'next/navigation'

/**
 * Catch-all 404 page for site routes
 * Renders a standard HTML-based 404 page
 */
export default function NotFoundPage() {
  notFound()
  
  return null
}
