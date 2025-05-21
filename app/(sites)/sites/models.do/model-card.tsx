import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Model } from 'language-models'
import Link from 'next/link'

export const ModelCard = ({ model }: { model: Model }) => {
  const isMultimodal = model.inputModalities.includes('image') || model.outputModalities.includes('image')
  const supportsTools = model.endpoint ? (model.endpoint as any).supportsToolParameters : false
  const supportsReasoning = model.endpoint ? (model.endpoint as any).supportsReasoning : false
  const latencyRank = model.sorting?.latencyLowToHigh ?? 100
  const pricingRank = model.sorting?.pricingLowToHigh ?? 150

  return (
    <Card className='group font-geist relative z-1 h-full w-full overflow-hidden rounded-md border border-gray-800 p-px backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1'>
      <div className='animate-border-shimmer from-background via-accent-green to-background absolute inset-0 scale-[400%] rounded-md bg-conic-90 from-0% to-0% opacity-0 blur-sm transition-opacity duration-700 group-hover:opacity-100'></div>
      <Link
        href={model.permaslug}
        className='relative grid h-full grid-cols-1 gap-4 rounded-md border-none bg-black/80 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] p-4'
      >
        <CardHeader className='flex w-full flex-col px-0'>
          <CardTitle className='flex w-full items-center justify-between gap-2'>
            <h2 className='line-clamp-1 flex items-center text-lg leading-[26px] text-ellipsis whitespace-nowrap'>{model.shortName || model.name}</h2>
          </CardTitle>
          <CardDescription className='text-xs text-gray-500'>
            <span className='font-medium'>Context:</span> {model.contextLength.toLocaleString()} tokens
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2 px-0'>
          <p className='mb-3 line-clamp-2 text-sm leading-[22px] text-gray-600 dark:text-gray-400'>{model.description}</p>
        </CardContent>

        <CardFooter className='flex flex-wrap gap-2 px-0'>
          {isMultimodal && (
            <Badge variant='outline' className='text-muted-foreground'>
              <span className='mr-1'>🖼️</span>Multimodal
            </Badge>
          )}
          {supportsTools && (
            <Badge variant='outline' className='bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'>
              <span className='mr-1'>🛠️</span>Tools
            </Badge>
          )}
          {supportsReasoning && (
            <Badge variant='outline' className='bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'>
              <span className='mr-1'>🧠</span>Reasoning
            </Badge>
          )}
          <Badge
            variant='outline'
            className={`${latencyRank < 50 ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300' : 'text-muted-foreground bg-gray-100 dark:bg-gray-800'}`}
          >
            <span className='mr-1'>{latencyRank < 50 ? '⚡' : '⏱️'}</span>
            {latencyRank < 50 ? 'Fast' : 'Std'} Latency
          </Badge>

          <Badge
            variant='outline'
            className={`${pricingRank < 50 ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300' : pricingRank > 200 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300' : 'text-muted-foreground bg-gray-100 dark:bg-gray-800'}`}
          >
            <span className='mr-1'>{pricingRank < 50 ? '💰' : pricingRank > 200 ? '💎' : '💵'}</span>
            {pricingRank < 50 ? 'Low' : pricingRank > 200 ? 'High' : 'Med'} Cost
          </Badge>
        </CardFooter>
      </Link>
    </Card>
  )
}
