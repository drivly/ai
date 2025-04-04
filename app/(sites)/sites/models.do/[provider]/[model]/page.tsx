import { withSitesNavbar } from '@/components/sites/with-sites-navbar'
import { getGlowColor } from '@/domains.config'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

async function fetchModelDetails(provider: string, modelSlug: string) {
  try {
    const url = `https://openrouter.ai/api/frontend/models/find?supported_parameters=response_format`
    const { data } = await fetch(url).then((res) => res.json())
    
    const model = data.models.find((m: any) => 
      m.provider === provider && m.slug.endsWith(modelSlug)
    )
    
    if (!model) {
      return null
    }
    
    return model
  } catch (error) {
    console.error('Error fetching model details:', error)
    return null
  }
}

async function fetchIntegrations() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/integrations`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return { integrations: [] }
  }
}

async function ModelDetailsSection({ provider, modelSlug }: { provider: string, modelSlug: string }) {
  const model = await fetchModelDetails(provider, modelSlug)
  const integrationsData = await fetchIntegrations()
  
  if (!model) {
    notFound()
  }
  
  const isToolCallingEnabled = model.features?.includes('tools') || false
  
  return (
    <div className="space-y-8">
      <div className="p-6 border border-border rounded-lg">
        <h2 className="text-2xl font-bold text-foreground mb-4">{model.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{model.description}</p>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {model.features?.map((feature: string) => (
                  <span key={feature} className="text-sm px-3 py-1 bg-primary/10 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">{provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Context Length</span>
                <span className="font-medium">{model.context_length || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tool Calling</span>
                <span className="font-medium">{isToolCallingEnabled ? 'Enabled' : 'Not Supported'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pricing (Input)</span>
                <span className="font-medium">${model.pricing?.input || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pricing (Output)</span>
                <span className="font-medium">${model.pricing?.output || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isToolCallingEnabled && (
        <div className="p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">Available Integrations</h2>
          
          {integrationsData.integrations && integrationsData.integrations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {integrationsData.integrations.map((integration: any) => (
                <a 
                  key={integration.id} 
                  href={`/sites/models.do/${provider}/${modelSlug}/${integration.id}`}
                  className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-semibold text-foreground">{integration.name}</h3>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No integrations available for this model.</p>
          )}
        </div>
      )}
    </div>
  )
}

function ModelDetailsPage({ params }: { params: { provider?: string, model?: string } }) {
  const { provider, model: modelSlug } = params
  const glowColor = getGlowColor('models.do')
  
  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-20 md:pt-32 md:pb-40">
      <div className='hero-glow-container mb-8' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <h1 className="mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-500">
          {provider} / {modelSlug}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Model details, capabilities, and available integrations
        </p>
      </div>
      
      <Suspense fallback={
        <div className="space-y-8">
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-48 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      }>
        <ModelDetailsSection provider={provider} modelSlug={modelSlug} />
      </Suspense>
    </div>
  )
}

export default withSitesNavbar(ModelDetailsPage)
