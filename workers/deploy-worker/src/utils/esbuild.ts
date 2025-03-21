import { ESBuildOptions } from '../types'
import * as esbuild from 'esbuild'

/**
 * Bundles code with ESBuild
 * @param code Code to bundle
 * @param options ESBuild options
 * @returns Bundled code
 */
export async function bundleCode(code: string, options: ESBuildOptions = {}): Promise<string> {
  const { config = {} } = options

  try {
    const result = await esbuild.build({
      stdin: {
        contents: code,
        loader: 'ts',
        sourcefile: 'worker.ts',
      },
      write: false,
      bundle: true,
      format: 'esm',
      target: 'es2022',
      minify: true,
      ...config,
    })

    if (!result.outputFiles || result.outputFiles.length === 0) {
      throw new Error('ESBuild did not produce any output files')
    }

    return result.outputFiles[0].text
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`ESBuild error: ${errorMessage}`)
  }
}
