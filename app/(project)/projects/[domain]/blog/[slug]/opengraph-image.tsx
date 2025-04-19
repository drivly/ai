import { ImageResponse } from '@vercel/og'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { getPayload } from 'payload'
import config from '@/payload.config'
 
export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default async function Image({ params }: { params: { domain: string; slug: string } }) {
  try {
    const project = await fetchProjectByDomain(params.domain)
    
    if (!project) {
      throw new Error('Project not found')
    }
    
    const payload = await getPayload({ config })
    const post = await payload.findByID({
      collection: 'resources',
      id: params.slug
    }).catch(() => null)
    
    if (!post) {
      throw new Error('Blog post not found')
    }
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
            padding: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              maxWidth: '80%',
            }}
          >
            <div style={{ fontSize: 30, color: '#4b5563', marginBottom: 16 }}>{project.name}</div>
            <h1 style={{ fontSize: 50, fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>{post.name || 'Untitled'}</h1>
            {post.data?.excerpt && (
              <p style={{ fontSize: 24, color: '#4b5563', marginTop: 16 }}>{post.data.excerpt}</p>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OpenGraph image:', error)
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            padding: 40,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>Blog Post</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}
