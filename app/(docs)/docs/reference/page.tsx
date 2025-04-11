import { ApiReference } from '@scalar/nextjs-api-reference'

export const metadata = {
  title: 'API Reference',
  description: 'Drivly AI API Reference Documentation',
}

export default function APIReference() {
  return (
    <ApiReference
      configuration={{
        url: "/api.json",
        layout: "modern"
      }}
    />
  )
}
