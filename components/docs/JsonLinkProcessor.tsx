'use client';

import { useEffect } from 'react';

/**
 * Component that processes JSON code blocks to make URLs clickable
 * This runs on the client side after the page is rendered
 */
export function JsonLinkProcessor() {
  useEffect(() => {
    const processJsonCodeBlocks = () => {
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
    };
    
    processJsonCodeBlocks();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          processJsonCodeBlocks();
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return null;
}
