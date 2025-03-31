/**
 * Process code using esbuild
 * This wrapper exists to avoid Next.js bundling issues with esbuild
 * It dynamically imports the bundleCode function to prevent bundling errors
 */
export async function processCode(code: string, options: any = {}) {
  try {
    const { bundleCode } = await import('../../../pkgs/deploy-worker/src/utils/esbuild')
    
    const bundledCode = await bundleCode(code, options)
    
    return {
      code: bundledCode,
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
