export default function Loading() {
  return (
    <div className='container mx-auto max-w-4xl px-3 py-24 md:py-32'>
      {/* Back button skeleton */}
      <div className='animate-pulse mb-6 inline-flex items-center'>
        <div className='h-4 w-4 rounded-full bg-gray-200 mr-1'></div>
        <div className='h-4 w-16 rounded bg-gray-200'></div>
      </div>

      {/* Title/metadata skeletons */}
      <div className='mb-8'>
        <div className='animate-pulse mb-4 h-7 w-24 rounded-full bg-gray-200'></div>
        <div className='animate-pulse h-10 w-3/4 rounded bg-gray-200 mb-4'></div>
        <div className='animate-pulse h-6 w-full rounded bg-gray-200'></div>
        {/* Date/share skeletons */}
        <div className='mt-4 flex flex-row items-center justify-between gap-2'>
          <div className='animate-pulse h-4 w-24 rounded bg-gray-200'></div>
          <div className='animate-pulse h-4 w-32 rounded bg-gray-200'></div>
        </div>
      </div>

      {/* Image skeleton */}
      <div className='animate-pulse relative mb-8 h-[400px] w-full rounded-lg bg-gray-200'></div>

      {/* Blog content skeleton - ensuring it's at least one page tall */}
      <div className='prose prose-lg max-w-none min-h-[60vh]'>
        {/* Multiple paragraph skeletons */}
        {Array(12).fill(0).map((_, i) => (
          <div key={i} className='animate-pulse h-5 w-full rounded bg-gray-200 mb-6'></div>
        ))}
        {/* Additional skeleton elements as needed */}
      </div>
    </div>
  )
}
