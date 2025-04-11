export default function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/docs/sdks')) {
    return new Response('SDK documentation is temporarily unavailable', {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
  
  return null;
}

export const config = {
  matcher: ['/docs/sdks/:path*'],
};
