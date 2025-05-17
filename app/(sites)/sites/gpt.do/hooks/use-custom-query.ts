import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { OUTPUT_FORMATS } from '../lib/constants'
import { SearchOption } from '../lib/types'

interface UseCustomQueryProps {
  availableModels: SearchOption[]
  initialChatModel?: SearchOption
}

export const useCustomQuery = ({ availableModels, initialChatModel }: UseCustomQueryProps) => {
  const [{ model, tool, output }, setQueryState] = useQueryStates({
    model: parseAsStringLiteral(availableModels.map((model) => model.value)).withDefault(initialChatModel?.value || ''),
    tool: parseAsString.withDefault(''),
    output: parseAsStringLiteral(OUTPUT_FORMATS.map((format) => format.value)).withDefault('Markdown'),
  })

  return { model, tool, output, setQueryState }
}
