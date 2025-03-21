import '../styles.css'

// need to be able to render the specific website from the slug and throw not found if the slug is not found
export default async function HomePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  return (
    <div className='home'>
      <h1>{slug[0]}</h1>
    </div>
  )
}
