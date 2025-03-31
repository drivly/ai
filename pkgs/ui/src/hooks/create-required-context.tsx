import { use, createContext } from 'react'

export const createRequiredContext = <T,>(): [() => T, React.Provider<T | null>] => {
  const ContextProvider = createContext<T | null>(null)

  const useContext = (): T => {
    const contextValue = use(ContextProvider)

    if (contextValue === null) {
      throw new Error('Context value is null')
    }

    return contextValue
  }

  return [useContext, ContextProvider.Provider]
}
