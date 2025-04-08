'use client'

import React from 'react'
import { StoplightAPIViewer } from '@/components/StoplightAPIViewer'

export default function ReferenceAPIPage() {
  return (
    <div className="api-reference-container">
      <h1>API Reference</h1>
      <StoplightAPIViewer />
    </div>
  )
}
