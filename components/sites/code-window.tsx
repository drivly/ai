import { cn } from '@drivly/ui/lib'

interface CodeWindowProps {
  className?: string
  code: string
  language?: string
  title?: string
}

// Function to syntax highlight JSON
function syntaxHighlightJson(json: string) {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
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
    .replace(/({|}|\[|\]|,|:)/g, (match) => {
      return '<span class="text-white">' + match + '</span>'
    })
}

export function CodeWindow({ className, code, language = 'json', title = 'llm.do' }: CodeWindowProps) {
  // Only handle JSON for now
  const highlightedCode = language === 'json' ? syntaxHighlightJson(code) : code

  return (
    <div className={cn('bg-opacity-[0.01] rounded-2xl border-[10px] border-white/10', className)}>
      <div className='relative w-full overflow-hidden rounded-md border'>
        {/* Code window header */}
        <div className='flex items-center justify-between bg-black/80 px-4 py-2 backdrop-blur-md'>
          <div className='flex items-center gap-2'>
            <div className='flex gap-1.5'>
              <div className='size-3 rounded-full bg-white/20'></div>
              <div className='size-3 rounded-full bg-white/20'></div>
              <div className='size-3 rounded-full bg-white/20'></div>
            </div>
            <p className='mx-auto text-xs text-gray-400'>{title}</p>
          </div>
          {/* <div className='flex items-center gap-2'>
            <div className='rounded bg-gray-800 px-2 py-1'>
              <p className='text-xs text-gray-400'>{language.toUpperCase()}</p>
            </div>
          </div> */}
        </div>

        {/* Code content */}
        <div className='bg-black/90 p-4 px-8 text-left font-mono text-sm text-white'>
          <pre className='language-json'>
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
