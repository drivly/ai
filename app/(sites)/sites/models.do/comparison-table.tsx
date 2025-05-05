import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export interface ComparisonTableProps {
  title: string
  selectedModels: any[]
  toggleModelSelection: (slug: string) => void
}

export const ComparisonTable = ({ title, selectedModels, toggleModelSelection }: ComparisonTableProps) => {
  return (
    <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/30'>
      <h2 className='mb-6 text-2xl font-bold'>{title}</h2>
      <div className='overflow-x-auto'>
        <Table className='border-collapse'>
          <TableHeader>
            <TableRow className='border-b border-gray-100 dark:border-gray-800'>
              <TableHead className='w-[200px] py-3 font-medium'>Feature</TableHead>
              {selectedModels.map((model) => (
                <TableHead key={model.slug} className='min-w-[200px] py-3 font-medium'>
                  <div className='flex items-center justify-between'>
                    <span>{model.shortName || model.name}</span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => toggleModelSelection(model.slug)}
                      className='h-6 w-6 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800'>
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className='border-b border-gray-100 dark:border-gray-800'>
              <TableCell className='py-3 font-medium'>Provider</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.slug} className='py-3'>
                  {model.endpoint && 'providerName' in model.endpoint ? model.endpoint.providerName : 'N/A'}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className='border-b border-gray-100 dark:border-gray-800'>
              <TableCell className='py-3 font-medium'>Context Length</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.slug} className='py-3'>
                  {model.contextLength.toLocaleString()} tokens
                </TableCell>
              ))}
            </TableRow>
            <TableRow className='border-b border-gray-100 dark:border-gray-800'>
              <TableCell className='py-3 font-medium'>Input Modalities</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.slug} className='py-3'>
                  {model.inputModalities.join(', ')}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className='border-b border-gray-100 dark:border-gray-800'>
              <TableCell className='py-3 font-medium'>Output Modalities</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.slug} className='py-3'>
                  {model.outputModalities.join(', ')}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className='border-b border-gray-100 dark:border-gray-800'>
              <TableCell className='py-3 font-medium'>Latency</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.slug} className='py-3'>
                  {model.sorting?.latencyLowToHigh < 50 ? 'Fast' : 'Standard'}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className='border-b border-gray-100 dark:border-gray-800'>
              <TableCell className='py-3 font-medium'>Cost</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.slug} className='py-3'>
                  {model.sorting?.pricingLowToHigh < 50 ? 'Low' : model.sorting?.pricingLowToHigh > 200 ? 'High' : 'Medium'}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className='border-b border-gray-100 dark:border-gray-800'>
              <TableCell className='py-3 font-medium'>Tools Support</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.slug} className='py-3'>
                  {model.endpoint && 'supportsToolParameters' in model.endpoint && model.endpoint.supportsToolParameters ? 'Yes' : 'No'}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className='py-3 font-medium'>Reasoning Support</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.slug} className='py-3'>
                  {model.endpoint && 'supportsReasoning' in model.endpoint && model.endpoint.supportsReasoning ? 'Yes' : 'No'}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
