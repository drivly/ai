declare module '*.mdx' {
  import type { ComponentType } from 'react'
  
  export const data: Record<string, any>
  export const component: ComponentType
  export default component
}
