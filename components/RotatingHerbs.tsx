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
  rotation: number
  rotationSpeed: number
  opacity: number
  visible: boolean
  // New physics properties
  angularVelocity: number
  mass: number
  dragCoefficient: number
  // Anti-stuck properties
  stuckCounter: number
  lastX: number
  lastY: number
  resetCooldown: number
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
    type?: 'rect' | 'circle' | 'triangle'
    radius?: number
    apex?: { x: number, y: number }
    leftBase?: { x: number, y: number }
    rightBase?: { x: number, y: number }
  }>
}

// Herb SVG Component - EXACT COPY from StableHerbs with no color changes
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
        <circle cx="15" cy="3" r="0.6" fill="#22c55e" opacity="0.8" />
        <circle cx="14" cy="5" r="0.5" fill="#16a34a" opacity="0.7" />
        <circle cx="16" cy="5" r="0.5" fill="#16a34a" opacity="0.7" />
      </svg>
    )
  }
}

// Helper function to calculate distance from point to line segment
const distanceToLineSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy
  
  if (lengthSquared === 0) {
    // Line segment is a point
    const distX = px - x1
    const distY = py - y1
    const distance = Math.sqrt(distX * distX + distY * distY)
    return {
      distance,
      normalX: distance > 0 ? distX / distance : 1,
      normalY: distance > 0 ? distY / distance : 0
    }
  }
  
  // Calculate parameter t for the closest point on the line segment
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared))
  
  // Find the closest point on the line segment
  const closestX = x1 + t * dx
  const closestY = y1 + t * dy
  
  // Calculate distance and normal
  const distX = px - closestX
  const distY = py - closestY
  const distance = Math.sqrt(distX * distX + distY * distY)
  
  return {
    distance,
    normalX: distance > 0 ? distX / distance : 1,
    normalY: distance > 0 ? distY / distance : 0
  }
}

const RotatingHerb: React.FC<HerbProps> = ({ index, obstacles }) => {
  const leafRef = useRef<HTMLDivElement>(null)
  const herbDataRef = useRef<HerbData | null>(null)
  const [leafType, setLeafType] = React.useState('')
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  
  useEffect(() => {
    if (!leafRef.current) return
    
    // Herb configuration - ensure even distribution
    const types = ['thai-basil', 'cilantro', 'lemongrass', 'kaffir']
    // Use modulo to ensure each type appears regularly
    const typeIndex = index % types.length
    // Add some randomness while maintaining distribution
    const randomOffset = Math.floor(Math.random() * 2)
    const finalIndex = (typeIndex + randomOffset) % types.length
    const selectedType = types[finalIndex]
    setLeafType(selectedType)
    
    // Physics properties based on herb type
    const herbPhysics = {
      'lemongrass': { mass: 0.3, drag: 0.8 }, // Light and streamlined
      'kaffir': { mass: 0.8, drag: 1.3 }, // Heavier, double leaves catch air
      'cilantro': { mass: 0.5, drag: 1.1 }, // Medium weight, complex shape
      'thai-basil': { mass: 0.6, drag: 1.0 } // Standard leaf
    }
    
    const physics = herbPhysics[selectedType as keyof typeof herbPhysics] || herbPhysics['thai-basil']
    
    const size = 0.6 + Math.random() * 0.4
    const speed = 0.08 + Math.random() * 0.03 // Ultra slow zen-like speed for meditative effect
    const swayAmount = 40 + Math.random() * 30 // Wider sway amplitude for graceful, hypnotic motion
    const swaySpeed = 0.0002 + Math.random() * 0.0001 // Much slower sway for truly mesmerizing effect
    
    // Starting position - better distribution for continuous presence
    const screenWidth = window.innerWidth
    // Distribute herbs across width sections for even coverage
    const section = index % 5
    const sectionWidth = screenWidth / 5
    let x = section * sectionWidth + Math.random() * sectionWidth
    // Stagger initial heights for continuous flow
    let y = -100 - (index * 30) - Math.random() * 150
    let vx = (Math.random() - 0.5) * 0.2 // Small initial drift
    let vy = 0
    let rotation = Math.random() * 360
    let angularVelocity = (Math.random() - 0.5) * 2 // Gentler initial spin
    
    // Register this herb with anti-stuck properties
    const herbData: HerbData = {
      x, y, vx, vy, size,
      type: selectedType,
      element: leafRef.current,
      rotation,
      rotationSpeed: 0, // Keep for compatibility
      opacity: 0.7,
      visible: true,
      // New physics properties
      angularVelocity,
      mass: physics.mass,
      dragCoefficient: physics.drag,
      // Anti-stuck tracking
      stuckCounter: 0,
      lastX: x,
      lastY: y,
      resetCooldown: 0
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
      
      // Calculate delta time for frame-independent animation
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      const rawDeltaTime = (currentTime - lastTimeRef.current) / 1000
      // Clamp delta time to prevent jumps when tab is inactive
      const deltaTime = Math.min(rawDeltaTime, 0.033) // Cap at ~30fps minimum
      lastTimeRef.current = currentTime
      
      const elapsed = Date.now() - startTime
      const herb = herbDataRef.current
      
      // Gravity with mass consideration - ultra zen-like floating
      const GRAVITY = 9.81 * 1.2 // Much gentler gravity for true floating effect
      const gravityForce = GRAVITY * herb.mass * 0.5 // Further reduced gravity for meditation-like drift
      
      // Air resistance - high drag for floating effect
      const AIR_DENSITY = 0.035 // Higher air density for floatier motion
      const dragForceY = -AIR_DENSITY * herb.dragCoefficient * herb.vy * Math.abs(herb.vy) * 2.2
      const dragForceX = -AIR_DENSITY * herb.dragCoefficient * herb.vx * Math.abs(herb.vx) * 3.0
      
      // Apply forces with smoother integration
      herb.vy += gravityForce * deltaTime
      herb.vy += dragForceY * deltaTime
      herb.vx += dragForceX * deltaTime
      
      // Terminal velocity limiting - cap at zen-like falling speed
      const terminalVelocity = Math.sqrt((2 * herb.mass * GRAVITY) / (AIR_DENSITY * herb.dragCoefficient))
      herb.vy = Math.min(herb.vy, terminalVelocity * 0.3) // Low terminal velocity for floating effect
      herb.vx = Math.max(-0.5, Math.min(0.5, herb.vx)) // Very gentle horizontal drift
      
      // Multi-layered swaying for zen-like meditative motion
      // Primary sway - slow, breathing-like rhythm
      const primarySway = Math.sin(elapsed * swaySpeed) * swayAmount
      // Secondary sway - gentle cross-breeze effect
      const secondarySway = Math.sin(elapsed * swaySpeed * 1.7 + Math.PI/3) * swayAmount * 0.3
      // Tertiary sway - subtle micro-movements like air currents
      const tertiarySway = Math.sin(elapsed * swaySpeed * 0.5 - Math.PI/4) * swayAmount * 0.2
      // Breathing effect - creates a pulsing, meditative rhythm
      const breathingEffect = Math.sin(elapsed * swaySpeed * 0.3) * swayAmount * 0.1
      // Combine all effects for hypnotic, zen-like motion
      const swayX = primarySway + secondarySway + tertiarySway + breathingEffect
      
      // Organic horizontal drift with turbulence
      const driftX = Math.sin(elapsed * 0.0003 + herb.x * 0.0003) * 0.05
      const turbulence = Math.sin(elapsed * 0.001 + herb.y * 0.001) * 0.03
      herb.vx += (driftX + turbulence) * deltaTime
      
      // Apply velocity with vertical sway for complete zen effect
      herb.x += herb.vx * deltaTime * 60 // Scale for 60fps baseline
      // Add subtle vertical sway synchronized with breathing
      const verticalSway = Math.sin(elapsed * swaySpeed * 0.4 + Math.PI/2) * 5 // Gentle up-down motion
      herb.y += (herb.vy * deltaTime * 60) + (verticalSway * deltaTime)
      
      // Vibration dampening - more precise threshold
      const movement = Math.abs(herb.x - herb.lastX) + Math.abs(herb.y - herb.lastY)
      if (movement < 0.1 && Math.abs(herb.vx) < 0.1 && Math.abs(herb.vy) < 0.1) {
        // Herb is nearly stationary - stop all motion to prevent vibration
        herb.vx = 0
        herb.vy = 0
        herb.angularVelocity *= 0.8
      }
      
      // Update tracking
      herb.lastX = herb.x
      herb.lastY = herb.y
      
      // Realistic rotation tied to horizontal movement
      // Angular velocity affected by horizontal movement and air resistance
      const rotationalDrag = -herb.angularVelocity * 0.1 * herb.dragCoefficient
      herb.angularVelocity += rotationalDrag
      
      // Rotation influenced by sway direction - like real leaves - smoother
      const swayInfluence = (herb.vx) * 0.08
      herb.angularVelocity += swayInfluence * deltaTime
      
      // Update rotation very gently with interpolation
      const targetRotation = herb.rotation + herb.angularVelocity
      herb.rotation += (targetRotation - herb.rotation) * 0.1
      
      // Smooth velocity damping with different rates for X and Y
      const dampingX = 0.985 // More damping on X for less erratic movement
      const dampingY = 0.995 // Less damping on Y to maintain fall
      herb.vx *= dampingX
      herb.vy *= dampingY // Apply damping to Y as well for smoother motion
      herb.angularVelocity *= 0.985
      
      // Complete stop for tiny movements - lower thresholds for smoother motion
      if (Math.abs(herb.vx) < 0.05) herb.vx = 0
      if (Math.abs(herb.vy) < 0.05) herb.vy = 0
      if (Math.abs(herb.angularVelocity) < 0.02) herb.angularVelocity = 0
      
      // Mouse interaction - gentle but noticeable
      const dx = herb.x - mouseX
      const dy = herb.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 150 && distance > 0) {
        // Smooth force curve for natural interaction
        const normalizedDist = distance / 150
        const force = Math.pow(1 - normalizedDist, 2) * 2.0 // Quadratic falloff
        const repelX = (dx / distance) * force
        const repelY = (dy / distance) * force * 0.7 // Less vertical influence
        
        // Apply forces smoothly
        herb.vx += repelX * deltaTime * 40
        herb.vy += repelY * deltaTime * 40
        herb.angularVelocity += repelX * 0.2 // Gentle spin
      }
      
      // Reset when off screen - with better distribution
      if (herb.y > window.innerHeight + 100 || herb.x < -100 || herb.x > window.innerWidth + 100) {
        // Reset to top with distributed spawning
        herb.y = -100 - (index % 5) * 50 - Math.random() * 100 // Stagger spawn heights
        // Distribute herbs across width more evenly
        const section = index % 4
        const sectionWidth = window.innerWidth / 4
        herb.x = section * sectionWidth + Math.random() * sectionWidth
        herb.vx = (Math.random() - 0.5) * 0.2 // Small initial horizontal velocity
        herb.vy = 0
        herb.rotation = Math.random() * 360
        herb.angularVelocity = (Math.random() - 0.5) * 2
        herb.stuckCounter = 0
        herb.resetCooldown = 0
      }
      
      // Soft herb-to-herb collision for natural interaction
      const herbRadius = 25
      for (let i = 0; i < herbRegistry.length; i++) {
        if (i === index || !herbRegistry[i]) continue
        
        const other = herbRegistry[i]
        const dx = herb.x - other.x
        const dy = herb.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < herbRadius * 2 && distance > 0) {
          // Soft repulsion force instead of hard collision
          const nx = dx / distance
          const ny = dy / distance
          const overlap = herbRadius * 2 - distance
          const force = overlap * 0.02 // Very soft force
          
          // Apply gentle separation
          herb.vx += nx * force
          herb.vy += ny * force
          
          // Subtle rotation influence
          herb.angularVelocity += (nx * herb.vy - ny * herb.vx) * 0.01
        }
      }
      
      let finalX = herb.x + swayX
      let finalY = herb.y
      
      // Check obstacles collision
      for (const obstacle of obstacles) {
        if (obstacle.type === 'triangle' && obstacle.apex && obstacle.leftBase && obstacle.rightBase) {
          // Triangle collision detection
          const herbRadius = 50 // Even bigger collision radius
          
          // Check if herb is within triangle's bounding box first
          if (finalX >= obstacle.leftBase.x - herbRadius && 
              finalX <= obstacle.rightBase.x + herbRadius &&
              finalY >= obstacle.apex.y - herbRadius && 
              finalY <= obstacle.leftBase.y + herbRadius) {
            
            // Check if point is inside triangle using sign of cross products
            // This is more robust than barycentric coordinates for our use case
            const sign = (p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number) => {
              return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y)
            }
            
            const d1 = sign(finalX, finalY, obstacle.apex.x, obstacle.apex.y, obstacle.leftBase.x, obstacle.leftBase.y)
            const d2 = sign(finalX, finalY, obstacle.leftBase.x, obstacle.leftBase.y, obstacle.rightBase.x, obstacle.rightBase.y)
            const d3 = sign(finalX, finalY, obstacle.rightBase.x, obstacle.rightBase.y, obstacle.apex.x, obstacle.apex.y)
            
            const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0)
            const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0)
            
            const isInsideTriangle = !(hasNeg && hasPos)
            
            // Calculate which side of the triangle the herb is closest to
            const centerX = (obstacle.leftBase.x + obstacle.rightBase.x) / 2
            const isLeftSide = finalX < centerX
            
            // Calculate the slope line the herb should follow
            let slopeX1, slopeY1, slopeX2, slopeY2
            if (isLeftSide) {
              // Left side of triangle
              slopeX1 = obstacle.apex.x
              slopeY1 = obstacle.apex.y
              slopeX2 = obstacle.leftBase.x
              slopeY2 = obstacle.leftBase.y
            } else {
              // Right side of triangle
              slopeX1 = obstacle.apex.x
              slopeY1 = obstacle.apex.y
              slopeX2 = obstacle.rightBase.x
              slopeY2 = obstacle.rightBase.y
            }
            
            // Calculate distance from herb to slope line
            const slopeDx = slopeX2 - slopeX1
            const slopeDy = slopeY2 - slopeY1
            const slopeLength = Math.sqrt(slopeDx * slopeDx + slopeDy * slopeDy)
            const slopeNormalX = -slopeDy / slopeLength
            const slopeNormalY = slopeDx / slopeLength
            
            // Calculate distance to the nearest edge of the triangle
            const distToLeftEdge = distanceToLineSegment(finalX, finalY, obstacle.apex.x, obstacle.apex.y, obstacle.leftBase.x, obstacle.leftBase.y)
            const distToRightEdge = distanceToLineSegment(finalX, finalY, obstacle.apex.x, obstacle.apex.y, obstacle.rightBase.x, obstacle.rightBase.y)
            const distToBase = distanceToLineSegment(finalX, finalY, obstacle.leftBase.x, obstacle.leftBase.y, obstacle.rightBase.x, obstacle.rightBase.y)
            
            const minDist = Math.min(distToLeftEdge.distance, distToRightEdge.distance, distToBase.distance)
            
            // If herb is inside triangle, push it out forcefully
            if (isInsideTriangle) {
              // Special handling for herbs stuck in center (far from all edges)
              const centerDistanceThreshold = 100
              if (minDist > centerDistanceThreshold) {
                // Herb is deep inside - give it strong upward push to escape
                herb.vx = (Math.random() - 0.5) * 4 // Random horizontal to break symmetry
                herb.vy = -3 // Strong upward push
                herb.angularVelocity = (Math.random() - 0.5) * 5
                finalX += herb.vx * 10
                finalY += herb.vy * 10
              } else {
                // Find which edge is closest and push out
                let pushX = 0, pushY = 0
                if (minDist === distToLeftEdge.distance) {
                  pushX = distToLeftEdge.normalX
                  pushY = distToLeftEdge.normalY
                } else if (minDist === distToRightEdge.distance) {
                  pushX = distToRightEdge.normalX
                  pushY = distToRightEdge.normalY
                } else {
                  pushX = distToBase.normalX
                  pushY = distToBase.normalY
                }
                
                // Stronger push to prevent getting stuck
                const pushDistance = herbRadius + 35
                finalX += pushX * pushDistance
                finalY += pushY * pushDistance
                
                // Reflect velocity with less energy loss to maintain movement
                const dot = herb.vx * pushX + herb.vy * pushY
                herb.vx -= 2 * dot * pushX * 0.8 // 80% restitution
                herb.vy -= 2 * dot * pushY * 0.8
                
                // Add escape velocity to prevent sticking
                const escapeSpeed = 2.0
                herb.vx += pushX * escapeSpeed
                herb.vy += pushY * escapeSpeed
                
                // Ensure minimum velocity to keep moving
                const minSpeed = 0.5
                const currentSpeed = Math.sqrt(herb.vx * herb.vx + herb.vy * herb.vy)
                if (currentSpeed < minSpeed && currentSpeed > 0) {
                  herb.vx = (herb.vx / currentSpeed) * minSpeed
                  herb.vy = (herb.vy / currentSpeed) * minSpeed
                }
              }
              
              // Force update position to prevent penetration
              herb.x = finalX - swayX
              herb.y = finalY
            } else if (minDist < herbRadius) {
              // Herb is close to an edge but not inside - apply soft repulsion
              let pushX = 0, pushY = 0
              if (minDist === distToLeftEdge.distance) {
                pushX = distToLeftEdge.normalX
                pushY = distToLeftEdge.normalY
              } else if (minDist === distToRightEdge.distance) {
                pushX = distToRightEdge.normalX
                pushY = distToRightEdge.normalY
              } else {
                pushX = distToBase.normalX
                pushY = distToBase.normalY
              }
              
              const pushForce = (herbRadius - minDist) / herbRadius
              finalX += pushX * pushForce * 10
              finalY += pushY * pushForce * 10
              
              // Apply sliding physics
              const tangentX = -pushY
              const tangentY = pushX
              const velocityAlongEdge = herb.vx * tangentX + herb.vy * tangentY
              
              // Update velocity for smooth sliding
              herb.vx = tangentX * velocityAlongEdge * 0.9 + pushX * pushForce * 0.3
              herb.vy = tangentY * velocityAlongEdge * 0.9 + pushY * pushForce * 0.3 + 0.1
              
              // Add rotation based on sliding direction
              herb.angularVelocity += velocityAlongEdge * 0.02
            }
          }
        } else if (obstacle.type === 'circle' && obstacle.radius) {
          // Keep circle collision for potential future use
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
              herb.vx -= dotProduct * normalX * 0.3
              herb.vy -= dotProduct * normalY * 0.3
              herb.vx *= 0.7
              herb.vy *= 0.7
              herb.angularVelocity *= 0.8
            }
          }
        }
      }
      
      // Handle visibility and opacity more smoothly
      // Start showing herb once it's below y = -50
      if (herb.y > -50) {
        herb.visible = true
        // Smoother fade in based on position
        if (herb.y < 50) {
          herb.opacity = 0.7 * ((herb.y + 50) / 100)
        } else {
          herb.opacity = 0.7
        }
      } else {
        herb.visible = false
        herb.opacity = 0
      }
      
      // Use CSS transform3d for better performance
      leafRef.current.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) rotate(${herb.rotation}deg) scale(${size})`
      leafRef.current.style.opacity = String(herb.opacity)
      leafRef.current.style.visibility = herb.visible ? 'visible' : 'hidden'
      
      herb.x = finalX - swayX
      herb.y = finalY
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Set initial position immediately but keep hidden
    leafRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${size})`
    leafRef.current.style.opacity = '0'
    leafRef.current.style.visibility = 'hidden' // Keep hidden until animation starts
    
    // Start with staggered delays for continuous flow
    // Each herb starts at different times to ensure constant presence
    const spawnDelay = (index * 200) % 3000 + Math.random() * 1000 // Cyclic staggered spawns
    
    const startDelay = setTimeout(() => {
      if (leafRef.current) {
        leafRef.current.style.opacity = '0'
      }
      animate(performance.now())
    }, spawnDelay)
    
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
        opacity: 0,
        visibility: 'hidden', // Start hidden to prevent flash in corner
        transition: 'none',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        perspective: 1000
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
  
  const herbCount = isMobile ? 25 : 40 // Increased for better continuous presence
  
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {[...Array(herbCount)].map((_, i) => (
        <RotatingHerb key={`herb-${i}`} index={i} obstacles={obstacles} />
      ))}
    </div>
  )
}

export default RotatingHerbs