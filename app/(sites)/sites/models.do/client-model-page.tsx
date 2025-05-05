'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'
import { ComparisonTable } from './comparison-table'
import { CategoryFitlers, SortFilters } from './constants'
import { ModelList } from './model-list'
import { SearchFilter } from './search-filter'

export interface ClientModelPageProps {
  initialModels: any[]
  providers: string[]
  searchParams: { category?: string; provider?: string; order?: string }
}

export function ClientModelPage({ initialModels, providers, searchParams }: ClientModelPageProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategory = searchParams.category ?? 'all'
  const filteredProvider = searchParams.provider ?? 'all'
  const filteredOrder = searchParams.order ?? 'default'

  const [filteredResults, setFilteredResults] = useState(initialModels)
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)

  // Apply filters whenever the filter criteria change
  useEffect(() => {
    let results = [...initialModels]

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      results = results.filter((model) => model.name.toLowerCase().includes(query) || model.description.toLowerCase().includes(query))
    }

    // Apply category filter
    if (filteredCategory !== 'all') {
      switch (filteredCategory) {
        case 'multimodal':
          results = results.filter((model) => model.inputModalities.includes('image') || model.outputModalities.includes('image'))
          break
        case 'tools':
          results = results.filter((model) => model.endpoint && 'supportsToolParameters' in model.endpoint && model.endpoint.supportsToolParameters)
          break
        case 'reasoning':
          results = results.filter((model) => model.endpoint && 'supportsReasoning' in model.endpoint && model.endpoint.supportsReasoning)
          break
      }
    }

    // Apply provider filter
    if (filteredProvider !== 'all') {
      results = results.filter((model) => model.endpoint && 'providerName' in model.endpoint && model.endpoint.providerName === filteredProvider)
    }

    // Apply sorting
    if (filteredOrder !== 'default') {
      switch (filteredOrder) {
        case 'latency':
          results.sort((a, b) => (a.sorting?.latencyLowToHigh || 100) - (b.sorting?.latencyLowToHigh || 100))
          break
        case 'cost':
          results.sort((a, b) => (a.sorting?.pricingLowToHigh || 100) - (b.sorting?.pricingLowToHigh || 100))
          break
        case 'context':
          results.sort((a, b) => b.contextLength - a.contextLength)
          break
      }
    }

    setFilteredResults(results)
  }, [filteredCategory, filteredProvider, initialModels, searchQuery, filteredOrder])

  // Handle model selection for comparison
  const toggleModelSelection = (modelSlug: string) => {
    if (selectedForComparison.includes(modelSlug)) {
      setSelectedForComparison((prev) => prev.filter((slug) => slug !== modelSlug))
    } else {
      // Limit to max 3 models for comparison
      if (selectedForComparison.length < 3) {
        setSelectedForComparison((prev) => [...prev, modelSlug])
      }
    }
  }

  // Get selected models data
  const selectedModels = initialModels.filter((model) => selectedForComparison.includes(model.slug))

  return (
    <>
      <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} categories={CategoryFitlers} providers={providers} sortOptions={SortFilters} />

      {/* Comparison controls */}
      <div className='mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50'>
        <div className='flex items-center gap-2'>
          <Checkbox
            id='enable-comparison'
            checked={showComparison}
            onCheckedChange={(checked) => {
              setShowComparison(!!checked)
              if (!checked) setSelectedForComparison([])
            }}
            className='rounded-sm border-gray-300 dark:border-gray-700'
          />
          <label htmlFor='enable-comparison' className='cursor-pointer text-sm'>
            Enable model comparison
          </label>
        </div>

        {showComparison && selectedForComparison.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>
              {selectedForComparison.length} {selectedForComparison.length === 1 ? 'model' : 'models'} selected
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setSelectedForComparison([])}
              className='h-8 rounded-full border border-gray-200 bg-white text-sm font-medium dark:border-gray-800 dark:bg-transparent'>
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Comparison view */}
      {showComparison && selectedForComparison.length > 0 && (
        <ComparisonTable title='Model Comparison' selectedModels={selectedModels} toggleModelSelection={toggleModelSelection} />
      )}

      <ModelList
        filteredResults={filteredResults}
        filteredProvider={filteredProvider}
        providers={providers}
        showComparison={showComparison}
        selectedForComparison={selectedForComparison}
        toggleModelSelection={toggleModelSelection}
      />
    </>
  )
}
