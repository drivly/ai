import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModelCard } from './model-card'

export interface ModelListProps {
  filteredResults: any[]
  filteredProvider: string
  providers: string[]
  showComparison: boolean
  selectedForComparison: string[]
  toggleModelSelection: (slug: string) => void
}

export const ModelList = ({ filteredResults, filteredProvider, providers, showComparison, selectedForComparison, toggleModelSelection }: ModelListProps) => {
  return (
    <Tabs defaultValue='grid' className='mt-6'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <TabsList className='grid w-[368px] grid-cols-2'>
          <TabsTrigger value='grid' className='dark:data-[state=active]:bg-primary-foreground'>
            Grid View
          </TabsTrigger>
          <TabsTrigger value='provider' className='dark:data-[state=active]:bg-primary-foreground'>
            By Provider
          </TabsTrigger>
        </TabsList>
        <div className='font-ibm text-sm whitespace-nowrap text-gray-500'>
          {filteredResults.length} {filteredResults.length === 1 ? 'model' : 'models'}
        </div>
      </div>

      <TabsContent value='grid' className='mt-4'>
        {filteredResults.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredResults.map((model, idx) => (
              <div key={idx} className='relative'>
                {showComparison && (
                  <div className='absolute top-4 right-4 z-10'>
                    <Checkbox
                      checked={selectedForComparison.includes(model.slug)}
                      onCheckedChange={() => toggleModelSelection(model.slug)}
                      disabled={selectedForComparison.length >= 3 && !selectedForComparison.includes(model.slug)}
                      className='rounded-sm border-gray-300 dark:border-gray-700'
                    />
                  </div>
                )}
                <ModelCard model={model} />
              </div>
            ))}
          </div>
        ) : (
          <div className='rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900/30'>
            <p className='text-gray-400'>No models match your search criteria. Try adjusting your filters.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value='provider' className='mt-4'>
        {filteredProvider !== 'all' ? (
          <div className='mb-8'>
            <h2 className='mb-4 text-2xl font-bold'>{filteredProvider}</h2>
            {filteredResults.length > 0 ? (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {filteredResults.map((model, idx) => (
                  <div key={idx} className='relative'>
                    {showComparison && (
                      <div className='absolute top-4 right-4 z-10'>
                        <Checkbox
                          checked={selectedForComparison.includes(model.slug)}
                          onCheckedChange={() => toggleModelSelection(model.slug)}
                          disabled={selectedForComparison.length >= 3 && !selectedForComparison.includes(model.slug)}
                          className='rounded-sm border-gray-300 dark:border-gray-700'
                        />
                      </div>
                    )}
                    <ModelCard model={model} />
                  </div>
                ))}
              </div>
            ) : (
              <div className='rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900/30'>
                <p className='text-gray-500'>No models match your search criteria. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers.map((provider) => {
              const providerModels = filteredResults.filter((model) => model.endpoint && 'providerName' in model.endpoint && model.endpoint.providerName === provider)
              if (providerModels.length === 0) return null

              return (
                <div key={provider} className='mb-10'>
                  <h2 className='mb-4 text-2xl font-bold'>{provider}</h2>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {providerModels.map((model, idx) => (
                      <div key={idx} className='relative'>
                        {showComparison && (
                          <div className='absolute top-4 right-4 z-10'>
                            <Checkbox
                              checked={selectedForComparison.includes(model.slug)}
                              onCheckedChange={() => toggleModelSelection(model.slug)}
                              disabled={selectedForComparison.length >= 3 && !selectedForComparison.includes(model.slug)}
                              className='rounded-sm border-gray-300 dark:border-gray-700'
                            />
                          </div>
                        )}
                        <ModelCard model={model} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Show models without provider info */}
            {filteredResults.filter((model) => !model.endpoint || !('providerName' in model.endpoint)).length > 0 && (
              <div className='mb-10'>
                <h2 className='mb-4 text-2xl font-bold'>Other</h2>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredResults
                    .filter((model) => !model.endpoint || !('providerName' in model.endpoint))
                    .map((model, idx) => (
                      <div key={idx} className='relative'>
                        {showComparison && (
                          <div className='absolute top-4 right-4 z-10'>
                            <Checkbox
                              checked={selectedForComparison.includes(model.slug)}
                              onCheckedChange={() => toggleModelSelection(model.slug)}
                              disabled={selectedForComparison.length >= 3 && !selectedForComparison.includes(model.slug)}
                              className='rounded-sm border-gray-300 dark:border-gray-700'
                            />
                          </div>
                        )}
                        <ModelCard model={model} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}
