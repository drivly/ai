'use client'

export const Root = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

export const PanelRoot = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

export const ResizableRoot = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

export const Trigger = ({ children, ...props }) => {
  return <button {...props}>{children}</button>
}

export const Modal = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

export const Panel = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

export const Resizable = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

export const Header = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

export const Content = ({ children, ...props }) => {
  return <div {...props}>{children || null}</div>
}
