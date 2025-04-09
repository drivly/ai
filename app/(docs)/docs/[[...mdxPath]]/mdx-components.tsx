'use client';

import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';
import { MDXComponents } from 'nextra/mdx-components';
import React, { useEffect } from 'react';

/**
 * Process JSON code blocks to make URLs clickable
 */
function processJsonLinks() {
  const codeBlocks = document.querySelectorAll('pre code.language-json');
  
  codeBlocks.forEach((codeBlock) => {
    const html = codeBlock.innerHTML;
    
    const processedHtml = html.replace(
      /"(https?:\/\/[^"]+)"/g, 
      (match, url) => {
        return `"<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;cursor:pointer;pointer-events:auto;position:relative;z-index:10;">${url}</a>"`;
      }
    );
    
    if (html !== processedHtml) {
      codeBlock.innerHTML = processedHtml;
    }
  });
}

/**
 * Custom MDX components for Nextra documentation
 * Includes client-side processing of JSON code blocks to add clickable links
 */
export function useMDXComponents(components?: MDXComponents) {
  const themeComponents = getThemeComponents();
  
  useEffect(() => {
    processJsonLinks();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          processJsonLinks();
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return {
    ...themeComponents,
    ...components,
  };
}
