
export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  return []
}

export const generateMetadata = async () => {
  return {
    title: 'Documentation',
  }
}

export default function Page() {
  return (
    <div className="container mx-auto py-12">
      <div className="prose prose-invert mx-auto max-w-4xl">
        <h1>Documentation</h1>
        <p>
          Documentation is temporarily unavailable during this build.
          Please check back later or visit the main site for more information.
        </p>
      </div>
    </div>
  )
}
