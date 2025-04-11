'use client'

import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'

export default function APIReference() {
  return (
    <ApiReferenceReact
      configuration={{
        url: "/api/docs/openapi.json",
        layout: "stacked"
      }}
    />
  )
}
