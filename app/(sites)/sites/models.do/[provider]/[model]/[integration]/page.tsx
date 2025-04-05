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

async function fetchIntegration(integrationId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/integrations/${integrationId}`)
    const data = await response.json()
    return data.integration
  } catch (error) {
    console.error('Error fetching integration:', error)
    return null
  }
}

async function fetchActions(integrationId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/integrations/${integrationId}/actions`)
    const data = await response.json()
    return data.actions
  } catch (error) {
    console.error('Error fetching actions:', error)
    return []
  }
}

async function IntegrationDetailsSection({ 
  provider, 
  modelSlug, 
  integrationId 
}: { 
  provider: string | undefined, 
  modelSlug: string | undefined, 
  integrationId: string | undefined 
}) {
  if (!provider || !modelSlug || !integrationId) {
    notFound()
  }
  
  const model = await fetchModelDetails(provider, modelSlug)
  const integration = await fetchIntegration(integrationId)
  const actions = await fetchActions(integrationId)
  
  if (!model || !integration) {
    notFound()
  }
  
  return (
    <div className="space-y-8">
      <div className="p-6 border border-border rounded-lg">
        <h2 className="text-2xl font-bold text-foreground mb-4">{integration.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Integration Details</h3>
            <p className="text-muted-foreground">{integration.description || 'No description available.'}</p>
            
            {integration.documentation && (
              <a 
                href={integration.documentation} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 text-primary hover:underline"
              >
                View Documentation
              </a>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Model Compatibility</h3>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium">{model.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">Provider: {provider}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {model.features?.map((feature: string) => (
                  <span key={feature} className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border border-border rounded-lg">
        <h2 className="text-2xl font-bold text-foreground mb-4">Available Actions</h2>
        
        {actions && actions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action: any) => (
              <a 
                key={action.id} 
                href={`/sites/models.do/${provider}/${modelSlug}/${integrationId}/${action.id}`}
                className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground">{action.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No actions available for this integration.</p>
        )}
      </div>
    </div>
  )
}

async function IntegrationPage({ params }: { params: Promise<{ domain?: string, provider?: string, model?: string, integration?: string }> }) {
  const { provider, model: modelSlug, integration: integrationId } = await params
  const glowColor = getGlowColor('models.do')
  
  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-20 md:pt-32 md:pb-40">
      <div className='hero-glow-container mb-8' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <h1 className="mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-500">
          {provider} / {modelSlug} / {integrationId}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Integration details and available actions
        </p>
      </div>
      
      <Suspense fallback={
        <div className="space-y-8">
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-48 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      }>
        <IntegrationDetailsSection 
          provider={provider} 
          modelSlug={modelSlug} 
          integrationId={integrationId} 
        />
      </Suspense>
    </div>
  )
}

export default IntegrationPage
