'use client'

import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'

export const metadata = {
  title: 'API Reference',
  description: 'Drivly AI API Reference Documentation',
}

export default function APIReference() {
  return (
    <ApiReferenceReact
      configuration={{
        url: "/api.json",
        layout: "modern"
      }}
    />
  )
}
