import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import { MDXComponents } from 'nextra/mdx-components'
import Hero from './components/Hero'
import { syntaxHighlightJson } from '@/lib/utils/syntax-highlight'
import React from 'react'

// Get the default MDX components
const themeComponents = getThemeComponents()

type CodeProps = {
  className?: string
  children?: string
}

type MDXCodeElement = {
  type: 'code'
  props: CodeProps
}

// Merge components
export function useMDXComponents(components?: MDXComponents) {
  return {
    ...themeComponents,
    ...components,
    Hero,
    pre: ({ children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
      if (children && 
          typeof children === 'object' && 
          'type' in children && 
          (children as any).type === 'code' &&
          'props' in children) {
        
        const childElement = children as MDXCodeElement
        const isJsonCodeBlock = childElement.props.className?.includes('language-json')
        
        if (isJsonCodeBlock && childElement.props.children) {
          const code = childElement.props.children.toString()
          const highlightedCode = syntaxHighlightJson(code)
          
          return React.createElement('pre', props, 
            React.createElement('code', {
              className: childElement.props.className,
              dangerouslySetInnerHTML: { __html: highlightedCode }
            })
          )
        }
      }
      
      return typeof themeComponents.pre === 'function' 
        ? themeComponents.pre({ children, ...props }) 
        : React.createElement('pre', props, children)
    }
  }
}
