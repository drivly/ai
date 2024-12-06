import fs from 'fs/promises'
import fg from 'fast-glob'
import { load, MDXDocument } from './mdx'
import { camelCase, set } from 'lodash-es'
// import type { MDXTree } from '../mdx'

export const evalMDX = async (glob: string = '**/*.mdx') => {
  const files = await fg(glob)
  const docs: any = {}
  for (const file of files) {
    const contents = await fs.readFile(file, 'utf-8')
    const doc = await load(contents)
    const path = file.replaceAll('/', '.').replace(/\.mdx$/, '').split('.').map(camelCase).join('.')

    console.log(file, path)
    set(docs, path, doc)
  }
  return { mdx: docs }
}

export const { mdx } = await evalMDX()