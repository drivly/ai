import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import { MDXComponents } from 'nextra/mdx-components'
import Hero from './components/Hero'

// Get the default MDX components
const themeComponents = getThemeComponents()

// Merge components
export function useMDXComponents(components?: MDXComponents) {
  return {
    ...themeComponents,
    ...components,
    // Hero
  }
}
