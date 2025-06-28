'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSun, FaMoon, FaUtensils } from 'react-icons/fa'
import Link from 'next/link'

interface ChunnLogoProps {
  isDarkMode: boolean;
}

// ChunnLogo component defined outside to prevent recreation
const ChunnLogo: React.FC<ChunnLogoProps> = ({ isDarkMode }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  return (
    <motion.div
      animate={{ 
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className="relative w-full h-full"
    >
      {/* Lotus petals background */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {/* Outer petals */}
        {[0, 72, 144, 216, 288].map((rotation, i) => (
          <motion.path
            key={i}
            d={`M 50 50 Q ${50 + 30 * Math.cos((rotation - 36) * Math.PI / 180)} ${50 + 30 * Math.sin((rotation - 36) * Math.PI / 180)} ${50 + 35 * Math.cos(rotation * Math.PI / 180)} ${50 + 35 * Math.sin(rotation * Math.PI / 180)} Q ${50 + 30 * Math.cos((rotation + 36) * Math.PI / 180)} ${50 + 30 * Math.sin((rotation + 36) * Math.PI / 180)} 50 50`}
            fill={isDarkMode ? '#fbbf24' : '#f97316'}
            opacity="0.8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: i * 0.1,
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1.5
            }}
          />
        ))}
        {/* Inner petals */}
        {[36, 108, 180, 252, 324].map((rotation, i) => (
          <motion.path
            key={`inner-${i}`}
            d={`M 50 50 Q ${50 + 20 * Math.cos((rotation - 36) * Math.PI / 180)} ${50 + 20 * Math.sin((rotation - 36) * Math.PI / 180)} ${50 + 25 * Math.cos(rotation * Math.PI / 180)} ${50 + 25 * Math.sin(rotation * Math.PI / 180)} Q ${50 + 20 * Math.cos((rotation + 36) * Math.PI / 180)} ${50 + 20 * Math.sin((rotation + 36) * Math.PI / 180)} 50 50`}
            fill={isDarkMode ? '#f59e0b' : '#ea580c'}
            opacity="0.9"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.5 + i * 0.1,
              type: "spring",
              stiffness: 400,
              damping: 10
            }}
          />
        ))}
      </svg>
      
      {/* Center image with Thai patterns */}
      <motion.div 
        className="absolute inset-[15%] rounded-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.2,
          duration: 0.8
        }}
      >
        <div className="relative w-full h-full">
          {/* Thai pattern border */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <circle cx="50" cy="50" r="48" fill="none" stroke={isDarkMode ? '#fbbf24' : '#f97316'} strokeWidth="2" opacity="0.5" />
            <circle cx="50" cy="50" r="44" fill="none" stroke={isDarkMode ? '#f59e0b' : '#ea580c'} strokeWidth="1" opacity="0.3" />
          </svg>
          
          {/* Animated glow effect */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" as const,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 ${isDarkMode ? 'bg-amber-400' : 'bg-orange-500'} rounded-full blur-xl opacity-30`}
          />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: "loop" as const,
              ease: "linear"
            }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 48 * Math.cos(angle * Math.PI / 180)}
                  y2={50 + 48 * Math.sin(angle * Math.PI / 180)}
                  stroke={isDarkMode ? '#fbbf24' : '#f97316'}
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
            </svg>
          </motion.div>
          
          <img 
            src="/chunn-thai-logo.svg"
            alt="Chunn Thai Restaurant"
            className="absolute inset-[10%] w-[80%] h-[80%] object-contain"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
          />
        </div>
      </motion.div>
      
      {/* Thai decorative elements */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          repeatType: "loop" as const,
          ease: "linear"
        }}
        className="absolute inset-0"
      >
        {[0, 90, 180, 270].map((angle, i) => (
          <div
            key={`decor-${i}`}
            className={`absolute w-2 h-2 ${isDarkMode ? 'bg-amber-400' : 'bg-orange-600'} rounded-full`}
            style={{
              top: '10%',
              left: '50%',
              transform: `rotate(${angle}deg) translateX(35px)`,
              transformOrigin: '0 40px'
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
};

ChunnLogo.displayName = 'ChunnLogo';

const ChunnThaiHomepage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false) // Default to light mode
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [actualPositions, setActualPositions] = useState({
    logo: { x: 0, y: 0, width: 0, height: 0 },
    countdown: { x: 0, y: 0, width: 0, height: 0 },
    contact: { x: 0, y: 0, width: 0, height: 0 }
  })
  
  const logoRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Import RotatingHerbs with React.lazy for code splitting
  const RotatingHerbs = React.lazy(() => import('./RotatingHerbs-Zen'))

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Debug mode toggle
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setDebugMode(prev => !prev)
      }
    }
    
    // For mobile, also add touch handler for a specific area
    const handleTouch = (e: TouchEvent) => {
      // Check if touch is in top-left corner (100x100 area)
      const touch = e.touches[0]
      if (touch.clientX < 100 && touch.clientY < 100) {
        setDebugMode(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('touchstart', handleTouch)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('touchstart', handleTouch)
    }
  }, [])

  // Measure actual positions after render
  useEffect(() => {
    const measureElements = () => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect()
        setActualPositions(prev => ({
          ...prev,
          logo: { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
        }))
      }
      if (countdownRef.current) {
        const rect = countdownRef.current.getBoundingClientRect()
        setActualPositions(prev => ({
          ...prev,
          countdown: { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
        }))
      }
      if (contactRef.current) {
        const rect = contactRef.current.getBoundingClientRect()
        setActualPositions(prev => ({
          ...prev,
          contact: { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
        }))
      }
    }
    
    // Measure initially
    measureElements()
    
    // Re-measure on resize
    window.addEventListener('resize', measureElements)
    
    // Re-measure after animations (using timeout as fallback)
    const timeout = setTimeout(measureElements, 1000)
    
    return () => {
      window.removeEventListener('resize', measureElements)
      clearTimeout(timeout)
    }
  }, [isMobile])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2025-08-01T00:00:00+10:00') // August 1st, 2025 Sydney time
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        const parts = []
        if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`)
        if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
        if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
        if (seconds >= 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`)
        
        setTimeLeft(parts.join(', '))
      } else {
        setTimeLeft('Now Open!')
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  const triangleHeight = isMobile ? 500 : 600
  const triangleBase = isMobile ? 320 : 500
  const logoSize = isMobile ? 200 : 280
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  
  const viewportWidth = dimensions.width
  const viewportHeight = dimensions.height
  
  const triangleTopY = isMobile ? 60 : 30
  const triangleBottomY = triangleTopY + triangleHeight
  const triangleCenterX = viewportWidth / 2
  
  // Calculate triangle corners
  const triangleTopX = triangleCenterX
  const triangleLeftX = triangleCenterX - triangleBase / 2
  const triangleRightX = triangleCenterX + triangleBase / 2
  
  const logoY = triangleTopY + triangleHeight * 0.08
  
  // Use actual positions for boundary calculations when available
  const logoCircleRadius = actualPositions.logo.width > 0 ? actualPositions.logo.width / 2 : logoSize * 0.5
  const logoCenterX = actualPositions.logo.width > 0 ? actualPositions.logo.x + actualPositions.logo.width / 2 : viewportWidth / 2
  const logoCenterY = actualPositions.logo.height > 0 ? actualPositions.logo.y + actualPositions.logo.height / 2 : logoY + logoSize / 2
  
  const countdownY = triangleTopY + triangleHeight * 0.5
  const contactY = triangleTopY + triangleHeight * 0.72
  
  const updateObstacles = () => {
    const actualLogoCircle = {
      type: 'circle' as const,
      x: actualPositions.logo.width > 0 ? actualPositions.logo.x + actualPositions.logo.width / 2 : viewportWidth / 2,
      y: actualPositions.logo.height > 0 ? actualPositions.logo.y + actualPositions.logo.height / 2 : logoY + logoSize / 2,
      radius: actualPositions.logo.width > 0 ? actualPositions.logo.width / 2 : logoSize * 0.5
    }
    
    if (isMobile) {
      const mobileBarrierMultiplier = 1.02
      return [
        actualLogoCircle,
        {
          type: 'rectangle' as const,
          x: actualPositions.countdown.x || (viewportWidth * 0.1),
          y: actualPositions.countdown.y || countdownY,
          width: actualPositions.countdown.width || (viewportWidth * 0.8),
          height: (actualPositions.countdown.height || 48) * mobileBarrierMultiplier
        },
        {
          type: 'rectangle' as const,
          x: actualPositions.contact.x || (viewportWidth * 0.1),
          y: actualPositions.contact.y || contactY,
          width: actualPositions.contact.width || (viewportWidth * 0.8),
          height: (actualPositions.contact.height || 100) * mobileBarrierMultiplier
        }
      ]
    } else {
      return [
        actualLogoCircle,
        {
          type: 'triangle' as const,
          apex: { x: viewportWidth / 2, y: countdownY - 24 },
          leftBase: { x: viewportWidth / 2 - triangleBase * 0.4, y: countdownY + 50 },
          rightBase: { x: viewportWidth / 2 + triangleBase * 0.4, y: countdownY + 50 }
        }
      ]
    }
  }

  const obstacles = updateObstacles()

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'} transition-all duration-700 relative overflow-hidden`}>
      {/* Subtle animated background patterns */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className={`absolute w-16 h-16 ${isDarkMode ? 'bg-amber-400' : 'bg-orange-500'} rounded-full blur-3xl`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.02
            }}
          />
        ))}
      </div>

      {/* Herb Animation - Behind content */}
      <React.Suspense fallback={null}>
        <RotatingHerbs obstacles={obstacles} />
      </React.Suspense>

      {/* Main content - On top of herbs */}
      <div className="relative z-20 w-full min-h-screen">
        {/* Logo at the top of the triangle - Now clickable for dark mode toggle */}
        <motion.div
          ref={logoRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
          style={{
            top: logoY,
            width: logoSize,
            height: logoSize
          }}
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative w-full h-full">
            <ChunnLogo isDarkMode={isDarkMode} />
            
            {/* Glow effect */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-amber-400' : 'bg-orange-500'} rounded-full blur-3xl opacity-20 animate-pulse`} />
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          ref={countdownRef}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`absolute left-1/2 transform -translate-x-1/2 text-center ${isMobile ? 'w-[80vw]' : ''}`}
          style={{
            top: countdownY
          }}
        >
          <p className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold ${isDarkMode ? 'text-amber-400' : 'text-orange-800'} font-mono`}>
            {timeLeft}
          </p>
        </motion.div>

        {/* Contact Information and Disclaimer */}
        <motion.div
          ref={contactRef}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`absolute left-1/2 transform -translate-x-1/2 text-center ${isMobile ? 'w-[80vw]' : ''}`}
          style={{
            top: contactY
          }}
        >
          <div className={`flex justify-center items-center ${isMobile ? 'gap-3' : 'gap-4'}`}>
            <a 
              href="https://www.facebook.com/profile.php?id=61576853373611" 
              className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors inline-flex items-center justify-center p-2 -m-2`}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <FaFacebook size={isMobile ? 20 : 24} style={{ pointerEvents: 'none' }} />
            </a>
            <a 
              href="https://www.instagram.com/chunn_thai/" 
              className={`${isDarkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'} transition-colors inline-flex items-center justify-center p-2 -m-2`}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <FaInstagram size={isMobile ? 20 : 24} style={{ pointerEvents: 'none' }} />
            </a>
            <a 
              href="tel:+61432506436" 
              className={`${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors inline-flex items-center justify-center p-2 -m-2`}
              aria-label="Phone"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <FaPhone size={isMobile ? 18 : 22} style={{ pointerEvents: 'none' }} />
            </a>
            <button
              onClick={() => {
                // Try multiple methods to ensure email client opens
                const email = 'cuisine@chunnthai.com.au';
                
                // Method 1: Direct window.location
                window.location.href = `mailto:${email}`;
                
                // Method 2: Always copy email to clipboard as well
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(email).then(() => {
                    setEmailCopied(true);
                    setTimeout(() => setEmailCopied(false), 3000);
                  }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement("textarea");
                    textArea.value = email;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-999999px";
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                      document.execCommand('copy');
                      setEmailCopied(true);
                      setTimeout(() => setEmailCopied(false), 3000);
                    } catch (err) {
                      console.error('Failed to copy email:', err);
                    }
                    document.body.removeChild(textArea);
                  });
                }
              }}
              className={`${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} transition-colors inline-flex items-center justify-center p-2 -m-2 cursor-pointer bg-transparent border-none relative`}
              aria-label="Email"
              title="Email: cuisine@chunnthai.com.au (Click to open email client or copy)"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <FaEnvelope size={isMobile ? 20 : 24} style={{ pointerEvents: 'none' }} />
              {emailCopied && (
                <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs ${isDarkMode ? 'bg-zinc-700 text-zinc-100' : 'bg-gray-800 text-white'} rounded whitespace-nowrap`}>
                  Email copied!
                </span>
              )}
            </button>
            <a 
              href="https://maps.google.com/?q=Shop+21,+HomeCo+Menai+Marketplace,+152-194+Allison+Crescent,+Menai+NSW+2234" 
              className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors inline-flex items-center justify-center p-2 -m-2`}
              aria-label="Address"
              target="_blank"
              rel="noopener noreferrer"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <FaMapMarkerAlt size={isMobile ? 20 : 24} style={{ pointerEvents: 'none' }} />
            </a>
            <Link 
              href="/menu" 
              className={`${isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-orange-600 hover:text-orange-700'} transition-colors inline-flex items-center justify-center p-2 -m-2`}
              aria-label="Menu"
              title="View Our Menu (Preliminary)"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <FaUtensils size={isMobile ? 18 : 22} style={{ pointerEvents: 'none' }} />
            </Link>
          </div>
        </motion.div>

        {/* Disclaimer at the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className={`absolute bottom-4 left-0 right-0 text-center px-4`}
        >
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} ${isDarkMode ? 'text-zinc-400' : 'text-orange-600/70'}`}>
            © 2024 Chunn Thai Restaurant. All rights reserved. | Powered by authentic Thai flavors
          </p>
        </motion.div>


        {/* Debug mode toggle hint for mobile */}
        {isMobile && !debugMode && (
          <div className="absolute top-0 left-0 w-24 h-24" 
               onClick={() => setDebugMode(true)}
               style={{ opacity: 0 }} />
        )}

        {/* Debug visualization */}
        {debugMode && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {/* Show boundaries */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Logo circle - RED */}
              <circle
                cx={logoCenterX}
                cy={logoCenterY}
                r={logoCircleRadius}
                fill="none"
                stroke="red"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Actual positions - GREEN */}
              {actualPositions.logo.width > 0 && (
                <circle
                  cx={actualPositions.logo.x + actualPositions.logo.width / 2}
                  cy={actualPositions.logo.y + actualPositions.logo.height / 2}
                  r={actualPositions.logo.width / 2}
                  fill="none"
                  stroke="lime"
                  strokeWidth="2"
                />
              )}
              
              {isMobile ? (
                <>
                  {/* Countdown rectangle */}
                  <rect
                    x={actualPositions.countdown.x || viewportWidth * 0.1}
                    y={actualPositions.countdown.y || countdownY}
                    width={actualPositions.countdown.width || viewportWidth * 0.8}
                    height={actualPositions.countdown.height || 48}
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Contact rectangle */}
                  <rect
                    x={actualPositions.contact.x || viewportWidth * 0.1}
                    y={actualPositions.contact.y || contactY}
                    width={actualPositions.contact.width || viewportWidth * 0.8}
                    height={actualPositions.contact.height || 100}
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Actual positions */}
                  {actualPositions.countdown.width > 0 && (
                    <rect
                      x={actualPositions.countdown.x}
                      y={actualPositions.countdown.y}
                      width={actualPositions.countdown.width}
                      height={actualPositions.countdown.height}
                      fill="none"
                      stroke="lime"
                      strokeWidth="2"
                    />
                  )}
                  {actualPositions.contact.width > 0 && (
                    <rect
                      x={actualPositions.contact.x}
                      y={actualPositions.contact.y}
                      width={actualPositions.contact.width}
                      height={actualPositions.contact.height}
                      fill="none"
                      stroke="lime"
                      strokeWidth="2"
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Triangle for desktop */}
                  <path
                    d={`M ${triangleCenterX} ${countdownY - 24} L ${triangleCenterX - triangleBase * 0.4} ${countdownY + 50} L ${triangleCenterX + triangleBase * 0.4} ${countdownY + 50} Z`}
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </>
              )}
            </svg>
            
            {/* Debug info */}
            <div className="absolute top-16 left-4 bg-black/80 text-white p-2 rounded text-xs">
              <p>Debug Mode (Press D to toggle)</p>
              <p>Red: Boundaries | Green: Actual</p>
              <p>Device: {isMobile ? 'Mobile' : 'Desktop'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChunnThaiHomepage