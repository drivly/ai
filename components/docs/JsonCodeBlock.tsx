import React from 'react';

interface JsonCodeBlockProps {
  code: string;
  className?: string;
}

/**
 * Custom component for rendering JSON code blocks with clickable links
 */
export function JsonCodeBlock({ code, className = '' }: JsonCodeBlockProps) {
  const processedCode = React.useMemo(() => {
    let escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    escapedCode = escapedCode.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls = 'text-green-300'; // string
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-blue-300'; // key
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-yellow-300'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-red-300'; // null
      } else {
        cls = 'text-cyan-300'; // number
      }
      return `<span class="${cls}">${match}</span>`;
    });
    
    escapedCode = escapedCode.replace(/<span class="text-green-300">"(https?:\/\/[^"]+)"<\/span>/g, (match, url) => {
      return `<span class="text-green-300">"<a href="${url}" target="_blank" rel="noopener noreferrer" class="json-link">${url}</a>"</span>`;
    });
    
    escapedCode = escapedCode.replace(/({|}|\[|\]|,|:)/g, (match) => {
      return `<span class="text-white">${match}</span>`;
    });
    
    return escapedCode;
  }, [code]);

  return (
    <pre className={`nextra-code-block ${className}`}>
      <code 
        className="language-json has-clickable-links"
        dangerouslySetInnerHTML={{ __html: processedCode }}
      />
    </pre>
  );
}
