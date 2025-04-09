import React from 'react';

interface ClickableJsonCodeProps {
  code: string;
}

/**
 * Component that renders JSON with clickable links
 * This uses a different approach with React components instead of dangerouslySetInnerHTML
 */
export function ClickableJsonCode({ code }: ClickableJsonCodeProps) {
  let jsonObject;
  try {
    jsonObject = JSON.parse(code);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return <pre>{code}</pre>;
  }

  const renderJsonValue = (value: any): React.ReactNode => {
    if (typeof value === 'string') {
      if (value.match(/^https?:\/\//)) {
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="json-link"
            style={{
              color: '#60a5fa',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {value}
          </a>
        );
      }
      return <span className="text-green-300">"{value}"</span>;
    } else if (typeof value === 'number') {
      return <span className="text-cyan-300">{value}</span>;
    } else if (typeof value === 'boolean') {
      return <span className="text-yellow-300">{value.toString()}</span>;
    } else if (value === null) {
      return <span className="text-red-300">null</span>;
    } else if (Array.isArray(value)) {
      return renderJsonArray(value);
    } else if (typeof value === 'object') {
      return renderJsonObject(value);
    }
    return String(value);
  };

  const renderJsonObject = (obj: Record<string, any>): React.ReactNode => {
    const entries = Object.entries(obj);
    if (entries.length === 0) return <span className="text-white">{'{}'}</span>;

    return (
      <>
        <span className="text-white">{'{'}</span>
        <div style={{ marginLeft: '20px' }}>
          {entries.map(([key, value], index) => (
            <div key={key}>
              <span className="text-blue-300">"{key}"</span>
              <span className="text-white">: </span>
              {renderJsonValue(value)}
              {index < entries.length - 1 && <span className="text-white">,</span>}
            </div>
          ))}
        </div>
        <span className="text-white">{'}'}</span>
      </>
    );
  };

  const renderJsonArray = (arr: any[]): React.ReactNode => {
    if (arr.length === 0) return <span className="text-white">[]</span>;

    return (
      <>
        <span className="text-white">{'['}</span>
        <div style={{ marginLeft: '20px' }}>
          {arr.map((item, index) => (
            <div key={index}>
              {renderJsonValue(item)}
              {index < arr.length - 1 && <span className="text-white">,</span>}
            </div>
          ))}
        </div>
        <span className="text-white">{']'}</span>
      </>
    );
  };

  return (
    <pre className="language-json">
      <code className="language-json has-clickable-links">
        {renderJsonObject(jsonObject)}
      </code>
    </pre>
  );
}
