export const DEFAULT_LOGIN_REDIRECT = '/admin'
export const API_AUTH_PREFIX = '/api/auth'

const faviconRoutes = ['/manifest.json', '/favicon.ico', '/web-app-manifest-192x192.png', '/web-app-manifest-512x512.png', '/apple-icon.png', '/icon0.svg', '/icon1.png']

export const publicRoutes = [
  '/api/users/me',
  '/api/users/logout',
  '/login',
  '/logout',
  '/admin/login',
  '/sign-in',
  '/sign-up',
  '/api.json',
  '/opengraph-image',
  '/twitter-image',
  ...faviconRoutes,
]

export const protectedRoutes = ['/dashboard', '/dashboard/*', '/account', '/account/*', '/admin', '/admin/*', '/chat', '/chat/*', '/chat-ui', '/chat-ui/*', '/gpt.do', '/gpt.do/*']
