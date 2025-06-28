'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
}

const Particles: React.FC<ParticlesProps> = memo(({
  className = '',
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = '#D4AF37',
  vx = 0,
  vy = 0,
}) => {
  interface MousePosition {
    x: number
    y: number
  }

  const MousePosition = (): MousePosition => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({
      x: 0,
      y: 0,
    })

    useEffect(() => {
      let frameId: number | null = null
      let lastTime = 0
      const throttleMs = 16 // ~60fps

      const handleMouseMove = (event: MouseEvent) => {
        const now = Date.now()
        if (now - lastTime < throttleMs) return
        
        lastTime = now
        if (frameId) cancelAnimationFrame(frameId)
        
        frameId = requestAnimationFrame(() => {
          setMousePosition({ x: event.clientX, y: event.clientY })
        })
      }

      window.addEventListener('mousemove', handleMouseMove, { passive: true })

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        if (frameId) cancelAnimationFrame(frameId)
      }
    }, [])

    return mousePosition
  }

  const hexToRgb = useCallback((hex: string): number[] => {
    hex = hex.replace('#', '')
    const hexInt = parseInt(hex, 16)
    const red = (hexInt >> 16) & 255
    const green = (hexInt >> 8) & 255
    const blue = hexInt & 255
    return [red, green, blue]
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circles = useRef<any[]>([])
  const mousePosition = MousePosition()
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1

  const rgb = useMemo(() => hexToRgb(color), [color, hexToRgb])

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d', { alpha: true })
    }
    initCanvas()
    animate()
    window.addEventListener('resize', initCanvas, { passive: true })

    return () => {
      window.removeEventListener('resize', initCanvas)
    }
  }, [color])

  useEffect(() => {
    onMouseMove()
  }, [mousePosition.x, mousePosition.y])

  useEffect(() => {
    initCanvas()
  }, [refresh])

  const initCanvas = useCallback(() => {
    resizeCanvas()
    drawParticles()
  }, [])

  const onMouseMove = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const { w, h } = canvasSize.current
      const x = mousePosition.x - rect.left - w / 2
      const y = mousePosition.y - rect.top - h / 2
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2
      if (inside) {
        mouse.current.x = x
        mouse.current.y = y
      }
    }
  }, [mousePosition])

  type Circle = {
    x: number
    y: number
    translateX: number
    translateY: number
    size: number
    alpha: number
    targetAlpha: number
    dx: number
    dy: number
    magnetism: number
  }

  const resizeCanvas = useCallback(() => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight
      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)
    }
  }, [dpr])

  const circleParams = useCallback((): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w)
    const y = Math.floor(Math.random() * canvasSize.current.h)
    const translateX = 0
    const translateY = 0
    const pSize = Math.floor(Math.random() * 2) + size
    const alpha = 0
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1))
    const dx = (Math.random() - 0.5) * 0.02
    const dy = (Math.random() - 0.5) * 0.02
    const magnetism = 0.1 + Math.random() * 4
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    }
  }, [size])

  const drawCircle = useCallback((circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle
      context.current.save()
      context.current.translate(translateX, translateY)
      context.current.beginPath()
      context.current.arc(x, y, size, 0, 2 * Math.PI)
      context.current.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`
      context.current.fill()
      context.current.restore()

      if (!update) {
        circles.current.push(circle)
      }
    }
  }, [rgb])

  const clearContext = useCallback(() => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      )
    }
  }, [])

  const drawParticles = useCallback(() => {
    clearContext()
    const particleCount = quantity
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams()
      drawCircle(circle)
    }
  }, [quantity, circleParams, drawCircle, clearContext])

  const remapValue = useCallback((
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
    return remapped > 0 ? remapped : 0
  }, [])

  const animate = useCallback(() => {
    clearContext()
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ]
      const closestEdge = edge.reduce((a, b) => Math.min(a, b))
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      )
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge
      }
      circle.x += circle.dx + vx
      circle.y += circle.dy + vy
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease

      drawCircle(circle, true)

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1)
        const newCircle = circleParams()
        drawCircle(newCircle)
      }
    })
    window.requestAnimationFrame(animate)
  }, [clearContext, remapValue, drawCircle, circleParams, vx, vy, staticity, ease])

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true" role="presentation">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
})

Particles.displayName = 'Particles'

interface Dot {
  x: number
  y: number
  baseOpacity: number
  currentOpacity: number
  opacitySpeed: number
  baseRadius: number
  currentRadius: number
  color: string
}

interface ThaiBackgroundProps {
  isDarkMode: boolean
}

const ThaiBackground: React.FC<ThaiBackgroundProps> = memo(({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)
  const dotsRef = useRef<Dot[]>([])
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })
  const lastFrameTime = useRef<number>(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon')

  const DOT_SPACING = isMobile ? 60 : 40
  const BASE_OPACITY_MIN = 0.15
  const BASE_OPACITY_MAX = 0.25
  const BASE_RADIUS = 1.5
  const INTERACTION_RADIUS = 120

  // Thai-inspired colors with improved harmony
  const thaiColors = useMemo(() => {
    const baseColors = [
      'rgba(212, 175, 55, 0.6)',   // Thai gold
      'rgba(220, 20, 60, 0.5)',    // Thai red
      'rgba(255, 215, 0, 0.5)',    // Golden yellow
      'rgba(139, 69, 19, 0.4)',    // Thai brown
      'rgba(255, 140, 0, 0.5)',    // Thai orange
      'rgba(255, 69, 0, 0.4)',     // Thai saffron
      'rgba(178, 34, 34, 0.4)',    // Deep red
      'rgba(255, 165, 0, 0.5)',    // Thai amber
    ]
    return isDarkMode ? baseColors.map(color => 
      color.replace(/[\d.]+\)$/, match => `${parseFloat(match) * 0.7})`)
    ) : baseColors
  }, [isDarkMode])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const checkMotionPreference = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
    }
    
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) setTimeOfDay('morning')
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon')
      else if (hour >= 17 && hour < 20) setTimeOfDay('evening')
      else setTimeOfDay('night')
    }
    
    checkMobile()
    checkMotionPreference()
    updateTimeOfDay()
    
    // Update time of day every minute
    const timeInterval = setInterval(updateTimeOfDay, 60000)
    
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(timeInterval)
    }
  }, [])

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    if (prefersReducedMotion) return
    
    const canvas = canvasRef.current
    if (!canvas) {
      mousePositionRef.current = { x: null, y: null }
      return
    }
    const rect = canvas.getBoundingClientRect()
    const canvasX = event.clientX - rect.left
    const canvasY = event.clientY - rect.top
    mousePositionRef.current = { x: canvasX, y: canvasY }
  }, [prefersReducedMotion])

  const createDots = useCallback(() => {
    const { width, height } = canvasSizeRef.current
    if (width === 0 || height === 0) return

    const newDots: Dot[] = []
    const cols = Math.ceil(width / DOT_SPACING)
    const rows = Math.ceil(height / DOT_SPACING)

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2
        const y = j * DOT_SPACING + DOT_SPACING / 2
        const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN
        const colorIndex = Math.floor(Math.random() * thaiColors.length)
        
        newDots.push({
          x,
          y,
          baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: (Math.random() * 0.003) + 0.001,
          baseRadius: BASE_RADIUS + Math.random() * 0.5,
          currentRadius: BASE_RADIUS,
          color: thaiColors[colorIndex],
        })
      }
    }
    dotsRef.current = newDots
  }, [DOT_SPACING, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS, thaiColors])

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    const width = container ? container.clientWidth : window.innerWidth
    const height = container ? container.clientHeight : window.innerHeight

    if (canvas.width !== width || canvas.height !== height ||
        canvasSizeRef.current.width !== width || canvasSizeRef.current.height !== height)
    {
      canvas.width = width
      canvas.height = height
      canvasSizeRef.current = { width, height }
      createDots()
    }
  }, [createDots])

  const animateDots = useCallback(() => {
    const now = performance.now()
    const deltaTime = now - lastFrameTime.current
    
    // Limit to 60fps
    if (deltaTime < 16.67) {
      animationFrameId.current = requestAnimationFrame(animateDots)
      return
    }
    
    lastFrameTime.current = now
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    const dots = dotsRef.current
    const { width, height } = canvasSizeRef.current
    const { x: mouseX, y: mouseY } = mousePositionRef.current

    if (!ctx || !dots || width === 0 || height === 0 || prefersReducedMotion) {
      if (!prefersReducedMotion) {
        animationFrameId.current = requestAnimationFrame(animateDots)
      }
      return
    }

    ctx.clearRect(0, 0, width, height)

    dots.forEach((dot) => {
      dot.currentOpacity += dot.opacitySpeed
      if (dot.currentOpacity >= BASE_OPACITY_MAX || dot.currentOpacity <= BASE_OPACITY_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed
        dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX))
      }

      let interactionFactor = 0
      dot.currentRadius = dot.baseRadius

      if (mouseX !== null && mouseY !== null) {
        const dx = dot.x - mouseX
        const dy = dot.y - mouseY
        const distanceSquared = dx * dx + dy * dy
        const interactionRadiusSquared = INTERACTION_RADIUS * INTERACTION_RADIUS

        if (distanceSquared < interactionRadiusSquared) {
          const distance = Math.sqrt(distanceSquared)
          interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS)
          // Smooth easing function
          interactionFactor = interactionFactor * interactionFactor * (3 - 2 * interactionFactor)
        }
      }

      const finalOpacity = Math.min(0.4, dot.currentOpacity + interactionFactor * 0.3)
      dot.currentRadius = dot.baseRadius + interactionFactor * 2

      ctx.beginPath()
      ctx.fillStyle = dot.color.replace(/[\d.]+\)$/, `${finalOpacity})`)
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2)
      ctx.fill()
    })

    animationFrameId.current = requestAnimationFrame(animateDots)
  }, [INTERACTION_RADIUS, BASE_OPACITY_MIN, BASE_OPACITY_MAX, prefersReducedMotion])

  useEffect(() => {
    handleResize()
    const handleMouseLeave = () => {
      mousePositionRef.current = { x: null, y: null }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    if (!prefersReducedMotion) {
      animationFrameId.current = requestAnimationFrame(animateDots)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [handleResize, handleMouseMove, animateDots, prefersReducedMotion])

  // Thai-inspired gradient backgrounds - optimized for performance with time-based variations
  const bgGradients = useMemo(() => {
    const timeColors = {
      morning: {
        primary: 'rgba(255, 223, 186, 0.08)', // Soft peach
        secondary: 'rgba(255, 195, 113, 0.06)' // Warm orange
      },
      afternoon: {
        primary: 'rgba(212, 175, 55, 0.08)', // Thai gold
        secondary: 'rgba(220, 20, 60, 0.06)' // Thai red
      },
      evening: {
        primary: 'rgba(255, 140, 66, 0.08)', // Sunset orange
        secondary: 'rgba(120, 40, 140, 0.06)' // Twilight purple
      },
      night: {
        primary: 'rgba(70, 90, 180, 0.04)', // Deep blue
        secondary: 'rgba(138, 43, 226, 0.03)' // Night violet
      }
    }
    
    const colors = timeColors[timeOfDay]
    
    return isDarkMode ? [
      `radial-gradient(ellipse at 20% 30%, ${colors.primary.replace('0.08', '0.03')} 0%, transparent 70%)`,
      `radial-gradient(ellipse at 80% 70%, ${colors.secondary.replace('0.06', '0.02')} 0%, transparent 70%)`,
    ] : [
      `radial-gradient(ellipse at 20% 30%, ${colors.primary} 0%, transparent 70%)`,
      `radial-gradient(ellipse at 80% 70%, ${colors.secondary} 0%, transparent 70%)`,
    ]
  }, [isDarkMode, timeOfDay])


  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" role="presentation">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-neutral-900" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" role="presentation">
      {/* Base gradient backgrounds */}
      {bgGradients.map((gradient, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: gradient,
            opacity: isDarkMode ? 0.3 : 0.4,
            willChange: 'opacity',
          }}
        />
      ))}

      {/* Thai pattern overlay - simplified on mobile */}
      {!isMobile && (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.015 : 0.02 }} aria-hidden="true">
          <defs>
            <pattern id="thai-wave-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 0 10 Q 25 0, 50 10 T 100 10"
                stroke={isDarkMode ? '#d4af37' : '#8b6914'}
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
            </pattern>
            
            <pattern id="thai-lotus-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="15" fill="none" stroke={isDarkMode ? '#ff69b4' : '#c71585'} strokeWidth="1" opacity="0.2" />
              <path
                d="M 40 25 Q 30 35, 40 45 Q 50 35, 40 25"
                fill={isDarkMode ? '#ff69b4' : '#c71585'}
                opacity="0.15"
              />
            </pattern>
          </defs>
          <rect width="50%" height="100%" fill="url(#thai-wave-pattern)" />
          <rect x="50%" width="50%" height="100%" fill="url(#thai-lotus-pattern)" />
        </svg>
      )}

      {/* Interactive dots layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />


      {/* Floating particles - optimized quantity */}
      <div className="absolute inset-0">
        <Particles 
          quantity={isMobile ? 40 : (isDarkMode ? 80 : 100)}
          className="h-full w-full" 
          color={isDarkMode ? '#8b691466' : '#d4af37'}
          size={isMobile ? 0.8 : 1}
          staticity={50}
          ease={80}
        />
      </div>

      <style jsx>{`
        @keyframes thaiFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(20px, -15px) rotate(3deg) scale(1.05); }
          50% { transform: translate(-10px, 10px) rotate(-2deg) scale(0.95); }
          75% { transform: translate(-15px, -8px) rotate(1deg) scale(1.02); }
        }
        
        @keyframes thaiRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes thaiWave {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(30px) scaleY(1.2); }
        }
        
        @keyframes thaiFlame {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: ${isDarkMode ? '0.15' : '0.25'}; }
          33% { transform: scale(1.15) rotate(3deg); opacity: ${isDarkMode ? '0.25' : '0.35'}; }
          66% { transform: scale(0.85) rotate(-3deg); opacity: ${isDarkMode ? '0.1' : '0.15'}; }
        }
      `}</style>
    </div>
  )
})

ThaiBackground.displayName = 'ThaiBackground'

export default ThaiBackground