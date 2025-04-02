import { cn } from '@drivly/ui/lib'
import { Pre, AnnotationHandler } from 'codehike/code'

interface CodeWindowProps {
  className?: string
  code: string
  language?: string
  title?: string
}

const autoLinkHandler: AnnotationHandler = {
  name: 'link',
  test: /"(https?:\/\/[^"]+)"/g,
  render: ({ capture }) => {
    const url = capture[1]
    return <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-blue-400 hover:text-blue-300">{url}</a>
  }
}

export function CodeWindow({ className, code, language = 'json', title = 'llm.do' }: CodeWindowProps) {
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
            <p className='text-xs text-gray-400 mx-auto'>{title}</p>
          </div>
        </div>

        {/* Code content with CodeHike */}
        <div className='max-h-[500px] overflow-auto bg-black/90 p-4 px-8 text-left font-mono text-sm text-white'>
          <Pre 
            code={code} 
            language={language} 
            handlers={[autoLinkHandler]} 
            theme="dracula"
            className="text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>
  )
}


// browser bar with      
