"use client"

import React, { useEffect, useRef } from 'react'

interface HerbData {
  x: number
  y: number
  baseX: number // Original X position for swaying
  size: number
  type: string
  element: HTMLDivElement | null
  swayPhase: number // Individual phase for natural variation
  swayAmplitude: number
  swaySpeed: number
  fallSpeed: number
  rotation: number
  opacity: number
  velocityX?: number // For smooth push-around physics
  velocityY?: number // For smooth push-around physics
  angularVelocity?: number // For rotational physics
}

interface HerbProps {
  index: number
}

// Herb SVG Component with zen colors
const HerbSVG: React.FC<{ type: string }> = ({ type }) => {
  const colors = {
    'thai-basil': ['#22c55e', '#16a34a', '#059669'],
    'cilantro': ['#4ade80', '#22c55e', '#16a34a'],
    'lemongrass': ['#bef264', '#a3e635', '#84cc16'],
    'kaffir': ['#059669', '#047857', '#065f46']
  }
  
  const herbColors = colors[type as keyof typeof colors] || colors['thai-basil']
  
  if (type === 'lemongrass') {
    return (
      <svg width="24" height="65" viewBox="0 0 24 65" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
        <path d="M12 0 C11.8 8 11.5 18 11.2 28 C11 38 10.8 48 11 56 C11.2 60 11.5 63 12 65 C12.5 63 12.8 60 13 56 C13.2 48 13 38 12.8 28 C12.5 18 12.2 8 12 0" fill={herbColors[0]} />
        <path d="M7 4 C6.5 12 6 22 5.5 32 C5 42 4.8 52 5.2 58 C5.5 62 6 64 6.5 65 C7 64 7.2 62 7.5 58 C7.8 52 8 42 7.8 32 C7.5 22 7.2 12 7 4" fill={herbColors[1]} opacity="0.9" />
        <path d="M17 3 C16.8 11 16.5 21 16.5 31 C16.5 41 16.8 51 17.2 57 C17.5 61 18 63 18.5 64 C19 63 19.2 61 19.5 57 C19.8 51 20 41 19.8 31 C19.5 21 19 11 17 3" fill={herbColors[2]} opacity="0.85" />
      </svg>
    )
  } else if (type === 'kaffir') {
    return (
      <svg width="32" height="46" viewBox="0 0 32 46" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
        <path d="M16 2 C10 2 6 6 5 11 C4 16 6 20 10 22 C12 22.5 14 22.5 16 22 C16.5 21.8 17 21.5 17.5 21 C18 21.5 18.5 21.8 19 22 C21 22.5 23 22.5 25 22 C29 20 31 16 30 11 C29 6 25 2 19 2" fill={herbColors[0]} />
        <path d="M16 22 C15.5 22 15 22.2 14.5 22.5 C14 22.8 13.5 23 13 23.5 C10 25 6 29 5 34 C4 39 6 43 11 45 C14 46 16 46 16 46 C16 46 18 46 21 45 C26 43 28 39 27 34 C26 29 22 25 19 23.5 C18.5 23 18 22.8 17.5 22.5 C17 22.2 16.5 22 16 22" fill={herbColors[0]} />
        <path d="M16 2 C16 12 16 22 16 22 C16 22 16 34 16 46" stroke={herbColors[2]} strokeWidth="1" opacity="0.7" />
      </svg>
    )
  } else if (type === 'cilantro') {
    return (
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
        <path d="M14 28 C11 28 9 26 8 23 C7 20 8 18 10 16 C12 15 14 15 16 16 C18 15 20 15 22 16 C24 18 25 20 24 23 C23 26 21 28 18 28 C17 28 16 28 14 28" fill={herbColors[0]} />
        <path d="M8 20 C5 20 3 18 2 15 C1 12 2 10 4 8 C6 7 8 7 10 8 C12 10 13 12 12 15 C11 18 9 20 8 20" fill={herbColors[0]} />
        <path d="M20 20 C23 20 25 18 26 15 C27 12 26 10 24 8 C22 7 20 7 18 8 C16 10 15 12 16 15 C17 18 19 20 20 20" fill={herbColors[0]} />
        <path d="M10 12 C8 12 6 10 5 8 C4 6 5 4 7 3 C9 2 11 2 12 3 C13 4 14 6 13 8 C12 10 11 12 10 12" fill={herbColors[0]} opacity="0.9" />
        <path d="M18 12 C20 12 22 10 23 8 C24 6 23 4 21 3 C19 2 17 2 16 3 C15 4 14 6 15 8 C16 10 17 12 18 12" fill={herbColors[0]} opacity="0.9" />
      </svg>
    )
  } else { // thai-basil
    return (
      <svg width="30" height="36" viewBox="0 0 30 36" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
        <path d="M15 1 C10 2 6 5 4 10 C2 15 2 21 4 26 C6 31 10 34 15 36 C20 34 24 31 26 26 C28 21 28 15 26 10 C24 5 20 2 15 1" fill={herbColors[0]} />
        <path d="M15 1 L15 36" stroke={herbColors[2]} strokeWidth="0.8" opacity="0.7" />
        <path d="M15 6 C11 7 8 9 6 11 M15 11 C11 12 8 14 6 16 M15 16 C11 17 8 19 6 21 M15 21 C11 22 8 24 6 26 M15 26 C11 27 8 29 6 31" stroke={herbColors[2]} strokeWidth="0.5" opacity="0.5" />
        <path d="M15 6 C19 7 22 9 24 11 M15 11 C19 12 22 14 24 16 M15 16 C19 17 22 19 24 21 M15 21 C19 22 22 24 24 26 M15 26 C19 27 22 29 24 31" stroke={herbColors[2]} strokeWidth="0.5" opacity="0.5" />
      </svg>
    )
  }
}

const ZenHerb: React.FC<HerbProps> = ({ index }) => {
  const leafRef = useRef<HTMLDivElement>(null)
  const herbDataRef = useRef<HerbData | null>(null)
  const [leafType, setLeafType] = React.useState('')
  const animationRef = useRef<number>()
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const touchX = useRef(0)
  const touchY = useRef(0)
  const isTouchDevice = useRef(false)
  
  useEffect(() => {
    if (!leafRef.current) return
    
    // Herb type selection
    const types = ['thai-basil', 'cilantro', 'lemongrass', 'kaffir']
    const typeIndex = index % types.length
    const selectedType = types[typeIndex]
    setLeafType(selectedType)
    
    // Size variation for depth
    const size = 0.5 + Math.random() * 0.3 // Smaller range for subtlety
    
    // Distribute herbs across the screen width
    const screenWidth = window.innerWidth
    const section = index % 8 // More sections for even distribution
    const sectionWidth = screenWidth / 8
    const x = section * sectionWidth + Math.random() * sectionWidth
    
    // Stagger initial Y positions
    const y = -100 - (index * 40) - Math.random() * 200
    
    // Individual sway properties for natural variation
    const swayPhase = Math.random() * Math.PI * 2
    const swayAmplitude = 40 + Math.random() * 60 // Much larger sway amplitude for dramatic effect
    const swaySpeed = 0.0003 + Math.random() * 0.0002 // Very slow for zen effect
    const fallSpeed = 0.15 + Math.random() * 0.1 // Extremely slow falling
    
    // Initialize herb data
    const herbData: HerbData = {
      x,
      y,
      baseX: x,
      size,
      type: selectedType,
      element: leafRef.current,
      swayPhase,
      swayAmplitude,
      swaySpeed,
      fallSpeed,
      rotation: -5 + Math.random() * 10, // Slight initial rotation
      opacity: 0
    }
    herbDataRef.current = herbData
    
    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
    }
    
    // Touch tracking
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchX.current = e.touches[0].clientX
        touchY.current = e.touches[0].clientY
        isTouchDevice.current = true
      }
    }
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchX.current = e.touches[0].clientX
        touchY.current = e.touches[0].clientY
        isTouchDevice.current = true
      }
    }
    
    const handleTouchEnd = () => {
      // Reset touch position when touch ends
      touchX.current = -1000
      touchY.current = -1000
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    const startTime = Date.now()
    
    const animate = () => {
      if (!herbDataRef.current || !leafRef.current) return
      
      const herb = herbDataRef.current
      const elapsed = Date.now() - startTime
      
      // Mouse/Touch interaction - calculate distance and apply force
      const interactionX = isTouchDevice.current && touchX.current !== -1000 ? touchX.current : mouseX.current
      const interactionY = isTouchDevice.current && touchY.current !== -1000 ? touchY.current : mouseY.current
      const dx = herb.x - interactionX
      const dy = herb.y - interactionY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      let mouseForceX = 0
      let mouseForceY = 0
      let mouseRotation = 0
      
      // Initialize velocity and angular velocity for smooth movement
      if (!herb.velocityX) herb.velocityX = 0
      if (!herb.velocityY) herb.velocityY = 0
      if (!herb.angularVelocity) herb.angularVelocity = 0
      
      // Adjust interaction radius for touch (larger for better mobile UX)
      const interactionRadius = isTouchDevice.current ? 220 : 180
      
      if (distance < interactionRadius && distance > 0) {
        // Enhanced physics with 360-degree movement
        const normalizedDist = distance / interactionRadius
        const influence = Math.pow(1 - normalizedDist, 1.5) // Stronger force gradient
        
        // Calculate push direction (away from interaction point) for true 360-degree movement
        const angle = Math.atan2(dy, dx)
        
        // Apply stronger force for touch interactions
        const forceMultiplier = influence * (isTouchDevice.current ? 10.0 : 8.0)
        
        // Apply force to velocity - full 360-degree movement
        herb.velocityX += Math.cos(angle) * forceMultiplier
        herb.velocityY += Math.sin(angle) * forceMultiplier
        
        // Turbulence and lift effects based on movement speed
        const speed = Math.sqrt(herb.velocityX * herb.velocityX + herb.velocityY * herb.velocityY)
        if (speed > 5) {
          // Add turbulence for realistic air interaction
          herb.velocityX += (Math.random() - 0.5) * influence * 2
          herb.velocityY += (Math.random() - 0.5) * influence * 2 - influence * 2 // Upward lift
        }
        
        // Angular velocity based on tangential force (for spinning)
        const tangentialForce = Math.sin(angle) * herb.velocityX - Math.cos(angle) * herb.velocityY
        herb.angularVelocity += tangentialForce * 0.5 * influence
        
        // Direct rotation influence from mouse movement
        mouseRotation = (herb.velocityX * 4 + herb.velocityY * 2) * influence
      }
      
      // Apply velocity with realistic physics
      mouseForceX = herb.velocityX
      mouseForceY = herb.velocityY
      
      // Air resistance with different coefficients for X and Y
      herb.velocityX *= 0.92 // Less horizontal damping for floatier movement
      herb.velocityY *= 0.89 // More vertical damping
      
      // Angular velocity damping
      herb.angularVelocity *= 0.85
      
      // Gravity with terminal velocity
      const gravityForce = 0.4
      const terminalVelocity = 15
      if (herb.velocityY < terminalVelocity) {
        herb.velocityY += gravityForce
      }
      
      // Update rotation based on angular velocity
      herb.rotation += herb.angularVelocity
      
      // Clamp velocities for stability
      herb.velocityX = Math.max(-80, Math.min(80, herb.velocityX))
      herb.velocityY = Math.max(-60, Math.min(60, herb.velocityY))
      herb.angularVelocity = Math.max(-20, Math.min(20, herb.angularVelocity))
      
      // Zen-like gentle swaying - multiple sine waves for organic motion
      const primarySway = Math.sin(elapsed * herb.swaySpeed + herb.swayPhase) * herb.swayAmplitude
      const secondarySway = Math.sin(elapsed * herb.swaySpeed * 1.3 + herb.swayPhase + Math.PI/3) * herb.swayAmplitude * 0.5
      const breathingSway = Math.sin(elapsed * herb.swaySpeed * 0.5) * herb.swayAmplitude * 0.3
      const microSway = Math.sin(elapsed * herb.swaySpeed * 2.1 + herb.swayPhase - Math.PI/4) * herb.swayAmplitude * 0.15
      
      const totalSway = primarySway + secondarySway + breathingSway + microSway
      
      // Update positions based on velocities (true physics simulation)
      herb.x += mouseForceX // Add velocity to current position
      herb.y += herb.fallSpeed + mouseForceY // Add fall speed and velocity
      
      // Keep herbs on screen horizontally with bounce
      if (herb.x < -50) {
        herb.x = -50
        herb.velocityX = Math.abs(herb.velocityX) * 0.5 // Bounce back with damping
      } else if (herb.x > window.innerWidth + 50) {
        herb.x = window.innerWidth + 50
        herb.velocityX = -Math.abs(herb.velocityX) * 0.5 // Bounce back with damping
      }
      
      // Add swaying effect on top of the physics position
      const swayX = herb.x + totalSway
      
      // More dramatic rotation tied to movement
      const totalRotation = herb.rotation + (totalSway / herb.swayAmplitude) * 15 + mouseRotation
      
      // Smooth fade in/out
      if (herb.y > -50 && herb.y < window.innerHeight - 50) {
        herb.opacity = Math.min(0.7, herb.opacity + 0.01) // Fade in to 70% opacity for realistic appearance
      } else if (herb.y >= window.innerHeight - 50) {
        herb.opacity = Math.max(0, herb.opacity - 0.02) // Fade out
      }
      
      // Reset when completely off screen
      if (herb.y > window.innerHeight + 100) {
        herb.y = -100 - Math.random() * 100
        herb.x = Math.random() * window.innerWidth
        herb.baseX = herb.x
        herb.velocityX = 0
        herb.velocityY = 0
        herb.angularVelocity = 0
        herb.opacity = 0
      }
      
      // Apply transform with 3D acceleration using swayed position
      leafRef.current.style.transform = `translate3d(${swayX}px, ${herb.y}px, 0) rotate(${totalRotation}deg) scale(${herb.size})`
      leafRef.current.style.opacity = String(herb.opacity)
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Start animation with staggered delay
    const startDelay = (index * 300) % 5000 + Math.random() * 2000
    const timeoutId = setTimeout(() => {
      animate()
    }, startDelay)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      clearTimeout(timeoutId)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [index])
  
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
        opacity: 0,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d'
      }}
    >
      <HerbSVG type={leafType} />
    </div>
  )
}

const ZenHerbs: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const herbCount = isMobile ? 20 : 35 // Balanced for performance and effect
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10"
      style={{ touchAction: 'none' }} // Prevent default touch behaviors that might interfere
    >
      {[...Array(herbCount)].map((_, i) => (
        <ZenHerb key={`zen-herb-${i}`} index={i} />
      ))}
    </div>
  )
}

export default ZenHerbs