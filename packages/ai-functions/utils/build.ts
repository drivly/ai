import mdx from '@mdx-js/esbuild'
import esbuild from 'esbuild'
import glob from 'fast-glob'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const entryPoints = await glob(['ai/**/*.mdx', '**/ai.*.mdx'])

await esbuild.build({
  entryPoints,
  format: 'esm',
  outfile: 'ai.ts',
  plugins: [
    mdx({
      // TODO: fix this, as the frontmatter is not being parsed
      remarkPlugins: [[remarkMdxFrontmatter, { type: 'yaml', marker: '-' }]]
    })
  ]
})