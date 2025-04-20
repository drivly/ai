import { ImageResponse } from '@vercel/og'
import { fetchProjectByDomainEdge } from '@/lib/fetchProjectByDomainEdge'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default async function Image({ params }: { params: { domain: string } }): Promise<ImageResponse> {
  try {
    const project = await fetchProjectByDomainEdge(params.domain)

    if (!project) {
      throw new Error('Project not found')
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
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: 60, fontWeight: 'bold', color: '#111827' }}>{project.name}</h1>
            <p style={{ fontSize: 30, color: '#4b5563', marginTop: 16 }}>Powered by Business-as-Code</p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
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
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>Business-as-Code</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  }
}
