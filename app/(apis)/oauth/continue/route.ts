import { API } from '@/lib/api'

export const GET = API(async (request, { url, user }) => {
  try {
    const redirect = url.searchParams.get('redirect')

    if (!redirect) {
      return {
        error: 'invalid_request',
        error_description: 'Missing redirect parameter',
        status: 400,
      }
    }

    if (!user) {
      return {
        redirect: `/api/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`,
      }
    }

    return { redirect: redirect }
  } catch (error) {
    console.error('OAuth continue error:', error)
    return {
      error: 'server_error',
      error_description: 'An error occurred',
      status: 500,
    }
  }
})
