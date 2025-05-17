import { useQueryStates } from 'nuqs'
import { gptdoSearchParams } from '../search-params'

export const useCustomQuery = () => {
  const [{ model, tool, output, q, system, temp, seed }, setQueryState] = useQueryStates(gptdoSearchParams)

  return { model, tool, output, q, system, temp, seed, setQueryState }
}
