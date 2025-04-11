export const dynamic = 'force-static';

export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'API Reference is temporarily unavailable during this build.',
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
