import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import { MDXComponents } from 'nextra/mdx-components'
import Hero from './components/Hero'
import { syntaxHighlightJson } from '@/lib/utils/syntax-highlight'
import React from 'react'

// Get the default MDX components
const themeComponents = getThemeComponents()

type CodeProps = {
  className?: string
  children?: string | string[]
}

type MDXCodeElement = {
  type: 'code' | string
  props: CodeProps
}

// Merge components
export function useMDXComponents(components?: MDXComponents) {
  try {
    return {
      ...themeComponents,
      ...components,
      Hero,
      pre: ({ children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
        try {
          if (children && typeof children === 'object') {
            
            let codeElement = null;
            
            if ('type' in children && 
                ((children as any).type === 'code' || (children as any).type === 'code') && 
                'props' in children) {
              codeElement = children as MDXCodeElement;
            } 
            else if ('props' in children && 'children' in (children as any).props) {
              const childrenProps = (children as any).props;
              
              if (Array.isArray(childrenProps.children)) {
                const codeChild = childrenProps.children.find(
                  (child: any) => child && typeof child === 'object' && 'type' in child && 
                  (child.type === 'code' || child.type === 'code')
                );
                if (codeChild) {
                  codeElement = codeChild as MDXCodeElement;
                }
              } else if (childrenProps.children && 
                         typeof childrenProps.children === 'object' && 
                         'type' in childrenProps.children && 
                         (childrenProps.children.type === 'code' || childrenProps.children.type === 'code')) {
                codeElement = childrenProps.children as MDXCodeElement;
              }
            }
            
            if (codeElement && 
                codeElement.props && 
                codeElement.props.className && 
                codeElement.props.className.includes('language-json') && 
                codeElement.props.children) {
              
              try {
                const code = typeof codeElement.props.children === 'string' 
                  ? codeElement.props.children 
                  : Array.isArray(codeElement.props.children) 
                    ? codeElement.props.children.join('') 
                    : String(codeElement.props.children);
                
                const highlightedCode = syntaxHighlightJson(code);
                
                return React.createElement('pre', props, 
                  React.createElement('code', {
                    className: codeElement.props.className,
                    dangerouslySetInnerHTML: { __html: highlightedCode }
                  })
                );
              } catch (error) {
                console.error('Error applying JSON syntax highlighting:', error);
              }
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
        if (className === 'language-json' && children) {
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
  } catch (error) {
    console.error('Error in useMDXComponents:', error);
    return { ...themeComponents, ...components };
  }
}
