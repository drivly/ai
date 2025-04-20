export default function Loading() {
  return (
    <div className='container mx-auto max-w-4xl px-3 py-24 md:py-32'>
      {/* Back button skeleton */}
      <div className='animate-pulse mb-4 inline-flex items-center'>
        <div className='h-4 w-4 rounded-full bg-gray-200 mr-1'></div>
        <div className='h-4 w-24 rounded bg-gray-200'></div>
      </div>

      {/* Article container */}
      <article>
        {/* Title/metadata skeletons */}
        <div className='mb-8'>
          {/* Category badge */}
          <div className='animate-pulse mb-4 h-6 w-28 rounded-full bg-gray-200'></div>
          {/* Title */}
          <div className='animate-pulse h-10 w-3/4 rounded bg-gray-200 mb-4'></div>
          {/* Description */}
          <div className='animate-pulse h-6 w-full rounded bg-gray-200 mb-4'></div>
          {/* Date */}
          <div className='animate-pulse mt-4 h-4 w-32 rounded bg-gray-200'></div>
        </div>

        {/* Image skeleton */}
        <div className='animate-pulse mb-8 h-[400px] w-full rounded-lg bg-gray-200'></div>

        {/* Blog content skeleton - ensuring it's at least one page tall */}
        <div className='min-h-[60vh]'>
          {/* Multiple paragraph skeletons */}
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className='animate-pulse h-5 w-full rounded bg-gray-200 mb-6'></div>
          ))}
        </div>

        {/* Share buttons skeleton */}
        <div className='mt-8 flex items-center justify-between border-t border-gray-200 pt-8'>
          <div className='animate-pulse h-8 w-32 rounded bg-gray-200'></div>
        </div>
      </article>
    </div>
  )
}
