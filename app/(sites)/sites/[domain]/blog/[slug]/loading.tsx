import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='container mx-auto max-w-4xl px-3 py-24 md:py-32'>
      {/* Back button skeleton */}
      <div className='mb-6 inline-flex items-center'>
        <Skeleton className='mr-1 h-4 w-4 rounded-full' />
        <Skeleton className='h-4 w-16 rounded' />
      </div>

      {/* Title/metadata skeletons */}
      <div className='mb-8'>
        <Skeleton className='mb-4 h-7 w-24 rounded-full' />
        <Skeleton className='mb-4 h-10 w-3/4 rounded' />
        <Skeleton className='h-6 w-full rounded' />
        {/* Date/share skeletons */}
        <div className='mt-4 flex flex-row items-center justify-between gap-2'>
          <Skeleton className='h-4 w-24 rounded' />
          <Skeleton className='h-4 w-32 rounded' />
        </div>
      </div>

      {/* Image skeleton */}
      <Skeleton className='relative mb-8 h-[400px] w-full rounded-lg' />

      {/* Blog content skeleton - ensuring it's at least one page tall */}
      <div className='prose prose-lg min-h-[60vh] max-w-none'>
        {/* Multiple paragraph skeletons */}
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className='mb-6 h-5 w-full rounded' />
          ))}
        {/* Additional skeleton elements as needed */}
      </div>
    </div>
  )
}
