"use client"

import React, { useEffect, useState, memo } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import FloatingLeaf for better performance
const FloatingLeaf = dynamic(() => import('./FloatingLeaf'), {
  ssr: false,
  loading: () => null
})

interface LazyFloatingLeavesProps {
  obstacles: Array<{
    x: number
    y: number
    width: number
    height: number
    type?: 'rect' | 'circle'
    radius?: number
  }>
}

const LazyFloatingLeaves: React.FC<LazyFloatingLeavesProps> = memo(({ obstacles }) => {
  const [shouldRender, setShouldRender] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Render leaves immediately
    setShouldRender(true)
    console.log('🍃 LazyFloatingLeaves: Setting shouldRender to true')
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  if (!shouldRender) {
    console.log('🍃 LazyFloatingLeaves: Not rendering yet, shouldRender=false')
    return null
  }
  
  // More herbs for zen rain effect
  const leafCounts = isMobile 
    ? { layer1: 6, layer2: 6, layer3: 8, layer4: 8, layer5: 8 }
    : { layer1: 10, layer2: 10, layer3: 12, layer4: 12, layer5: 12 }
    
  console.log('🍃 LazyFloatingLeaves: Rendering herbs', {
    isMobile,
    leafCounts,
    totalLeaves: Object.values(leafCounts).reduce((a, b) => a + b, 0),
    obstacleCount: obstacles.length
  })
  
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {/* Simple staggered herbs for continuous coverage */}
        {[...Array(leafCounts.layer1)].map((_, i) => (
          <FloatingLeaf key={`leaf-a-${i}`} delay={i * 0.3} index={i} obstacles={obstacles} />
        ))}
        {[...Array(leafCounts.layer2)].map((_, i) => (
          <FloatingLeaf key={`leaf-b-${i}`} delay={2 + i * 0.3} index={i + leafCounts.layer1} obstacles={obstacles} />
        ))}
        {[...Array(leafCounts.layer3)].map((_, i) => (
          <FloatingLeaf key={`leaf-c-${i}`} delay={4 + i * 0.2} index={i + leafCounts.layer1 + leafCounts.layer2} obstacles={obstacles} />
        ))}
        {[...Array(leafCounts.layer4)].map((_, i) => (
          <FloatingLeaf key={`leaf-d-${i}`} delay={6 + i * 0.2} index={i + leafCounts.layer1 + leafCounts.layer2 + leafCounts.layer3} obstacles={obstacles} />
        ))}
        {[...Array(leafCounts.layer5)].map((_, i) => (
          <FloatingLeaf key={`leaf-e-${i}`} delay={8 + i * 0.2} index={i + leafCounts.layer1 + leafCounts.layer2 + leafCounts.layer3 + leafCounts.layer4} obstacles={obstacles} />
        ))}
      </AnimatePresence>
    </div>
  )
})

LazyFloatingLeaves.displayName = 'LazyFloatingLeaves'

export default LazyFloatingLeaves