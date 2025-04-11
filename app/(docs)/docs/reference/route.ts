import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.rewrite(new URL('/docs/reference/page', 'https://ai-git-devin-1744363383-content-4-scalar-api-reference.dev.driv.ly'))
}
