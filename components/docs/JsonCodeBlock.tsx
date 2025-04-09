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
    return code.replace(/"(https?:\/\/[^"]+)"/g, (match, url) => {
      return `"<a href="${url}" target="_blank" rel="noopener noreferrer" class="json-link">${url}</a>"`;
    });
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
