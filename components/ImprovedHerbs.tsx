"use client"

import React, { useEffect, useRef } from 'react'

interface HerbData {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  type: string
  element: HTMLDivElement | null
}

// Global herb registry for collision detection
const herbRegistry: HerbData[] = []

interface HerbProps {
  index: number
  obstacles: Array<{
    x: number
    y: number
    width: number
    height: number
    type?: 'rect' | 'circle'
    radius?: number
  }>
}

// Herb SVG Component
const HerbSVG: React.FC<{ type: string; index: number }> = ({ type, index }) => {
  const colors = {
    'thai-basil': ['#22c55e', '#16a34a', '#059669'],
    'cilantro': ['#4ade80', '#22c55e', '#16a34a'],
    'lemongrass': ['#bef264', '#a3e635', '#84cc16'],
    'kaffir': ['#059669', '#047857', '#065f46']
  }
  
  const herbColors = colors[type as keyof typeof colors] || colors['thai-basil']
  
  if (type === 'lemongrass') {
    return (
      <svg width="24" height="65" viewBox="0 0 24 65" fill="none" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}>
        <path d="M12 0 C11.8 8 11.5 18 11.2 28 C11 38 10.8 48 11 56 C11.2 60 11.5 63 12 65 C12.5 63 12.8 60 13 56 C13.2 48 13 38 12.8 28 C12.5 18 12.2 8 12 0" fill={herbColors[0]} />
        <path d="M7 4 C6.5 12 6 22 5.5 32 C5 42 4.8 52 5.2 58 C5.5 62 6 64 6.5 65 C7 64 7.2 62 7.5 58 C7.8 52 8 42 7.8 32 C7.5 22 7.2 12 7 4" fill={herbColors[1]} opacity="0.9" />
        <path d="M17 3 C16.8 11 16.5 21 16.5 31 C16.5 41 16.8 51 17.2 57 C17.5 61 18 63 18.5 64 C19 63 19.2 61 19.5 57 C19.8 51 20 41 19.8 31 C19.5 21 19 11 17 3" fill={herbColors[2]} opacity="0.85" />
      </svg>
    )
  } else if (type === 'kaffir') {
    return (
      <svg width="32" height="46" viewBox="0 0 32 46" fill="none" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}>
        <path d="M16 2 C10 2 6 6 5 11 C4 16 6 20 10 22 C12 22.5 14 22.5 16 22 C16.5 21.8 17 21.5 17.5 21 C18 21.5 18.5 21.8 19 22 C21 22.5 23 22.5 25 22 C29 20 31 16 30 11 C29 6 25 2 19 2" fill={herbColors[0]} />
        <path d="M16 22 C15.5 22 15 22.2 14.5 22.5 C14 22.8 13.5 23 13 23.5 C10 25 6 29 5 34 C4 39 6 43 11 45 C14 46 16 46 16 46 C16 46 18 46 21 45 C26 43 28 39 27 34 C26 29 22 25 19 23.5 C18.5 23 18 22.8 17.5 22.5 C17 22.2 16.5 22 16 22" fill={herbColors[0]} />
        <path d="M16 2 C16 12 16 22 16 22 C16 22 16 34 16 46" stroke={herbColors[2]} strokeWidth="1" opacity="0.7" />
      </svg>
    )
  } else if (type === 'cilantro') {
    return (
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}>
        <path d="M14 28 C11 28 9 26 8 23 C7 20 8 18 10 16 C12 15 14 15 16 16 C18 15 20 15 22 16 C24 18 25 20 24 23 C23 26 21 28 18 28 C17 28 16 28 14 28" fill={herbColors[0]} />
        <path d="M8 20 C5 20 3 18 2 15 C1 12 2 10 4 8 C6 7 8 7 10 8 C12 10 13 12 12 15 C11 18 9 20 8 20" fill={herbColors[0]} />
        <path d="M20 20 C23 20 25 18 26 15 C27 12 26 10 24 8 C22 7 20 7 18 8 C16 10 15 12 16 15 C17 18 19 20 20 20" fill={herbColors[0]} />
        <path d="M10 12 C8 12 6 10 5 8 C4 6 5 4 7 3 C9 2 11 2 12 3 C13 4 14 6 13 8 C12 10 11 12 10 12" fill={herbColors[0]} opacity="0.9" />
        <path d="M18 12 C20 12 22 10 23 8 C24 6 23 4 21 3 C19 2 17 2 16 3 C15 4 14 6 15 8 C16 10 17 12 18 12" fill={herbColors[0]} opacity="0.9" />
      </svg>
    )
  } else { // thai-basil
    return (
      <svg width="30" height="36" viewBox="0 0 30 36" fill="none" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}>
        <path d="M15 1 C10 2 6 5 4 10 C2 15 2 21 4 26 C6 31 10 34 15 36 C20 34 24 31 26 26 C28 21 28 15 26 10 C24 5 20 2 15 1" fill={herbColors[0]} />
        <path d="M15 1 L15 36" stroke={herbColors[2]} strokeWidth="0.8" opacity="0.7" />
        <path d="M15 6 C11 7 8 9 6 11 M15 11 C11 12 8 14 6 16 M15 16 C11 17 8 19 6 21 M15 21 C11 22 8 24 6 26 M15 26 C11 27 8 29 6 31" stroke={herbColors[2]} strokeWidth="0.5" opacity="0.5" />
        <path d="M15 6 C19 7 22 9 24 11 M15 11 C19 12 22 14 24 16 M15 16 C19 17 22 19 24 21 M15 21 C19 22 22 24 24 26 M15 26 C19 27 22 29 24 31" stroke={herbColors[2]} strokeWidth="0.5" opacity="0.5" />
        <circle cx="15" cy="3" r="0.6" fill="#9333ea" opacity="0.7" />
        <circle cx="14" cy="5" r="0.5" fill="#9333ea" opacity="0.6" />
        <circle cx="16" cy="5" r="0.5" fill="#9333ea" opacity="0.6" />
      </svg>
    )
  }
}

const ImprovedHerb: React.FC<HerbProps> = ({ index, obstacles }) => {
  const leafRef = useRef<HTMLDivElement>(null)
  const herbDataRef = useRef<HerbData | null>(null)
  const [leafType, setLeafType] = React.useState('')
  
  useEffect(() => {
    if (!leafRef.current) return
    
    // Herb configuration
    const types = ['thai-basil', 'cilantro', 'lemongrass', 'kaffir']
    const typeIndex = Math.floor(Math.random() * types.length)
    const selectedType = types[typeIndex]
    setLeafType(selectedType)
    
    const size = 0.6 + Math.random() * 0.4
    const speed = 1.5 + Math.random() * 1
    const swayAmount = 30 + Math.random() * 20
    const swaySpeed = 0.001 + Math.random() * 0.001
    
    // Starting position - randomize columns
    const screenWidth = window.innerWidth
    const columnWidth = screenWidth / 10
    const randomColumn = Math.floor(Math.random() * 10)
    let x = randomColumn * columnWidth + columnWidth / 2 + (Math.random() - 0.5) * columnWidth * 0.5
    let y = -100 - Math.random() * 200
    let vx = 0
    let vy = 0
    
    // Register this herb
    const herbData: HerbData = {
      x, y, vx, vy, size,
      type: selectedType,
      element: leafRef.current
    }
    herbDataRef.current = herbData
    herbRegistry[index] = herbData
    
    const startTime = Date.now()
    let mouseX = 0
    let mouseY = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    const animate = () => {
      if (!herbDataRef.current) return
      
      const elapsed = Date.now() - startTime
      const herb = herbDataRef.current
      
      // Apply gravity
      herb.vy += speed * 0.016 // 60fps assumption
      
      // Apply velocity
      herb.x += herb.vx
      herb.y += herb.vy
      
      // Enhanced damping to prevent shaking
      herb.vx *= 0.95
      herb.vy *= 0.98
      
      // Stop tiny movements completely
      if (Math.abs(herb.vx) < 0.05) herb.vx = 0
      if (Math.abs(herb.vy) < 0.05) herb.vy = 0
      
      // Gentle sway
      const swayX = Math.sin(elapsed * swaySpeed) * swayAmount
      
      // Mouse repulsion
      const dx = herb.x - mouseX
      const dy = herb.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100 && distance > 0) {
        const force = (1 - distance / 100) * 3
        herb.vx += (dx / distance) * force
        herb.vy += (dy / distance) * force
      }
      
      // Reset when off screen
      if (herb.y > window.innerHeight + 100) {
        herb.y = -100 - Math.random() * 200
        const newColumn = Math.floor(Math.random() * 10)
        herb.x = newColumn * columnWidth + columnWidth / 2 + (Math.random() - 0.5) * columnWidth * 0.5
        herb.vx = 0
        herb.vy = 0
      }
      
      // Herb-to-herb collision
      const herbRadius = 20
      for (let i = 0; i < herbRegistry.length; i++) {
        if (i === index || !herbRegistry[i]) continue
        
        const other = herbRegistry[i]
        const dx = herb.x - other.x
        const dy = herb.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < herbRadius * 2 && distance > 0) {
          // Normalize collision vector
          const nx = dx / distance
          const ny = dy / distance
          
          // Separate herbs
          const overlap = herbRadius * 2 - distance
          herb.x += nx * overlap * 0.5
          herb.y += ny * overlap * 0.5
          other.x -= nx * overlap * 0.5
          other.y -= ny * overlap * 0.5
          
          // Calculate relative velocity
          const dvx = herb.vx - other.vx
          const dvy = herb.vy - other.vy
          const dvDotN = dvx * nx + dvy * ny
          
          // Don't resolve if velocities are separating
          if (dvDotN > 0) {
            // Apply impulse
            const restitution = 0.6
            const impulse = 2 * dvDotN / 2 // mass = 1 for both
            
            herb.vx -= impulse * nx * restitution
            herb.vy -= impulse * ny * restitution
            other.vx += impulse * nx * restitution
            other.vy += impulse * ny * restitution
          }
        }
      }
      
      let finalX = herb.x + swayX
      let finalY = herb.y
      
      // Check obstacles collision
      for (const obstacle of obstacles) {
        if (obstacle.type === 'circle' && obstacle.radius) {
          const centerX = obstacle.x + obstacle.radius
          const centerY = obstacle.y + obstacle.radius
          const dx = finalX - centerX
          const dy = finalY - centerY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < obstacle.radius + 50) {
            const normalX = distance > 0 ? dx / distance : 1
            const normalY = distance > 0 ? dy / distance : 0
            
            finalX = centerX + normalX * (obstacle.radius + 55)
            finalY = centerY + normalY * (obstacle.radius + 55)
            
            const dotProduct = herb.vx * normalX + herb.vy * normalY
            if (dotProduct < 0) {
              herb.vx -= 2 * dotProduct * normalX * 0.7
              herb.vy -= 2 * dotProduct * normalY * 0.7
            }
          }
        } else if (!obstacle.type || obstacle.type === 'rect') {
          const herbRadius = 30
          const closestX = Math.max(obstacle.x, Math.min(finalX, obstacle.x + obstacle.width))
          const closestY = Math.max(obstacle.y, Math.min(finalY, obstacle.y + obstacle.height))
          
          const dx = finalX - closestX
          const dy = finalY - closestY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < herbRadius) {
            const leftDist = Math.abs(finalX - obstacle.x)
            const rightDist = Math.abs(finalX - (obstacle.x + obstacle.width))
            const topDist = Math.abs(finalY - obstacle.y)
            const bottomDist = Math.abs(finalY - (obstacle.y + obstacle.height))
            
            const minDist = Math.min(leftDist, rightDist, topDist, bottomDist)
            
            if (minDist === leftDist) {
              herb.vx = Math.max(Math.abs(herb.vx) * 0.6, 0.5)
              finalX = obstacle.x - herbRadius
            } else if (minDist === rightDist) {
              herb.vx = Math.min(-Math.abs(herb.vx) * 0.6, -0.5)
              finalX = obstacle.x + obstacle.width + herbRadius
            } else if (minDist === topDist) {
              herb.vy = -Math.abs(herb.vy) * 0.3 - 1
              finalY = obstacle.y - herbRadius
            } else {
              herb.vy = Math.min(-Math.abs(herb.vy) * 0.6, -0.5)
              finalY = obstacle.y + obstacle.height + herbRadius
            }
          }
        }
      }
      
      if (leafRef.current) {
        leafRef.current.style.transform = `translate(${finalX}px, ${finalY}px) scale(${size})`
        leafRef.current.style.opacity = '0.7'
        
        herb.x = finalX - swayX
        herb.y = finalY
      }
      
      requestAnimationFrame(animate)
    }
    
    // Start with randomized delay
    setTimeout(() => {
      animate()
    }, Math.random() * 8000)
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      delete herbRegistry[index]
    }
  }, [index, obstacles])
  
  const herbDimensions = {
    'lemongrass': { width: 24, height: 65 },
    'kaffir': { width: 32, height: 46 },
    'cilantro': { width: 28, height: 32 },
    'thai-basil': { width: 30, height: 36 }
  }
  
  const dimensions = herbDimensions[leafType as keyof typeof herbDimensions] || herbDimensions['thai-basil']
  
  return (
    <div 
      ref={leafRef}
      className="absolute"
      style={{
        left: 0,
        top: 0,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        opacity: 0.7,
        transition: 'opacity 0.5s',
        pointerEvents: 'none'
      }}
    >
      <HerbSVG type={leafType} index={index} />
    </div>
  )
}

const ImprovedHerbs: React.FC<{ obstacles: any[] }> = ({ obstacles }) => {
  const [isMobile, setIsMobile] = React.useState(false)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const herbCount = isMobile ? 30 : 50
  
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {[...Array(herbCount)].map((_, i) => (
        <ImprovedHerb key={`herb-${i}`} index={i} obstacles={obstacles} />
      ))}
    </div>
  )
}

export default ImprovedHerbs