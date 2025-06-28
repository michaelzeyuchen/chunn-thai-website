"use client"

import React, { useEffect, useRef } from 'react'

interface HerbData {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  mass: number
  type: string
  element: HTMLDivElement | null
  rotation: number
  angularVelocity: number
  opacity: number
  visible: boolean
  dragCoefficient: number
  restitution: number
  torque: number
}

// Global herb registry for collision detection
const herbRegistry: HerbData[] = []

// Physics constants
const GRAVITY = 9.81 * 50 // pixels per second squared (scaled for visual effect)
const AIR_DENSITY = 1.225 // kg/m³
const HERB_DENSITY = 0.3 // relative to water
const BASE_DRAG_COEFFICIENT = 1.2 // for a tumbling leaf
const ANGULAR_DAMPING = 0.98
const LINEAR_DAMPING = 0.995
const WIND_STRENGTH = 0.5
const TURBULENCE_SCALE = 0.002

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
    'thai-basil': ['#d4af37', '#b8941f', '#9c7a0f'],
    'cilantro': ['#e6c757', '#d4af37', '#b8941f'],
    'lemongrass': ['#f4e19d', '#e6c757', '#d4af37'],
    'kaffir': ['#b8941f', '#9c7a0f', '#806307']
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
        <circle cx="15" cy="3" r="0.6" fill="#f4e19d" opacity="0.9" />
        <circle cx="14" cy="5" r="0.5" fill="#f4e19d" opacity="0.8" />
        <circle cx="16" cy="5" r="0.5" fill="#f4e19d" opacity="0.8" />
      </svg>
    )
  }
}

const RealisticHerb: React.FC<HerbProps> = ({ index, obstacles }) => {
  const leafRef = useRef<HTMLDivElement>(null)
  const herbDataRef = useRef<HerbData | null>(null)
  const [leafType, setLeafType] = React.useState('')
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  
  useEffect(() => {
    if (!leafRef.current) return
    
    // Herb configuration
    const types = ['thai-basil', 'cilantro', 'lemongrass', 'kaffir']
    const typeIndex = Math.floor(Math.random() * types.length)
    const selectedType = types[typeIndex]
    setLeafType(selectedType)
    
    // Size affects mass and drag
    const size = 0.6 + Math.random() * 0.4
    const mass = size * HERB_DENSITY
    
    // Different herbs have different drag properties
    const dragModifiers = {
      'lemongrass': 0.8, // More streamlined
      'kaffir': 1.3, // Double leaves catch more air
      'cilantro': 1.1, // Complex shape
      'thai-basil': 1.0 // Standard
    }
    const dragCoefficient = BASE_DRAG_COEFFICIENT * (dragModifiers[selectedType as keyof typeof dragModifiers] || 1.0)
    
    // Starting position - randomize columns
    const screenWidth = window.innerWidth
    const columnWidth = screenWidth / 10
    const randomColumn = Math.floor(Math.random() * 10)
    let x = randomColumn * columnWidth + columnWidth / 2 + (Math.random() - 0.5) * columnWidth * 0.5
    let y = -100 - Math.random() * 200
    let vx = (Math.random() - 0.5) * 50 // Initial horizontal velocity
    let vy = 0
    let rotation = Math.random() * 360
    let angularVelocity = (Math.random() - 0.5) * 180 // degrees per second
    
    // Register this herb
    const herbData: HerbData = {
      x, y, vx, vy, size, mass,
      type: selectedType,
      element: leafRef.current,
      rotation,
      angularVelocity,
      opacity: 0.7,
      visible: true,
      dragCoefficient,
      restitution: 0.4 + Math.random() * 0.2, // 0.4-0.6 bounce
      torque: 0
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
    
    const animate = (currentTime: number) => {
      if (!herbDataRef.current || !leafRef.current) return
      
      // Calculate delta time
      const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0.016
      lastTimeRef.current = currentTime
      
      const elapsed = (currentTime - startTime) / 1000
      const herb = herbDataRef.current
      
      // Wind effect with turbulence
      const windBase = Math.sin(elapsed * 0.5) * WIND_STRENGTH
      const turbulenceX = (Math.sin(elapsed * 3.7 + herb.y * TURBULENCE_SCALE) * 0.5 + 
                          Math.sin(elapsed * 2.3 + herb.x * TURBULENCE_SCALE) * 0.3) * 30
      const turbulenceY = Math.sin(elapsed * 2.9 + herb.x * TURBULENCE_SCALE) * 10
      
      // Calculate drag force
      const velocity = Math.sqrt(herb.vx * herb.vx + herb.vy * herb.vy)
      const dragMagnitude = 0.5 * AIR_DENSITY * velocity * velocity * herb.dragCoefficient * herb.size * 0.001
      const dragX = velocity > 0 ? -(herb.vx / velocity) * dragMagnitude : 0
      const dragY = velocity > 0 ? -(herb.vy / velocity) * dragMagnitude : 0
      
      // Apply forces
      const ax = (dragX / herb.mass) + windBase + turbulenceX
      const ay = (GRAVITY + dragY / herb.mass) + turbulenceY
      
      // Update velocity and position
      herb.vx += ax * deltaTime
      herb.vy += ay * deltaTime
      herb.x += herb.vx * deltaTime
      herb.y += herb.vy * deltaTime
      
      // Update rotation with torque
      herb.torque = (herb.vx * 0.5 + turbulenceX * 0.3) * Math.sin(herb.rotation * Math.PI / 180)
      herb.angularVelocity += herb.torque * deltaTime
      herb.angularVelocity *= ANGULAR_DAMPING
      herb.rotation += herb.angularVelocity * deltaTime
      
      // Apply overall damping
      herb.vx *= LINEAR_DAMPING
      herb.vy *= LINEAR_DAMPING
      
      // Mouse repulsion with rotation effect
      const dx = herb.x - mouseX
      const dy = herb.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100 && distance > 0) {
        const force = (1 - distance / 100) * 150
        herb.vx += (dx / distance) * force * deltaTime
        herb.vy += (dy / distance) * force * deltaTime
        // Add spin based on which side of the herb the mouse is on
        const crossProduct = (mouseX - herb.x) * herb.vy - (mouseY - herb.y) * herb.vx
        herb.angularVelocity += crossProduct * 0.001 * force
      }
      
      // Reset when off screen
      if (herb.y > window.innerHeight + 100) {
        herb.y = -100 - Math.random() * 200
        const newColumn = Math.floor(Math.random() * 10)
        herb.x = newColumn * columnWidth + columnWidth / 2 + (Math.random() - 0.5) * columnWidth * 0.5
        herb.vx = (Math.random() - 0.5) * 50
        herb.vy = 0
        herb.rotation = Math.random() * 360
        herb.angularVelocity = (Math.random() - 0.5) * 180
      }
      
      // Herb-to-herb collision with realistic physics
      const herbRadius = 20 * herb.size
      for (let i = 0; i < herbRegistry.length; i++) {
        if (i === index || !herbRegistry[i]) continue
        
        const other = herbRegistry[i]
        const dx = herb.x - other.x
        const dy = herb.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = herbRadius + 20 * other.size
        
        if (distance < minDistance && distance > 0) {
          // Normalize collision vector
          const nx = dx / distance
          const ny = dy / distance
          
          // Separate herbs
          const overlap = minDistance - distance
          const totalMass = herb.mass + other.mass
          herb.x += nx * overlap * (other.mass / totalMass)
          herb.y += ny * overlap * (other.mass / totalMass)
          other.x -= nx * overlap * (herb.mass / totalMass)
          other.y -= ny * overlap * (herb.mass / totalMass)
          
          // Calculate relative velocity
          const dvx = herb.vx - other.vx
          const dvy = herb.vy - other.vy
          const dvDotN = dvx * nx + dvy * ny
          
          // Don't resolve if velocities are separating
          if (dvDotN > 0) {
            // Conservation of momentum with restitution
            const restitution = (herb.restitution + other.restitution) / 2
            const impulse = 2 * dvDotN / totalMass
            
            herb.vx -= impulse * other.mass * nx * restitution
            herb.vy -= impulse * other.mass * ny * restitution
            other.vx += impulse * herb.mass * nx * restitution
            other.vy += impulse * herb.mass * ny * restitution
            
            // Angular momentum transfer
            const impactPoint = { x: herb.x - nx * herbRadius, y: herb.y - ny * herbRadius }
            const r1x = impactPoint.x - herb.x
            const r1y = impactPoint.y - herb.y
            const r2x = impactPoint.x - other.x
            const r2y = impactPoint.y - other.y
            
            // Cross product for angular impulse
            const angularImpulse1 = (r1x * ny - r1y * nx) * impulse * other.mass * 100
            const angularImpulse2 = (r2x * ny - r2y * nx) * impulse * herb.mass * 100
            
            herb.angularVelocity += angularImpulse1 / (herb.mass * herbRadius * herbRadius)
            other.angularVelocity -= angularImpulse2 / (other.mass * 20 * other.size * 20 * other.size)
          }
        }
      }
      
      // Check obstacles collision
      for (const obstacle of obstacles) {
        if (obstacle.type === 'circle' && obstacle.radius) {
          const centerX = obstacle.x + obstacle.radius
          const centerY = obstacle.y + obstacle.radius
          const dx = herb.x - centerX
          const dy = herb.y - centerY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < obstacle.radius + herbRadius + 30) {
            const normalX = distance > 0 ? dx / distance : 1
            const normalY = distance > 0 ? dy / distance : 0
            
            herb.x = centerX + normalX * (obstacle.radius + herbRadius + 35)
            herb.y = centerY + normalY * (obstacle.radius + herbRadius + 35)
            
            const dotProduct = herb.vx * normalX + herb.vy * normalY
            if (dotProduct < 0) {
              herb.vx -= 2 * dotProduct * normalX * herb.restitution
              herb.vy -= 2 * dotProduct * normalY * herb.restitution
              
              // Spin on bounce
              const tangentX = -normalY
              const tangentY = normalX
              const tangentVelocity = herb.vx * tangentX + herb.vy * tangentY
              herb.angularVelocity += tangentVelocity * 2
            }
          }
        } else if (!obstacle.type || obstacle.type === 'rect') {
          const closestX = Math.max(obstacle.x, Math.min(herb.x, obstacle.x + obstacle.width))
          const closestY = Math.max(obstacle.y, Math.min(herb.y, obstacle.y + obstacle.height))
          
          const dx = herb.x - closestX
          const dy = herb.y - closestY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < herbRadius + 10) {
            const leftDist = Math.abs(herb.x - obstacle.x)
            const rightDist = Math.abs(herb.x - (obstacle.x + obstacle.width))
            const topDist = Math.abs(herb.y - obstacle.y)
            const bottomDist = Math.abs(herb.y - (obstacle.y + obstacle.height))
            
            const minDist = Math.min(leftDist, rightDist, topDist, bottomDist)
            
            if (minDist === leftDist) {
              herb.vx = Math.abs(herb.vx) * herb.restitution
              herb.x = obstacle.x - herbRadius - 10
              herb.angularVelocity -= herb.vy * 3
            } else if (minDist === rightDist) {
              herb.vx = -Math.abs(herb.vx) * herb.restitution
              herb.x = obstacle.x + obstacle.width + herbRadius + 10
              herb.angularVelocity += herb.vy * 3
            } else if (minDist === topDist) {
              herb.vy = -Math.abs(herb.vy) * herb.restitution
              herb.y = obstacle.y - herbRadius - 10
              herb.angularVelocity += herb.vx * 3
            } else {
              herb.vy = Math.abs(herb.vy) * herb.restitution * 0.5
              herb.y = obstacle.y + obstacle.height + herbRadius + 10
              herb.angularVelocity -= herb.vx * 3
            }
          }
        }
      }
      
      // Apply transformation
      leafRef.current.style.transform = `translate(${herb.x}px, ${herb.y}px) rotate(${herb.rotation}deg) scale(${size})`
      leafRef.current.style.opacity = String(herb.opacity)
      leafRef.current.style.visibility = herb.visible ? 'visible' : 'hidden'
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Start with randomized delay
    const startDelay = setTimeout(() => {
      lastTimeRef.current = performance.now()
      animate(performance.now())
    }, Math.random() * 8000)
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(startDelay)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
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
        visibility: 'visible',
        transition: 'none',
        pointerEvents: 'none',
        willChange: 'transform',
        transformOrigin: 'center center'
      }}
    >
      <HerbSVG type={leafType} index={index} />
    </div>
  )
}

const RealisticHerbs: React.FC<{ obstacles: any[] }> = ({ obstacles }) => {
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
        <RealisticHerb key={`herb-${i}`} index={i} obstacles={obstacles} />
      ))}
    </div>
  )
}

export default RealisticHerbs