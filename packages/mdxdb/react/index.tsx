import { compile, evaluate, run } from '@mdx-js/mdx'

export const MDXProvider = ({ children, components }: { children: React.ReactNode, components: Record<string, React.ComponentType> }) => {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
