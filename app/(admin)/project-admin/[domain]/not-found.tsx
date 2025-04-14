import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
      <p className="text-lg mb-8">
        The project you're looking for does not exist or you don't have access to it.
      </p>
      <Link
        href="/admin"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Return to Admin
      </Link>
    </div>
  );
}
