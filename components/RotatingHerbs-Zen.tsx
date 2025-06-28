import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

interface Herb {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  angularVelocity: number
  scale: number
  type: 'thai-basil' | 'cilantro' | 'lemongrass' | 'kaffir'
  opacity: number
  swayPhase: number
  swayAmplitude: number
  fallSpeed: number
}

interface RotatingHerbsProps {
  obstacles?: Array<any> // Keep for compatibility but won't use
}

// Herb SVG Components (same as before)
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
        <path d="M16 22 C15.5 28 15 35 15 40 C15 43 15.2 45 15.5 46 C15.8 45 16 43 16 40 C16 35 16.5 28 17 22" fill={herbColors[1]} stroke={herbColors[2]} strokeWidth="0.5" />
        <path d="M17 21 L17.5 21 C18 27 18.3 34 18.5 39 C18.6 42 18.8 44 19 45 C19.2 44 19.3 42 19.4 39 C19.5 34 19.2 27 19 22" fill={herbColors[1]} opacity="0.9" />
      </svg>
    )
  } else if (type === 'cilantro') {
    return (
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}>
        <path d="M15 1 C14 2 13 3 12 5 C11 7 10 9 10 11 C10 13 11 14 12 14 C13 14 14 13 14 11 C14 9 14 7 14 5 C14 3 14.5 2 15 1" fill={herbColors[0]} />
        <path d="M15 1 C16 2 17 3 18 5 C19 7 20 9 20 11 C20 13 19 14 18 14 C17 14 16 13 16 11 C16 9 16 7 16 5 C16 3 15.5 2 15 1" fill={herbColors[0]} />
        <path d="M15 14 C14.8 20 14.5 26 14.5 31 C14.5 34 14.7 36 15 37 C15.3 36 15.5 34 15.5 31 C15.5 26 15.2 20 15 14" fill={herbColors[1]} stroke={herbColors[2]} strokeWidth="0.5" />
        <path d="M8 8 C7 9 6 10 5.5 11 C5 12 4.5 13 4.5 14 C4.5 15 5 16 5.5 16 C6 16 6.5 15 6.5 14 C6.5 13 7 12 7.5 11 C8 10 8 9 8 8" fill={herbColors[0]} opacity="0.9" />
        <path d="M22 8 C23 9 24 10 24.5 11 C25 12 25.5 13 25.5 14 C25.5 15 25 16 24.5 16 C24 16 23.5 15 23.5 14 C23.5 13 23 12 22.5 11 C22 10 22 9 22 8" fill={herbColors[0]} opacity="0.9" />
      </svg>
    )
  } else {
    return (
      <svg width="30" height="36" viewBox="0 0 30 36" fill="none" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}>
        <path d="M15 1 C10 2 6 5 4 10 C2 15 2 21 4 26 C6 31 10 34 15 36 C20 34 24 31 26 26 C28 21 28 15 26 10 C24 5 20 2 15 1" fill={herbColors[0]} />
        <path d="M15 1 L15 36" stroke={herbColors[1]} strokeWidth="0.8" opacity="0.7" />
        <path d="M15 6 C11 7 8 9 6 11 M15 11 C11 12 8 14 6 16 M15 16 C11 17 8 19 6 21 M15 21 C11 22 8 24 6 26 M15 26 C11 27 8 29 6 31" stroke={herbColors[1]} strokeWidth="0.5" opacity="0.5" />
        <path d="M15 6 C19 7 22 9 24 11 M15 11 C19 12 22 14 24 16 M15 16 C19 17 22 19 24 21 M15 21 C19 22 22 24 24 26 M15 26 C19 27 22 29 24 31" stroke={herbColors[1]} strokeWidth="0.5" opacity="0.5" />
        <circle cx="15" cy="3" r="0.6" fill={herbColors[0]} opacity="0.8" />
        <circle cx="14" cy="5" r="0.5" fill={herbColors[1]} opacity="0.7" />
        <circle cx="16" cy="5" r="0.5" fill={herbColors[1]} opacity="0.7" />
      </svg>
    )
  }
}

const RotatingHerbs: React.FC<RotatingHerbsProps> = () => {
  const [herbs, setHerbs] = useState<Herb[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const herbIdRef = useRef(0)

  // Initialize herbs
  useEffect(() => {
    const types: Herb['type'][] = ['thai-basil', 'cilantro', 'lemongrass', 'kaffir']
    const initialHerbs: Herb[] = []
    
    for (let i = 0; i < 15; i++) {
      initialHerbs.push({
        id: herbIdRef.current++,
        x: Math.random() * window.innerWidth,
        y: -100 - Math.random() * 300, // Start above viewport
        vx: (Math.random() - 0.5) * 0.5, // Very gentle horizontal movement
        vy: 0.5 + Math.random() * 0.5, // Gentle falling speed
        rotation: Math.random() * 360,
        angularVelocity: (Math.random() - 0.5) * 2, // Slow rotation
        scale: 0.6 + Math.random() * 0.4,
        type: types[Math.floor(Math.random() * types.length)],
        opacity: 0.7 + Math.random() * 0.3,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmplitude: 10 + Math.random() * 20,
        fallSpeed: 0.3 + Math.random() * 0.4
      })
    }
    
    setHerbs(initialHerbs)
  }, [])

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animation loop
  useAnimationFrame((time) => {
    if (!lastTimeRef.current) lastTimeRef.current = time
    const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.1)
    lastTimeRef.current = time

    setHerbs(prevHerbs => {
      const newHerbs = prevHerbs.map(herb => {
        // Gentle swaying motion
        const swayX = Math.sin(herb.swayPhase + time * 0.0005) * herb.swayAmplitude
        
        // Update position
        let newX = herb.x + herb.vx + swayX * deltaTime
        let newY = herb.y + herb.fallSpeed
        
        // Mouse interaction - gentle push away
        const mouseDist = Math.sqrt(
          Math.pow(herb.x - mousePos.x, 2) + 
          Math.pow(herb.y - mousePos.y, 2)
        )
        
        if (mouseDist < 100) {
          const force = (100 - mouseDist) / 100
          const angle = Math.atan2(herb.y - mousePos.y, herb.x - mousePos.x)
          newX += Math.cos(angle) * force * 2
          newY += Math.sin(angle) * force * 2
          herb.angularVelocity += (Math.random() - 0.5) * force * 5
        }
        
        // Update rotation
        const newRotation = herb.rotation + herb.angularVelocity
        herb.angularVelocity *= 0.98 // Gentle damping
        
        // Wrap around screen edges
        if (newX < -50) newX = window.innerWidth + 50
        if (newX > window.innerWidth + 50) newX = -50
        
        // Reset herb when it falls off screen
        if (newY > window.innerHeight + 100) {
          return {
            ...herb,
            x: Math.random() * window.innerWidth,
            y: -100 - Math.random() * 300,
            vx: (Math.random() - 0.5) * 0.5,
            rotation: Math.random() * 360,
            angularVelocity: (Math.random() - 0.5) * 2,
            swayPhase: Math.random() * Math.PI * 2,
            swayAmplitude: 10 + Math.random() * 20,
            fallSpeed: 0.3 + Math.random() * 0.4
          }
        }
        
        return {
          ...herb,
          x: newX,
          y: newY,
          rotation: newRotation
        }
      })
      
      // Occasionally add new herbs
      if (Math.random() < 0.01 && newHerbs.length < 20) {
        const types: Herb['type'][] = ['thai-basil', 'cilantro', 'lemongrass', 'kaffir']
        newHerbs.push({
          id: herbIdRef.current++,
          x: Math.random() * window.innerWidth,
          y: -100,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 0.5 + Math.random() * 0.5,
          rotation: Math.random() * 360,
          angularVelocity: (Math.random() - 0.5) * 2,
          scale: 0.6 + Math.random() * 0.4,
          type: types[Math.floor(Math.random() * types.length)],
          opacity: 0.7 + Math.random() * 0.3,
          swayPhase: Math.random() * Math.PI * 2,
          swayAmplitude: 10 + Math.random() * 20,
          fallSpeed: 0.3 + Math.random() * 0.4
        })
      }
      
      return newHerbs
    })
  })

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {herbs.map((herb) => (
        <motion.div
          key={herb.id}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: herb.type === 'lemongrass' ? 24 : herb.type === 'kaffir' ? 32 : 30,
            height: herb.type === 'lemongrass' ? 65 : herb.type === 'kaffir' ? 46 : herb.type === 'cilantro' ? 38 : 36,
            opacity: herb.opacity,
            visibility: 'visible',
            transition: 'none',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            perspective: 1000
          }}
          animate={{
            x: herb.x,
            y: herb.y,
            rotate: herb.rotation,
            scale: herb.scale
          }}
          transition={{
            type: "spring",
            damping: 50,
            stiffness: 100,
            mass: 0.5
          }}
        >
          <HerbSVG type={herb.type} index={herb.id} />
        </motion.div>
      ))}
    </div>
  )
}

export default RotatingHerbs