import React from 'react'
import { LayoutProps, SlideshowProps } from './interfaces'
import { HighlightedCode } from 'codehike/code'

/**
 * Intro slide component
 */
export const Intro: React.FC<LayoutProps> = ({
  children,
  title,
  subtitle,
  background,
  duration = 5,
  transition = 'fade',
}) => {
  return (
    <div className="slide intro" style={{ background: background || '#000' }}>
      <div className="content">
        {title && <h1 className="title">{title}</h1>}
        {subtitle && <h2 className="subtitle">{subtitle}</h2>}
        <div className="body">{children}</div>
      </div>
    </div>
  )
}

/**
 * Cover slide component
 */
export const Cover: React.FC<LayoutProps> = ({
  children,
  title,
  subtitle,
  background,
  duration = 5,
  transition = 'fade',
}) => {
  return (
    <div className="slide cover" style={{ background: background || '#111' }}>
      <div className="content">
        {title && <h1 className="title">{title}</h1>}
        {subtitle && <h2 className="subtitle">{subtitle}</h2>}
        <div className="body">{children}</div>
      </div>
    </div>
  )
}

/**
 * Default slide component
 */
export const Default: React.FC<LayoutProps> = ({
  children,
  title,
  subtitle,
  background,
  duration = 5,
  transition = 'fade',
}) => {
  return (
    <div className="slide default" style={{ background: background || '#222' }}>
      <div className="content">
        {title && <h1 className="title">{title}</h1>}
        {subtitle && <h2 className="subtitle">{subtitle}</h2>}
        <div className="body">{children}</div>
      </div>
    </div>
  )
}

/**
 * Slideshow component for code animations
 */
export const Slideshow: React.FC<SlideshowProps> = ({
  children,
  title,
  code,
  steps,
  language,
  background,
  duration = 5,
  transition = 'fade',
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  React.useEffect(() => {
    if (steps.length <= 1) return;
    
    const stepDuration = duration / steps.length;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, stepDuration * 1000);
    
    return () => clearInterval(interval);
  }, [steps, duration]);

  return (
    <div className="slide slideshow" style={{ background: background || '#222' }}>
      <div className="content">
        {title && <h1 className="title">{title}</h1>}
        <div className="code-container">
          {/* Render the current code step */}
          <pre className="ch-codeblock">
            <code className={`language-${language || 'typescript'}`}>
              {steps[currentStep] || code}
            </code>
          </pre>
        </div>
        <div className="body">{children}</div>
        
        {/* Add step navigation controls */}
        {steps.length > 1 && (
          <div className="slideshow-controls">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <span>{currentStep + 1} / {steps.length}</span>
            <button 
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
