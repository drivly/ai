import { AI as AIFunctions } from 'ai-functions'

export type AIProps = {
  children: React.ReactNode
}

export const AI = async ({ children }: AIProps) => {
  return <div>{children}</div>
}


