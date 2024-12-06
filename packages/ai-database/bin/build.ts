import mdx from '@mdx-js/esbuild'
import esbuild from 'esbuild'

await esbuild.build({
  // Replace `index.js` with your entry point that imports MDX files:
  entryPoints: ['index.js'],
  format: 'esm',
  outfile: '.ai/index.js',
  plugins: [
    mdx({
      /* jsxImportSource: …, otherOptions… */
    }),
  ],
})

// create .ai/database.d.ts from {db,data,database}/**/*.{mdx,yml,yaml}
