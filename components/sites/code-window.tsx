'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface CodeWindowProps {
  className?: string
  code: string | object
  language?: string
  title?: string
}

function syntaxHighlightJson(json: string) {
  const urlMap = new Map<string, string>()
  let urlCounter = 0

  let processedJson = json.replace(/"(https:\/\/[^"\s]+)"/g, (match, url) => {
    const placeholder = `__URL_PLACEHOLDER_${urlCounter}__`
    urlMap.set(placeholder, url)
    urlCounter++
    return `"${placeholder}"`
  })

  let result = processedJson.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  result = result.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
    let cls = 'text-green-300' // string
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-blue-300' // key
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-yellow-300' // boolean
    } else if (/null/.test(match)) {
      cls = 'text-red-300' // null
    } else {
      cls = 'text-cyan-300' // number
    }
    return '<span class="' + cls + '">' + match + '</span>'
  })

  result = result.replace(/({|}|\[|\]|,|:)/g, (match) => {
    return '<span class="text-white">' + match + '</span>'
  })

  urlMap.forEach((url, placeholder) => {
    result = result.replace(new RegExp(`"${placeholder}"`, 'g'), `"<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline hover:opacity-80">${url}</a>"`)
  })

  return result
}

export function CodeWindow({ className, code, language = 'json', title = 'llm.do' }: CodeWindowProps) {
  if (title === '%5Bdomain%5D') {
    title = 'workflows.do'
  }
  const codeString = typeof code === 'object' ? JSON.stringify(code, null, 2) : String(code)

  const [highlightedCode, setHighlightedCode] = useState(language === 'json' ? syntaxHighlightJson(codeString) : codeString)

  useEffect(() => {
    async function highlight() {
      if (language === 'json') {
        return syntaxHighlightJson(codeString)
      } else {
        const { codeToHtml } = await import('shiki')
        const html = await codeToHtml(codeString, {
          lang: language,
          theme: 'dracula', // Match our UI package theme
          transformers: [
            {
              pre(node) {
                node.properties.style = 'background-color: transparent !important;'
                return node
              },
              code(node) {
                node.properties.style = 'background-color: transparent !important;'
                return node
              },
            },
          ],
        })
        return html
      }
    }

    highlight().then(setHighlightedCode)
  }, [codeString, language])

  return (
    <div className={cn('bg-opacity-[0.01] rounded-2xl border-[10px] border-white/10', className)}>
      <div className='relative w-full overflow-hidden rounded-sm border'>
        {/* Code window header */}
        <div className='relative flex w-full items-center bg-black/80 px-4 py-2 backdrop-blur-md'>
          <div className='flex w-full items-center justify-end gap-2 md:justify-center'>
            <div className='absolute left-4 flex gap-1.5'>
              {Array.from({ length: 3 }).map((_, index) => (
                <span key={index} className='size-3 rounded-full bg-white/20' />
              ))}
            </div>
            <p className='mr-[15%] text-xs text-gray-400 md:mx-auto'>{title}</p>
          </div>
          {/* <div className='flex items-center gap-2'>
            <div className='rounded bg-gray-800 px-2 py-1'>
              <p className='text-xs text-gray-400'>{language.toUpperCase()}</p>
            </div>
          </div> */}
        </div>

        {/* Code content */}
        <div className='scrollbar-hide max-h-[500px] overflow-auto bg-black/90 p-4 px-8 text-left font-mono text-sm text-white'>
          <pre className={`language-${language}`}>
            <code
              className='text-xs sm:text-sm'
              dangerouslySetInnerHTML={{
                __html: highlightedCode,
              }}
            />
          </pre>
        </div>
      </div>
    </div>
  )
}

// browser bar with
