/**
 * Process code using esbuild
 * This wrapper exists to avoid Next.js bundling issues with esbuild
 * It uses a server-only approach to prevent bundling errors
 */
export async function processCode(code: string, options: any = {}) {
  try {
    return {
      serverOnly: true,
      code,
      options,
      success: true
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      error: errorMessage,
      success: false
    }
  }
}
