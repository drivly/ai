'use client'

import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'

export default function ReferencePage() {
  return (
    <ApiReferenceReact
      configuration={{
        url: '/api.json',
        layout: 'modern',
      }}
    />
  )
}
