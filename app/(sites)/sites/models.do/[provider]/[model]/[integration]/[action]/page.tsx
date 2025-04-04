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

async function fetchAction(integrationId: string, actionId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/integrations/${integrationId}/actions/${actionId}`)
    const data = await response.json()
    return data.action
  } catch (error) {
    console.error('Error fetching action:', error)
    return null
  }
}

async function ActionDetailsSection({ 
  provider, 
  modelSlug, 
  integrationId,
  actionId
}: { 
  provider: string | undefined, 
  modelSlug: string | undefined, 
  integrationId: string | undefined,
  actionId: string | undefined
}) {
  if (!provider || !modelSlug || !integrationId || !actionId) {
    notFound()
  }
  const model = await fetchModelDetails(provider, modelSlug)
  const integration = await fetchIntegration(integrationId)
  const action = await fetchAction(integrationId, actionId)
  
  if (!model || !integration || !action) {
    notFound()
  }
  
  return (
    <div className="space-y-8">
      <div className="p-6 border border-border rounded-lg">
        <h2 className="text-2xl font-bold text-foreground mb-4">{action.name}</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Action Description</h3>
            <p className="text-muted-foreground">{action.description || 'No description available.'}</p>
          </div>
          
          {action.parameters && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Parameters</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary/5">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-left">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {action.parameters.map((param: any) => (
                      <tr key={param.name} className="border-t border-border">
                        <td className="p-2">{param.name}</td>
                        <td className="p-2">{param.type}</td>
                        <td className="p-2">{param.description || 'N/A'}</td>
                        <td className="p-2">{param.required ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {action.returns && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Return Value</h3>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p><span className="font-medium">Type:</span> {action.returns.type}</p>
                <p className="mt-1"><span className="font-medium">Description:</span> {action.returns.description || 'N/A'}</p>
              </div>
            </div>
          )}
          
          {action.example && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Example Usage</h3>
              <pre className="p-4 bg-primary/5 rounded-lg overflow-x-auto">
                <code>{action.example}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 border border-border rounded-lg">
        <h2 className="text-2xl font-bold text-foreground mb-4">Integration & Model</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-primary/5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Integration</h3>
            <h4 className="font-medium">{integration.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {integration.description || 'No description available.'}
            </p>
            {integration.documentation && (
              <a 
                href={integration.documentation} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 text-primary hover:underline text-sm"
              >
                Documentation
              </a>
            )}
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Model</h3>
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
  )
}

async function ActionPage({ params }: { params: Promise<{ 
  provider?: string, 
  model?: string, 
  integration?: string,
  action?: string
}> }) {
  const { provider, model: modelSlug, integration: integrationId, action: actionId } = await params
  const glowColor = getGlowColor('models.do')
  
  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-20 md:pt-32 md:pb-40">
      <div className='hero-glow-container mb-8' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <h1 className="mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-500">
          {provider} / {modelSlug} / {integrationId} / {actionId}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Action details and usage information
        </p>
      </div>
      
      <Suspense fallback={
        <div className="space-y-8">
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-48 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      }>
        <ActionDetailsSection 
          provider={provider} 
          modelSlug={modelSlug} 
          integrationId={integrationId}
          actionId={actionId}
        />
      </Suspense>
    </div>
  )
}

export default withSitesNavbar(ActionPage)
