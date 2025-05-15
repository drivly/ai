export const CategoryFitlers = [
  { value: 'all', label: 'All Models' },
  { value: 'multimodal', label: 'Multimodal' },
  { value: 'tools', label: 'Tools' },
  { value: 'reasoning', label: 'Reasoning' },
] as const

export const SortFilters = [
  { value: 'latency', label: 'Latency (Fastest First)' },
  { value: 'cost', label: 'Cost (Cheapest First)' },
  { value: 'context', label: 'Context Size (Largest First)' },
  { value: 'default', label: 'Default' },
] as const

export type SearchFilterTypes = typeof CategoryFitlers | typeof SortFilters


