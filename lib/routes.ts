export const DEFAULT_LOGIN_REDIRECT = '/admin'
export const API_AUTH_PREFIX = '/api/auth'

export const publicRoutes = [
  '/api/users/me',
  '/api/users/logout',
  '/login',
  '/logout',
  '/admin/login',
  '/sign-in',
  '/sign-up',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/api/auth/callback',
]

export const protectedRoutes = ['/dashboard', '/dashboard/*', '/account', '/account/*', '/admin', '/admin/*', '/chat', '/chat/*', '/chat-ui', '/chat-ui/*']
