import { defineConfig } from 'tsup'
import { glob } from 'glob'
import path, { format } from 'path'
import fs from 'fs'
import react18Plugin from 'esbuild-plugin-react18'
import cssModulePlugin from 'esbuild-plugin-css-module'

// Dynamically gather all client components
const clientComponentFiles = glob.sync('src/client/components/**/*.tsx')
const clientComponents = clientComponentFiles.reduce(
  (acc, file) => {
    const componentName = path.basename(file, '.tsx')
    const relativePath = file
    acc[`client/components/${componentName}`] = relativePath
    return acc
  },
  {} as Record<string, string>,
)

// Dynamically gather all server components
const serverComponentFiles = glob.sync('src/server/components/**/*.tsx')
const serverComponents = serverComponentFiles.reduce(
  (acc, file) => {
    const componentName = path.basename(file, '.tsx')
    const relativePath = file
    acc[`server/components/${componentName}`] = relativePath
    return acc
  },
  {} as Record<string, string>,
)

export default defineConfig((options) => ({
  entry: {
    'server/index': 'src/server/index.ts',
    'client/index': 'src/client/index.ts',
    'lib/index': 'src/lib/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    ...clientComponents,
    ...serverComponents,
  },
  format: ['esm'],
  target: 'es2022',
  sourcemap: false,
  bundle: true,
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'next', 'shikiji', 'shikiji/core', 'shikiji/wasm'],
  minify: !options.watch,
  plugins: [react18Plugin(), cssModulePlugin()],
  esbuildOptions(options) {
    // Handle node built-ins
    options.alias = {
      'node:path': 'path',
      'node:fs': 'fs',
      'node:url': 'url',
      'node:process': 'process',
    }
    return options
  },
  onSuccess: async () => {
    // Copy CSS files to dist (directly from src)
    const cssFiles = glob.sync('src/**/*.css')
    for (const file of cssFiles) {
      const dest = file.replace('src/', 'dist/')
      await fs.promises.mkdir(path.dirname(dest), { recursive: true })
      await fs.promises.copyFile(file, dest)
    }

    // Additionally, copy the main CSS files to the root dist folder
    await fs.promises.copyFile('src/globals.css', 'dist/globals.css')
    await fs.promises.copyFile('src/base.css', 'dist/base.css')

    // Check if server/index.css exists - it contains the compiled Tailwind CSS
    const serverCssPath = 'dist/server/index.css'
    if (fs.existsSync(serverCssPath)) {
      // Create a combined CSS file that includes both the Tailwind output and our variables
      const tailwindCss = await fs.promises.readFile(serverCssPath, 'utf8')
      const globalsCss = await fs.promises.readFile('src/globals.css', 'utf8')

      // Write the combined file
      await fs.promises.writeFile('dist/globals.compiled.css', tailwindCss + '\n\n' + globalsCss)
      console.log('Created globals.compiled.css that combines Tailwind output with our variables')
    }

    console.log('Built + copied CSS files')
  },
}))
