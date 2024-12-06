import mdx from '@mdx-js/esbuild'
import esbuild from 'esbuild'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import fg from 'fast-glob'
import { httpImport } from './httpImport'


export const build = async (glob: string) => {
  const entryPoints = await fg(glob)
  await esbuild.build({
    entryPoints,
    format: 'esm',
    bundle: true,
    outfile: '.mdxdb/index.js',
    plugins: [
      httpImport,
      mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter
        ]
      })
    ]
  })
  // TODO: generate types
}
