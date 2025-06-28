import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// Global herb registry for collision detection
const herbRegistry: any[] = []

// Stable herb variations
const herbTypes = ['lemongrass', 'kaffir', 'cilantro', 'thai-basil'] as const
type HerbType = typeof herbTypes[number]

const HerbSVG: React.FC<{ type: HerbType; index: number }> = ({ type, index }) => {
  // Generate consistent colors based on index to prevent hydration issues
  const herbConfigs = {
    'lemongrass': {
      primary: `hsl(82, ${42 + (index % 3) * 8}%, ${45 + (index % 3) * 5}%)`,
      secondary: `hsl(85, ${35 + (index % 3) * 5}%, ${35 + (index % 3) * 3}%)`,
      path: 'M12 2C11 2 10 3 10 4L9 8L8 14L7 22L6 32L5 42L4 52L3 62C3 63 4 64 5 64C6 64 7 63 7 62L8 52L9 42L10 32L11 22L12 14L13 8L14 4C14 3 13 2 12 2Z'
    },
    'kaffir': {
      primary: `hsl(120, ${35 + (index % 3) * 10}%, ${35 + (index % 3) * 5}%)`,
      secondary: `hsl(125, ${30 + (index % 3) * 8}%, ${25 + (index % 3) * 5}%)`,
      path: 'M16 3C10 3 5 8 5 16C5 24 7 32 8 38C8 40 9 42 10 43C11 44 13 45 16 45C19 45 21 44 22 43C23 42 24 40 24 38C25 32 27 24 27 16C27 8 22 3 16 3ZM16 8C17 8 18 9 18 11L17 25C17 27 17 29 16 29C15 29 15 27 15 25L14 11C14 9 15 8 16 8Z'
    },
    'cilantro': {
      primary: `hsl(85, ${50 + (index % 3) * 10}%, ${50 + (index % 3) * 5}%)`,
      secondary: `hsl(90, ${45 + (index % 3) * 8}%, ${40 + (index % 3) * 5}%)`,
      path: 'M14 2C13 2 12 3 12 4C12 5 11 7 10 9C9 7 8 5 8 4C8 3 7 2 6 2C5 2 4 3 4 4C4 6 5 9 7 12C5 13 3 15 3 17C3 19 5 21 8 21C9 21 10 21 11 20C12 22 13 24 14 26C15 24 16 22 17 20C18 21 19 21 20 21C23 21 25 19 25 17C25 15 23 13 21 12C23 9 24 6 24 4C24 3 23 2 22 2C21 2 20 3 20 4C20 5 19 7 18 9C17 7 16 5 16 4C16 3 15 2 14 2Z'
    },
    'thai-basil': {
      primary: `hsl(140, ${38 + (index % 3) * 10}%, ${40 + (index % 3) * 5}%)`,
      secondary: `hsl(145, ${32 + (index % 3) * 8}%, ${30 + (index % 3) * 5}%)`,
      path: 'M15 2C12 2 9 4 9 7C9 8 9 9 10 10C8 11 6 13 6 16C6 19 8 21 11 22V32C11 34 12 36 15 36C18 36 19 34 19 32V22C22 21 24 19 24 16C24 13 22 11 20 10C21 9 21 8 21 7C21 4 18 2 15 2ZM15 6C16 6 17 7 17 8C17 9 16 10 15 10C14 10 13 9 13 8C13 7 14 6 15 6Z'
    }
  }
  
  const config = herbConfigs[type]
  
  return (
    <svg 
      viewBox="0 0 32 64" 
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
    >
      <defs>
        <linearGradient id={`gradient-${type}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.primary} />
          <stop offset="100%" stopColor={config.secondary} />
        </linearGradient>
      </defs>
      <path 
        d={config.path}
        fill={`url(#gradient-${type}-${index})`}
        strokeWidth="0.5"
        stroke={config.secondary}
      />
    </svg>
  )
}

// Individual Herb Component with improved collision handling
const Herb: React.FC<{ index: number; obstacles: any[] }> = ({ index, obstacles }) => {
  const leafRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  
  // Randomly assign herb type and physics properties
  const leafType = herbTypes[index % herbTypes.length]
  const size = 0.6 + Math.random() * 0.5
  const swayAmplitude = 15 + Math.random() * 25
  const swayPeriod = 6000 + Math.random() * 4000
  const fallSpeed = 0.3 + Math.random() * 0.4
  const dragCoefficient = 0.8 + Math.random() * 0.4
  
  // Initialize starting position
  const initX = Math.random() * window.innerWidth
  const initY = -100 - Math.random() * 500
  const initRotation = Math.random() * 360
  
  useEffect(() => {
    if (!leafRef.current) return
    
    // Initialize herb data with stuck prevention
    const herb = {
      x: initX,
      y: initY,
      vx: 0,
      vy: 0,
      rotation: initRotation,
      angularVelocity: (Math.random() - 0.5) * 2,
      size,
      swayAmplitude,
      swayPeriod,
      fallSpeed,
      dragCoefficient,
      visible: false,
      opacity: 0,
      // Anti-stuck properties
      stuckCounter: 0,
      lastX: initX,
      lastY: initY,
      resetCooldown: 0
    }
    
    herbRegistry[index] = herb
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    const animate = (timestamp: number) => {
      if (!leafRef.current || !herbRegistry[index]) return
      
      const deltaTime = 1 / 60
      const elapsed = timestamp
      const { x: mouseX, y: mouseY } = mouseRef.current
      
      // Wind sway calculation
      const swayPhase = (elapsed / herb.swayPeriod) * Math.PI * 2
      const swayX = Math.sin(swayPhase) * herb.swayAmplitude
      const swayAccel = Math.cos(swayPhase) * herb.swayAmplitude * 0.001
      
      // Physics updates with anti-stuck mechanisms
      herb.vx += swayAccel
      herb.vy += herb.fallSpeed * deltaTime
      
      // Apply drag
      const dragX = -herb.vx * Math.abs(herb.vx) * herb.dragCoefficient * 0.01
      const dragY = -herb.vy * Math.abs(herb.vy) * herb.dragCoefficient * 0.01
      herb.vx += dragX
      herb.vy += dragY
      
      // Update position
      const prevX = herb.x
      const prevY = herb.y
      herb.x += herb.vx * deltaTime * 60
      herb.y += herb.vy * deltaTime * 60
      
      // Check if herb is stuck (position hasn't changed much)
      const movement = Math.abs(herb.x - herb.lastX) + Math.abs(herb.y - herb.lastY)
      if (movement < 0.1 && herb.y > 0 && herb.resetCooldown <= 0) {
        herb.stuckCounter++
        if (herb.stuckCounter > 30) { // Stuck for 0.5 seconds
          // Apply random impulse to unstick
          herb.vx = (Math.random() - 0.5) * 2
          herb.vy = -Math.random() * 0.5 - 0.5
          herb.angularVelocity = (Math.random() - 0.5) * 5
          herb.stuckCounter = 0
          herb.resetCooldown = 60 // 1 second cooldown
        }
      } else {
        herb.stuckCounter = 0
      }
      
      // Update stuck tracking
      herb.lastX = herb.x
      herb.lastY = herb.y
      if (herb.resetCooldown > 0) herb.resetCooldown--
      
      // Rotation with smoother interpolation
      const rotationalDrag = -herb.angularVelocity * 0.15
      herb.angularVelocity += rotationalDrag
      herb.angularVelocity += (herb.vx * 0.05) * deltaTime
      herb.rotation += herb.angularVelocity * 0.8
      
      // Enhanced damping
      herb.vx *= 0.98
      herb.vy *= 0.999
      herb.angularVelocity *= 0.98
      
      // Stop tiny movements
      if (Math.abs(herb.vx) < 0.02) herb.vx = 0
      if (Math.abs(herb.vy) < 0.02) herb.vy = 0
      if (Math.abs(herb.angularVelocity) < 0.005) herb.angularVelocity = 0
      
      // Mouse repulsion
      const dx = herb.x - mouseX
      const dy = herb.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 150 && distance > 0) {
        const force = (1 - distance / 150) * 2.5
        herb.vx += (dx / distance) * force * deltaTime * 60
        herb.vy += (dy / distance) * force * deltaTime * 60
      }
      
      // Reset when off screen
      if (herb.y > window.innerHeight + 100) {
        herb.y = -100 - Math.random() * 300
        herb.x = Math.random() * window.innerWidth
        herb.vx = 0
        herb.vy = 0
        herb.rotation = Math.random() * 360
        herb.angularVelocity = (Math.random() - 0.5) * 2
        herb.stuckCounter = 0
        herb.resetCooldown = 0
      }
      
      // Simplified herb-to-herb collision
      const herbRadius = 25
      for (let i = 0; i < herbRegistry.length; i++) {
        if (i === index || !herbRegistry[i]) continue
        
        const other = herbRegistry[i]
        const dx = herb.x - other.x
        const dy = herb.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < herbRadius * 2 && distance > 0) {
          // Soft separation
          const nx = dx / distance
          const ny = dy / distance
          const overlap = herbRadius * 2 - distance
          
          herb.x += nx * overlap * 0.3
          herb.y += ny * overlap * 0.3
          
          // Gentle velocity adjustment
          herb.vx += nx * 0.2
          herb.vy += ny * 0.2
        }
      }
      
      let finalX = herb.x + swayX
      let finalY = herb.y
      
      // Improved obstacle collision with stuck prevention
      for (const obstacle of obstacles) {
        if (obstacle.type === 'circle' && obstacle.radius) {
          const centerX = obstacle.x + obstacle.radius
          const centerY = obstacle.y + obstacle.radius
          const dx = finalX - centerX
          const dy = finalY - centerY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < obstacle.radius + 40) {
            // Push away from obstacle center
            const pushDistance = obstacle.radius + 45
            const normalX = distance > 0 ? dx / distance : 1
            const normalY = distance > 0 ? dy / distance : 0
            
            finalX = centerX + normalX * pushDistance
            finalY = centerY + normalY * pushDistance
            
            // Soft bounce
            const dotProduct = herb.vx * normalX + herb.vy * normalY
            if (dotProduct < 0) {
              herb.vx -= dotProduct * normalX * 0.8
              herb.vy -= dotProduct * normalY * 0.8
              // Add slight randomness to prevent getting stuck
              herb.vx += (Math.random() - 0.5) * 0.2
              herb.vy += (Math.random() - 0.5) * 0.2
            }
          }
        } else {
          // Rectangle obstacles with rounded response
          const padding = 35
          const left = obstacle.x - padding
          const right = obstacle.x + obstacle.width + padding
          const top = obstacle.y - padding
          const bottom = obstacle.y + obstacle.height + padding
          
          if (finalX > left && finalX < right && finalY > top && finalY < bottom) {
            // Find closest edge
            const distances = [
              { dist: finalX - left, normal: [-1, 0], pos: [left, finalY] },
              { dist: right - finalX, normal: [1, 0], pos: [right, finalY] },
              { dist: finalY - top, normal: [0, -1], pos: [finalX, top] },
              { dist: bottom - finalY, normal: [0, 1], pos: [finalX, bottom] }
            ]
            
            const closest = distances.reduce((min, curr) => 
              curr.dist < min.dist ? curr : min
            )
            
            // Smooth push away
            finalX = closest.pos[0] + closest.normal[0] * 5
            finalY = closest.pos[1] + closest.normal[1] * 5
            
            // Gentle velocity adjustment with randomness
            herb.vx += closest.normal[0] * 0.5 + (Math.random() - 0.5) * 0.3
            herb.vy += closest.normal[1] * 0.5 + (Math.random() - 0.5) * 0.3
          }
        }
      }
      
      // Fade in effect
      if (elapsed < 1000) {
        herb.opacity = 0.7 * (elapsed / 1000)
      } else {
        herb.opacity = 0.7
      }
      herb.visible = true
      
      // Apply transform
      leafRef.current.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${herb.rotation}deg) scale(${size})`
      leafRef.current.style.opacity = String(herb.opacity)
      leafRef.current.style.visibility = herb.visible ? 'visible' : 'hidden'
      
      herb.x = finalX - swayX
      herb.y = finalY
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Start animation with delay
    const startDelay = setTimeout(() => {
      animate(performance.now())
    }, index * 50 + Math.random() * 500)
    
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
  
  const dimensions = herbDimensions[leafType] || herbDimensions['thai-basil']
  
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
        visibility: 'hidden',
        transition: 'none',
        pointerEvents: 'none',
        willChange: 'transform',
        contain: 'layout style'
      }}
    >
      <HerbSVG type={leafType} index={index} />
    </div>
  )
}

const RotatingHerbs: React.FC<{ obstacles: any[] }> = ({ obstacles }) => {
  const [isMobile, setIsMobile] = React.useState(false)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const herbCount = isMobile ? 15 : 25 // Reduced count for better performance
  
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <div className="absolute inset-0">
        {[...Array(herbCount)].map((_, i) => (
          <Herb key={`herb-${i}`} index={i} obstacles={obstacles} />
        ))}
      </div>
    </div>
  )
}

export default RotatingHerbs