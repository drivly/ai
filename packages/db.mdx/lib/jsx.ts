import { compile, evaluate, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import type { MDXDocument } from './mdx'

export const UI = async (document: MDXDocument) => {
  const code = await compile(document.content, {
    outputFormat: 'function-body',
  })

  const { default: Component } = await evaluate(code, {
    ...runtime,
    // You can pass additional scope/components here if needed
    // components: { ... }
  })

  return Component
}
