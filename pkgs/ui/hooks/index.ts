import { createContext, useContext as reactUseContext, type ReactNode } from 'react';

/**
 * Creates a context with a required provider and custom hook to access it
 * @returns Tuple with hook and provider components
 */
export function createRequiredContext<T>() {
  const Context = createContext<T | undefined>(undefined);

  function useContext() {
    const context = reactUseContext(Context);
    if (context === undefined) {
      throw new Error('useContext must be used within its Provider');
    }
    return context;
  }

  function Provider({ children, value }: { children: ReactNode; value: T }) {
    return Context.Provider({ value, children });
  }

  return [useContext, Provider] as const;
}
