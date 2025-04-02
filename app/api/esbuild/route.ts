import { NextResponse } from 'next/server'

/**
 * Server-only API route for esbuild processing
 * This keeps esbuild isolated to the server and prevents Next.js from trying to bundle it
 */
export async function POST(request: Request) {
  try {
    const { code, options } = await request.json()

    if (!code) {
      return NextResponse.json(
        {
          error: 'Code is required',
          success: false,
        },
        { status: 400 },
      )
    }

    const bundleCodeDynamic = async (codeToBundle: string, bundleOptions: any) => {
      const { bundleCode } = await import(/* webpackIgnore: true */ '../../../pkgs/deploy-worker/src/utils/esbuild')
      return bundleCode(codeToBundle, bundleOptions)
    }

    const bundledCode = await bundleCodeDynamic(code, options)

    return NextResponse.json({
      code: bundledCode,
      success: true,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
      },
      { status: 500 },
    )
  }
}
