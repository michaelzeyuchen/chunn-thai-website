"use client"

import React from 'react'
import FloatingLeaf from './FloatingLeaf'

interface SimpleLeavesProps {
  obstacles: Array<{
    x: number
    y: number
    width: number
    height: number
    type?: 'rect' | 'circle'
    radius?: number
  }>
}

const SimpleLeaves: React.FC<SimpleLeavesProps> = ({ obstacles }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Just render a few herbs directly */}
      {[...Array(10)].map((_, i) => (
        <FloatingLeaf key={`simple-leaf-${i}`} delay={i * 0.5} index={i} obstacles={obstacles} />
      ))}
    </div>
  )
}

export default SimpleLeaves