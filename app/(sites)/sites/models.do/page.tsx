import { withSitesNavbar } from '@/components/sites/with-sites-navbar'
import { getGlowColor } from '@/domains.config'
import { Suspense } from 'react'

async function ModelsListSection() {
  const url = 'https://openrouter.ai/api/frontend/models/find?supported_parameters=response_format'
  const response = await fetch(url).then((res) => res.json())
  
  const data = response?.data || {}
  const models = Array.isArray(data.models) ? data.models : []
  
  const modelsByProvider = models.reduce((acc: Record<string, any[]>, model: any) => {
    const provider = model.provider || 'unknown'
    if (!acc[provider]) {
      acc[provider] = []
    }
    acc[provider].push(model)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="space-y-12">
      {Object.entries(modelsByProvider).map(([provider, models]) => (
        <div key={provider} className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{provider}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(models as any[]).map((model: any, modelIndex: number) => (
              <a 
                key={`${provider}-model-${modelIndex}-${model.id || model.slug}`} 
                href={`/sites/models.do/${provider}/${model.slug}`}
                className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-1">{model.name}</h3>
                <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis mb-2">
                  {model.description?.substring(0, 120)}...
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {model.features?.map((feature: string, index: number) => (
                    <span key={`${model.id}-feature-${index}`} className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

async function ModelsHomePage({ params }: { params?: Promise<{ domain?: string }> }) {
  if (params) {
    await params
  }
  const glowColor = getGlowColor('models.do')

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-20 md:pt-32 md:pb-40">
      <div className='hero-glow-container' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <h1 className="mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-500">
          AI Models
        </h1>
        <p className="text-muted-foreground mb-10 max-w-2xl text-xl">
          Browse available AI models, their capabilities, integrations, and actions
        </p>
      </div>
      
      <Suspense fallback={
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-48 w-full bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      }>
        <ModelsListSection />
      </Suspense>
    </div>
  )
}

export default withSitesNavbar(ModelsHomePage)
