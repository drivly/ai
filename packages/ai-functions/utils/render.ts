import { renderToStaticMarkup } from 'react-dom/server'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import React from 'react'
import { dump } from 'js-yaml'

// Helper function to serialize objects
const serializeValue = (value: unknown): string => {
  // Handle null/undefined
  if (value == null) return String(value);
  
  // Handle Symbols
  if (typeof value === 'symbol') {
    return value.toString();
  }
  
  // Handle objects
  if (typeof value === 'object') {
    // Filter out React internal properties and clean up the object
    const cleanObject = JSON.parse(JSON.stringify(value, (key, value) => {
      if (key === '$$typeof' || key === '_owner' || key === '_store') {
        return undefined;
      }
      return typeof value === 'symbol' ? value.toString() : value;
    }));
    
    // For React elements, just return their children content
    if (cleanObject.type && cleanObject.props) {
      return cleanObject.props.children?.map((child: unknown) => 
        typeof child === 'object' 
          ? dump(child, { lineWidth: -1, flowLevel: 0 })
          : String(child)
      ).join('') || '';
    }
    
    return dump(cleanObject, { lineWidth: 1000 });
  }
  
  return String(value);
}

export const render = async (component: React.ReactElement<any>): Promise<string> => {
  // First, ensure children is an array and handle any raw objects
  const children = Array.isArray(component.props.children) 
    ? component.props.children 
    : [component.props.children];

  // Process each child, converting objects to strings before React tries to handle them
  const processedChildren = children.map((child: unknown) => {
    if (child == null) return '';
    if (React.isValidElement(child)) return child;
    if (typeof child === 'object') return serializeValue(child);
    return String(child);
  });

  const processedComponent = React.cloneElement(component, {}, processedChildren);

  const html = renderToStaticMarkup(processedComponent)
  const processor = unified().use(rehypeParse).use(rehypeRemark).use(remarkStringify)
  const markdown = String(await processor.process(html))
  console.log(markdown)
  return markdown
}
