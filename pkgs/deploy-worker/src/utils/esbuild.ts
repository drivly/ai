import { ESBuildOptions } from '../types'
import * as esbuild from 'esbuild'

/**
 * Bundles code with ESBuild
 * @param code Code to bundle
 * @param options ESBuild options
 * @returns Bundled code
 */
export async function bundleCode(
  code: string,
  options: ESBuildOptions = {}
): Promise<string> {
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

    return result.outputFiles[0].text
  } catch (error) {
    throw new Error(`ESBuild error: ${error.message}`)
  }
}
