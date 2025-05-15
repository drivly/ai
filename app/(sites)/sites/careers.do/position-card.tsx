import { Badge } from '@/components/ui/badge'
import { ApplyWithGitHub } from './apply-with-github'
import { jobPositions } from './schema'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

export interface PositionCardProps {
  job: (typeof jobPositions)[number]
  hasApplied?: boolean
}

export const PositionCard = ({ job, hasApplied }: PositionCardProps) => {
  return (
    <div className='rounded-lg border border-gray-800 bg-black/30 p-6 transition-all hover:border-gray-600 hover:bg-black/70'>
      <h3 className='mb-2 text-lg font-semibold'>{job.position}</h3>
      <p className='mb-4 text-sm text-gray-400'>{job.description}</p>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='flex flex-wrap gap-2'>
          {job.tags.map((tag) => (
            <Badge key={crypto.randomUUID()} variant='outline' className='text-xs whitespace-nowrap'>
              {tag}
            </Badge>
          ))}
        </div>
        <Suspense fallback={<Button className='h-10 w-[150px] cursor-pointer rounded-sm'>Apply with GitHub</Button>}>
          <ApplyWithGitHub position={job.position} hasApplied={hasApplied} />
        </Suspense>
      </div>
    </div>
  )
}
