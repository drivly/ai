import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

function SkeletonBlogCard() {
  return (
    <div className='bg-card flex min-h-[400px] flex-col overflow-hidden rounded-lg border'>
      <div className='relative h-1/2 w-full overflow-hidden'>
        <Skeleton className='h-full w-full' />
      </div>
      <div className='flex flex-grow flex-col overflow-hidden p-4'>
        <Skeleton className='h-8 w-3/4 mb-2' />
        <Skeleton className='h-4 w-full mt-2 mb-1' />
        <Skeleton className='h-4 w-2/3 mb-4' />
        <div className='mt-4 flex items-center justify-between'>
          <Skeleton className='h-5 w-16' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  const skeletonCards = Array.from({ length: 6 }).map((_, i) => (
    <SkeletonBlogCard key={i} />
  ))

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24 md:py-32'>
      {/* Skeleton for page header */}
      <div className='mb-8'>
        <Skeleton className='h-4 w-16 mb-4' />
        <Skeleton className='h-10 w-32' />
      </div>

      {/* Skeleton for filters */}
      <div className='mb-8 grid items-center gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <Skeleton className='h-8 w-full' />
        </div>
        <div className='md:col-span-1'>
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      {/* Skeleton cards grid */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {skeletonCards}
      </div>
    </div>
  )
}
