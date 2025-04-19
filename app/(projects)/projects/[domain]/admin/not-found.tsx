import Link from 'next/link'

export default function ProjectNotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
      <h1 className='mb-4 text-4xl font-bold'>Project Not Found</h1>
      <p className='mb-8 text-lg'>The project you're looking for does not exist or you don't have access to it.</p>
      <Link href='/admin' className='rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'>
        Return to Admin
      </Link>
    </div>
  )
}
