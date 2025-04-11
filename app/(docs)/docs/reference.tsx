import { ApiReference } from '@scalar/nextjs-api-reference'

export default function APIReference() {
  return (
    <ApiReference 
      apiDescriptionUrl="/api/docs/openapi.json" 
      layout="stacked" 
    />
  )
}
