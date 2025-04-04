import { ModelsDoWrapper } from './models-do-wrapper'

export default function ModelsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { domain?: string; provider?: string; model?: string; integration?: string; action?: string }
}) {
  return (
    <ModelsDoWrapper params={params}>
      {children}
    </ModelsDoWrapper>
  )
}
