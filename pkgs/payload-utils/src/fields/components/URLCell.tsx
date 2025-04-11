'use client'

import React from 'react'

type URLCellProps = {
  url?: string
}

export const URLCell: React.FC<URLCellProps> = ({ url }) => {
  if (!url) return null
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="underline text-blue-500 hover:text-blue-700"
    >
      {url}
    </a>
  )
}

export default URLCell
