import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import React from 'react'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'API Response'
  
  const width = 1200
  const height = 630
  
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            padding: 40,
            borderRadius: 16,
            color: '#333',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                margin: 0,
                marginBottom: 16,
                color: '#0366d6',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 28,
                margin: 0,
                marginBottom: 40,
              }}
            >
              API Response
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                backgroundColor: '#0366d6',
                borderRadius: 8,
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              View API Documentation
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'calc(100% - 80px)',
            }}
          >
            <p
              style={{
                fontSize: 18,
                color: '#555',
                margin: 0,
              }}
            >
              Powered by Drivly
            </p>
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    )
  } catch (error) {
    console.error('Error generating OpenGraph image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
