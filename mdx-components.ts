import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import { MDXComponents } from 'nextra/mdx-components'
import Hero from './components/Hero'
import { syntaxHighlightJson } from '@/lib/utils/syntax-highlight'
import React from 'react'

// Get the default MDX components
const themeComponents = getThemeComponents()

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
      try {
        if (children && typeof children === 'object' && 'props' in children) {
          const childProps = (children as any).props || {};
          
          if (childProps.className?.includes('language-json') && childProps.children) {
            const code = typeof childProps.children === 'string' 
              ? childProps.children 
              : Array.isArray(childProps.children) 
                ? childProps.children.join('') 
                : String(childProps.children);
            
            const highlightedCode = syntaxHighlightJson(code);
            
            return React.createElement('pre', props, 
              React.createElement('code', {
                className: childProps.className,
                dangerouslySetInnerHTML: { __html: highlightedCode }
              })
            );
          }
        }
        
        return typeof themeComponents.pre === 'function' 
          ? themeComponents.pre({ children, ...props }) 
          : React.createElement('pre', props, children);
      } catch (error) {
        console.error('Error in pre component:', error);
        return typeof themeComponents.pre === 'function' 
          ? themeComponents.pre({ children, ...props }) 
          : React.createElement('pre', props, children);
      }
    },
    
    code: ({ children, className, ...props }: any) => {
      if (className?.includes('language-json') && children) {
        try {
          const code = typeof children === 'string' 
            ? children 
            : Array.isArray(children) 
              ? children.join('') 
              : String(children);
          
          const highlightedCode = syntaxHighlightJson(code);
          
          return React.createElement('code', {
            className,
            ...props,
            dangerouslySetInnerHTML: { __html: highlightedCode }
          });
        } catch (error) {
          console.error('Error applying JSON syntax highlighting to inline code:', error);
        }
      }
      
      return typeof themeComponents.code === 'function' 
        ? themeComponents.code({ children, className, ...props }) 
        : React.createElement('code', { className, ...props }, children);
    }
  };
}
