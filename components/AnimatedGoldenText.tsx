"use client"

import React, { useEffect, useState, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

interface AnimatedGoldenTextProps {
  text: string
  className?: string
  delay?: number
}

const AnimatedGoldenText: React.FC<AnimatedGoldenTextProps> = memo(({ 
  text, 
  className,
  delay = 0.5 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)
    
    return () => clearTimeout(timer)
  }, [delay])
  
  // Memoize text splitting for performance
  const { firstPartChars, secondPartChars, secondPart } = useMemo(() => {
    const parts = text.split('•')
    const firstPart = parts[0].trim()
    const secondPart = parts[1]?.trim()
    
    return {
      firstPartChars: firstPart.split(''),
      secondPartChars: secondPart ? secondPart.split('') : [],
      secondPart
    }
  }, [text])
  
  return (
    <AnimatePresence>
      {isVisible && (
        <span className={cn("relative overflow-hidden inline-block", className)}>
          {/* First part animation */}
          {firstPartChars.map((char, index) => (
            <motion.span
              key={`first-${index}`}
              initial={{ 
                opacity: 0,
                y: 20,
                filter: 'blur(10px)'
              }}
              animate={{ 
                opacity: 1,
                y: 0,
                filter: 'blur(0px)'
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.05,
                ease: [0.215, 0.61, 0.355, 1.0] // Custom easing for zen-like feel
              }}
              className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-shift"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
          
          {/* Bullet separator with special animation */}
          {secondPart && (
            <motion.span
              initial={{ 
                opacity: 0,
                scale: 0,
                rotate: -180
              }}
              animate={{ 
                opacity: 1,
                scale: 1,
                rotate: 0
              }}
              transition={{
                duration: 1,
                delay: firstPartChars.length * 0.05 + 0.2,
                ease: [0.68, -0.55, 0.265, 1.55] // Bouncy effect for bullet
              }}
              className="inline-block mx-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-shift"
              style={{
                textShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
              }}
            >
              •
            </motion.span>
          )}
          
          {/* Second part animation */}
          {secondPartChars.map((char, index) => (
            <motion.span
              key={`second-${index}`}
              initial={{ 
                opacity: 0,
                y: 20,
                filter: 'blur(10px)'
              }}
              animate={{ 
                opacity: 1,
                y: 0,
                filter: 'blur(0px)'
              }}
              transition={{
                duration: 0.8,
                delay: (firstPartChars.length * 0.05) + 0.5 + (index * 0.05),
                ease: [0.215, 0.61, 0.355, 1.0]
              }}
              className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-shift"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
          
        </span>
      )}
    </AnimatePresence>
  )
})

AnimatedGoldenText.displayName = 'AnimatedGoldenText'

export default AnimatedGoldenText