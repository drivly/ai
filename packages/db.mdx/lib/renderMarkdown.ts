import { renderToStaticMarkup } from 'react-dom/server'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import { ReactElement } from 'react'

export const renderMarkdown = async (component: ReactElement): Promise<string> => {
  const html = renderToStaticMarkup(component)

  const processor = unified().use(rehypeParse).use(rehypeRemark).use(remarkStringify)

  return String(await processor.process(html))
}
