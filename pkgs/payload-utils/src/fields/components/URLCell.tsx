'use client'

import React from 'react'

type URLCellProps = {
  cellData?: string
  field: {
    name: string
  }
  colIndex: number
  rowData: Record<string, unknown>
  className?: string
}

export const URLCell: React.FC<URLCellProps> = ({ cellData, className }) => {
  if (!cellData) return null

  return (
    <a href={cellData} target='_blank' rel='noopener noreferrer' className={`text-blue-500 underline hover:text-blue-700 ${className || ''}`}>
      {cellData}
    </a>
  )
}

export default URLCell
