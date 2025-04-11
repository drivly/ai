import { cn } from '@drivly/ui/lib'
import { syntaxHighlightJson } from '@/lib/utils/syntax-highlight'

interface CodeWindowProps {
  className?: string
  code: string
  language?: string
  title?: string
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
        <div className='scrollbar-hide max-h-[500px] overflow-auto bg-black/90 p-4 px-8 text-left font-mono text-sm text-white'>
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
