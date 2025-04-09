import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import { MDXComponents } from 'nextra/mdx-components'
import Hero from './components/Hero'
import { syntaxHighlightJson } from '@/lib/utils/syntax-highlight'
import React from 'react'

// Get the default MDX components
const themeComponents = getThemeComponents()

/**
 * Process JSON code to make URLs clickable
 */
function processJsonLinks(code: string): string {
  return code.replace(/"(https?:\/\/[^"]+)"/g, (match, url) => {
    return `"<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;cursor:pointer;pointer-events:auto;position:relative;z-index:10;">${url}</a>"`;
  });
}

/**
 * Custom MDX components for Nextra documentation
 * Overrides the default pre and code components to add clickable links in JSON code blocks
 */
export function useMDXComponents(components?: MDXComponents) {
  return {
    ...themeComponents,
    ...components,
    Hero,
    pre: ({ children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
      if (children && typeof children === 'object' && 'props' in children) {
        const childProps = (children as any).props || {};
        
        if (childProps.className?.includes('language-json') && childProps.children) {
          const code = typeof childProps.children === 'string' 
            ? childProps.children 
            : Array.isArray(childProps.children) 
              ? childProps.children.join('') 
              : String(childProps.children);
          
          const processedCode = processJsonLinks(code);
          
          const newCodeProps = {
            ...childProps,
            dangerouslySetInnerHTML: { __html: processedCode }
          };
          
          return React.createElement('pre', props, 
            React.createElement('code', newCodeProps)
          );
        }
      }
      
      return typeof themeComponents.pre === 'function' 
        ? themeComponents.pre({ children, ...props }) 
        : React.createElement('pre', props, children);
    }
  };
}
