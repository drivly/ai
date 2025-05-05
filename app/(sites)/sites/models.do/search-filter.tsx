import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery } from './utils'
import { Button } from '@/components/ui/button'

interface FilterOption {
  readonly value: string
  readonly label: string
}

export interface SearchFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  categories: readonly FilterOption[]
  providers: readonly FilterOption['value'][]
  sortOptions: readonly FilterOption[]
}

export const SearchFilter = ({ searchQuery, setSearchQuery, categories, providers, sortOptions }: SearchFilterProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const paramsCategory = searchParams.get('category')
  const paramsProvider = searchParams.get('provider')
  const paramsSort = searchParams.get('order')

  // Check if any filters are active
  const hasActiveFilters = paramsCategory || paramsProvider || paramsSort

  const updateFilter = (filter: string, value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: filter,
      value: value,
    })

    router.push(newUrl)
  }

  // Reset all filters
  const resetFilters = () => {
    router.push(window.location.pathname)
    setSearchQuery('')
  }

  return (
    <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center'>
      <div className='flex-1'>
        <Input
          placeholder='Search models...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='h-10 w-full rounded-sm border border-gray-200 bg-transparent px-4 dark:border-gray-800'
        />
      </div>

      <div className='flex flex-col gap-4 sm:flex-row'>
        <Select value={paramsCategory || undefined} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger className='h-10 w-full rounded-sm border border-gray-200 bg-transparent px-4 py-2 shadow-sm dark:border-gray-800'>
            <SelectValue placeholder='Filter by capability' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={paramsProvider || undefined} onValueChange={(value) => updateFilter('provider', value)}>
          <SelectTrigger className='h-10 w-full rounded-sm border border-gray-200 bg-transparent px-4 py-2 shadow-sm dark:border-gray-800'>
            <SelectValue placeholder='Filter by provider' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Providers</SelectItem>
            {providers.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={paramsSort || undefined} onValueChange={(value) => updateFilter('order', value)}>
          <SelectTrigger className='h-10 w-full rounded-sm border border-gray-200 bg-transparent px-4 py-2 shadow-sm dark:border-gray-800'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button onClick={resetFilters} variant='outline' className='rounded-sm border border-gray-200 bg-transparent px-4 py-2 whitespace-nowrap shadow-sm dark:border-gray-800'>
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  )
}
