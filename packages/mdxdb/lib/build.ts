import mdx from '@mdx-js/esbuild'
import esbuild from 'esbuild'

// TODO: add support for frontmatter

await esbuild.build({
  // Replace `index.js` with your entry point that imports MDX files:
  entryPoints: ['index.js'],
  format: 'esm',
  outfile: 'output.js',
  plugins: [mdx({/* jsxImportSource: …, otherOptions… */})]
})