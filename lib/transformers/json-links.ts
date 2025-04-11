/**
 * Custom transformer that makes URLs in JSON strings clickable
 * 
 * This transformer is designed to be used with rehype-pretty-code
 * to make URLs in JSON code blocks clickable.
 */
export default function transformer() {
  return {
    name: 'json-links-transformer',
    
    pre(node: any) {
      if (node.lang !== 'json') return node
      return node
    },
    
    line(line: any, lineIndex: number) {
      return line
    },
    
    token(token: any, tokenIndex: number, line: any) {
      if (token.content && token.type === 'string') {
        const urlMatch = token.content.match(/^"(https?:\/\/[^"]+)"$/)
        if (urlMatch) {
          const url = urlMatch[1]
          return {
            ...token,
            content: `"<a href="${url}" target="_blank" rel="noopener noreferrer" class="json-link">${url}</a>"`,
            classes: [...(token.classes || []), 'json-link-container']
          }
        }
      }
      return token
    },
    
    span(span: any) {
      return span
    }
  }
}
