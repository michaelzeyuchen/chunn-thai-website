'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUtensils, FaStar } from 'react-icons/fa'
import { BiSolidUserVoice, BiChevronDown } from 'react-icons/bi'
import MinimalCountdown from './MinimalCountdown'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import ThaiBackground from './ThaiBackground'
import AvatarOverlay from './AvatarOverlay'
import { gsap } from 'gsap'
import { useAutoAnimate } from '@formkit/auto-animate/react'

// Lazy load ZenHerbs for better performance
const ZenHerbs = dynamic(() => import('./ZenHerbs'), {
  ssr: false,
  loading: () => null
})

// Enhanced Tooltip with Aceternity-style effects
const Tooltip = ({ children, content, isDarkMode }: { children: React.ReactNode; content: string; isDarkMode: boolean }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <div className="relative">
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${
              isDarkMode ? 'bg-zinc-800/90 text-amber-400' : 'bg-white/90 text-orange-800'
            } shadow-xl backdrop-blur-sm z-50`}
          >
            {content}
            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 ${
              isDarkMode ? 'border-zinc-800/90' : 'border-white/90'
            } border-l-transparent border-r-transparent`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Aceternity-style Hover Card with mouse tracking
const HoverCard = ({ children, isDarkMode }: { children: React.ReactNode; isDarkMode: boolean }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, ${
                  isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 146, 60, 0.1)'
                }, transparent 40%)`
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ChunnLogo component with enhanced animations
interface ChunnLogoProps {
  isDarkMode: boolean;
}

const ChunnLogo: React.FC<ChunnLogoProps> = ({ isDarkMode }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        y: [0, -10, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }}
      className="relative w-full h-full flex flex-col items-center justify-center"
    >
      {/* Enhanced logo with morphing glow effect */}
      <motion.div 
        className="absolute top-[10%] left-[10%] right-[10%] bottom-[30%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.2,
          duration: 0.8
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Enhanced loading skeleton with advanced shimmer */}
          {!imageLoaded && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-zinc-800/50' : 'bg-orange-100/50'} animate-pulse relative overflow-hidden`}>
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </motion.div>
          )}
          <Image
            src="/chunn-thai-logo.svg"
            alt="Chunn Thai Cuisine - Authentic Thai Restaurant Logo"
            width={300}
            height={300}
            className="w-full h-full object-contain"
            priority
            onLoad={() => setImageLoaded(true)}
            style={{ 
              opacity: imageLoaded ? 1 : 0, 
              transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: imageLoaded ? 'scale(1)' : 'scale(0.95)',
              filter: `drop-shadow(0 10px 40px ${isDarkMode ? 'rgba(251, 191, 36, 0.4)' : 'rgba(251, 146, 60, 0.3)'})`
            }}
          />
        </div>
      </motion.div>
      
      {/* Enhanced text with gradient animation */}
      <motion.div
        className="absolute bottom-[10%] left-0 right-0 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.h1 
          className={`text-2xl md:text-3xl font-black tracking-wider drop-shadow-lg`}
          animate={{
            background: isDarkMode
              ? ['linear-gradient(45deg, #fbbf24 0%, #d4af37 50%, #fbbf24 100%)',
                 'linear-gradient(45deg, #d4af37 0%, #fbbf24 50%, #d4af37 100%)',
                 'linear-gradient(45deg, #fbbf24 0%, #d4af37 50%, #fbbf24 100%)']
              : ['linear-gradient(45deg, #c2410c 0%, #ea580c 50%, #c2410c 100%)',
                 'linear-gradient(45deg, #ea580c 0%, #c2410c 50%, #ea580c 100%)',
                 'linear-gradient(45deg, #c2410c 0%, #ea580c 50%, #c2410c 100%)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          CHUNN THAI
        </motion.h1>
        <p className={`text-lg md:text-xl font-medium ${isDarkMode ? 'text-amber-300' : 'text-orange-800'} tracking-[0.3em]`}>
          CUISINE
        </p>
      </motion.div>
    </motion.div>
  )
}

// GSAP-enhanced magnetic button component
const MagneticButton = ({ href, icon: Icon, color, label, isDarkMode, delay, isEmail = false, onClick }: { href?: string; icon: any; color: string; label: string; isDarkMode: boolean; delay: number; isEmail?: boolean; onClick?: (e: any) => void }) => {
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef(null)
  const magneticRef = useRef(null)
  
  useEffect(() => {
    if (!magneticRef.current) return
    
    const button = magneticRef.current
    
    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      })
    }
    
    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)"
      })
    }
    
    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
    if ('vibrate' in navigator && window.innerWidth < 768) {
      navigator.vibrate(5)
    }
    
    // Ripple effect
    const button = buttonRef.current
    const ripple = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.classList.add('ripple')
    
    button.appendChild(ripple)
    
    setTimeout(() => ripple.remove(), 600)
  }
  
  const Component = onClick ? 'button' : 'a'
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
    >
      <Tooltip content={label} isDarkMode={isDarkMode}>
        <Component
          ref={buttonRef}
          href={onClick ? undefined : href}
          onClick={handleClick}
          className={`relative block overflow-hidden transition-all duration-300`}
          aria-label={label}
          target={href?.startsWith('http') ? "_blank" : undefined}
          rel={href?.startsWith('http') ? "noopener noreferrer" : undefined}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ background: 'transparent' }}
        >
          <motion.div
            ref={magneticRef}
            className="relative"
            animate={{ 
              rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <Icon 
              size={24} 
              className={isDarkMode ? `text-${color}-400` : `text-${color}-600`}
            />
          </motion.div>
          
          {/* Advanced glow effect */}
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    background: `radial-gradient(circle, ${isDarkMode ? `var(--${color}-400)` : `var(--${color}-600)`} 0%, transparent 70%)`,
                    filter: 'blur(20px)'
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: `radial-gradient(circle, ${isDarkMode ? `var(--${color}-400)` : `var(--${color}-600)`} 0%, transparent 50%)`
                  }}
                />
              </>
            )}
          </AnimatePresence>
          
          <style jsx>{`
            .ripple {
              position: absolute;
              border-radius: 50%;
              background: ${isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.3)'};
              transform: scale(0);
              animation: ripple-animation 0.6s ease-out;
              pointer-events: none;
            }
            
            @keyframes ripple-animation {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
          `}</style>
        </Component>
      </Tooltip>
    </motion.div>
  )
}

export default function ChunnThaiUltraEnhanced() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const touchStartY = useRef<number | null>(null)
  const { scrollY } = useScroll()
  const [animateParent] = useAutoAnimate()
  
  // Enhanced parallax for background
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100])
  const backgroundRotate = useTransform(scrollY, [0, 1000], [0, 5])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDarkMode = () => {
    if ('vibrate' in navigator && window.innerWidth < 768) {
      navigator.vibrate(10)
    }
    setIsDarkMode(prev => !prev)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current) return
    
    const currentY = e.touches[0].clientY
    const distance = currentY - touchStartY.current
    
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 100))
      if (distance > 80 && !refreshing) {
        setRefreshing(true)
        if ('vibrate' in navigator) {
          navigator.vibrate(20)
        }
        setTimeout(() => {
          setRefreshing(false)
          setPullDistance(0)
          window.location.reload()
        }, 1500)
      }
    }
  }

  const handleTouchEnd = () => {
    if (!refreshing) {
      setPullDistance(0)
    }
    touchStartY.current = null
  }

  if (!mounted) return null

  return (
    <div 
      className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-orange-50'} transition-all duration-700 relative overflow-hidden`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateY(${pullDistance}px)`, transition: refreshing ? 'none' : 'transform 0.3s' }}
    >
      {/* Pull to refresh indicator - Ultra enhanced */}
      {(pullDistance > 0 || refreshing) && (
        <motion.div
          className="absolute top-0 left-0 right-0 flex justify-center items-center py-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: pullDistance > 30 ? 1 : 0 }}
          style={{ transform: `translateY(${-40}px)` }}
        >
          <motion.div
            animate={{ rotate: refreshing ? 360 : pullDistance * 3 }}
            transition={{ duration: refreshing ? 1 : 0, repeat: refreshing ? Infinity : 0 }}
            className={`w-8 h-8 rounded-full border-2 border-t-transparent ${
              isDarkMode ? 'border-amber-400' : 'border-orange-600'
            }`}
          />
        </motion.div>
      )}

      {/* Background with enhanced parallax and rotation */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          y: backgroundY,
          rotate: backgroundRotate
        }}
      >
        <ThaiBackground isDarkMode={isDarkMode} />
      </motion.div>
      
      {/* Ultra-enhanced floating light particles with GSAP physics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.9) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(251, 146, 60, 0.7) 0%, transparent 70%)',
              boxShadow: isDarkMode
                ? '0 0 25px rgba(251, 191, 36, 0.9)'
                : '0 0 20px rgba(251, 146, 60, 0.7)'
            }}
            animate={{
              y: ['100vh', '-10vh'],
              x: [0, Math.sin(i) * 50, 0],
              scale: [0, 1, 1.2, 0],
              opacity: [0, 1, 0.8, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Zen Herbs */}
      <React.Suspense fallback={null}>
        <ZenHerbs />
      </React.Suspense>

      {/* Main content with enhanced spacing */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-24" ref={animateParent}>
        {/* Logo section with ultra glow effect */}
        <HoverCard isDarkMode={isDarkMode}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-80 h-80 md:w-96 md:h-96 mb-8 cursor-pointer -mt-12 focus:outline-none relative"
            onClick={toggleDarkMode}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleDarkMode()
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={0}
            role="button"
            aria-label="Toggle dark mode"
          >
            {/* Morphing glow animation */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              animate={{
                background: isDarkMode
                  ? ['radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.2) 0%, transparent 60%)',
                     'radial-gradient(circle at 70% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
                     'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.2) 0%, transparent 60%)',
                     'radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
                     'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.2) 0%, transparent 60%)']
                  : ['radial-gradient(circle at 30% 30%, rgba(251, 146, 60, 0.2) 0%, transparent 60%)',
                     'radial-gradient(circle at 70% 70%, rgba(251, 146, 60, 0.3) 0%, transparent 60%)',
                     'radial-gradient(circle at 30% 70%, rgba(251, 146, 60, 0.2) 0%, transparent 60%)',
                     'radial-gradient(circle at 70% 30%, rgba(251, 146, 60, 0.3) 0%, transparent 60%)',
                     'radial-gradient(circle at 30% 30%, rgba(251, 146, 60, 0.2) 0%, transparent 60%)']
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <ChunnLogo isDarkMode={isDarkMode} />
          </motion.div>
        </HoverCard>

        {/* Enhanced Countdown with AutoAnimate */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <MinimalCountdown isDark={isDarkMode} />
        </motion.div>

        {/* Ultra-enhanced Contact Information Grid with GSAP magnetic effects */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12"
        >
          <MagneticButton
            href="https://www.facebook.com/profile.php?id=61576853373611"
            icon={FaFacebook}
            color="blue"
            label="Follow us on Facebook"
            isDarkMode={isDarkMode}
            delay={0.7}
          />
          <MagneticButton
            href="https://www.instagram.com/chunn_thai/"
            icon={FaInstagram}
            color="pink"
            label="Follow us on Instagram"
            isDarkMode={isDarkMode}
            delay={0.8}
          />
          <MagneticButton
            href="tel:+61432506436"
            icon={FaPhone}
            color="green"
            label="Call us: 0432 506 436"
            isDarkMode={isDarkMode}
            delay={0.9}
          />
          <MagneticButton
            href="mailto:cuisine@chunnthai.com.au"
            icon={FaEnvelope}
            color="purple"
            label="Email us"
            isDarkMode={isDarkMode}
            delay={1.0}
            isEmail={true}
          />
          <MagneticButton
            href="https://maps.google.com/?q=Shop+21,+HomeCo+Menai+Marketplace,+152-194+Allison+Crescent,+Menai+NSW+2234"
            icon={FaMapMarkerAlt}
            color="red"
            label="Get directions"
            isDarkMode={isDarkMode}
            delay={1.1}
          />
          <MagneticButton
            onClick={() => setIsAvatarOpen(true)}
            icon={BiSolidUserVoice}
            color="orange"
            label="Talk to our assistant"
            isDarkMode={isDarkMode}
            delay={1.2}
          />
        </motion.div>

        {/* Animated Scroll Indicator */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BiChevronDown className={`text-3xl ${isDarkMode ? 'text-amber-400/50' : 'text-orange-600/50'}`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <p className={`text-sm font-medium ${
            isDarkMode ? 'text-zinc-400' : 'text-orange-700'
          }`}>
            © 2025 Chunn Thai Restaurant. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* Avatar Overlay */}
      <AvatarOverlay 
        isOpen={isAvatarOpen} 
        onClose={() => setIsAvatarOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Custom CSS for additional effects */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        
        .gradient-text {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        
        .gradient-text-dark {
          background-image: linear-gradient(
            45deg,
            #fbbf24 0%,
            #d4af37 25%,
            #fbbf24 50%,
            #d4af37 75%,
            #fbbf24 100%
          );
        }
        
        .gradient-text-light {
          background-image: linear-gradient(
            45deg,
            #c2410c 0%,
            #ea580c 25%,
            #c2410c 50%,
            #ea580c 75%,
            #c2410c 100%
          );
        }
        
        :root {
          --blue-400: #60a5fa;
          --blue-600: #2563eb;
          --pink-400: #f472b6;
          --pink-600: #db2777;
          --green-400: #4ade80;
          --green-600: #16a34a;
          --purple-400: #c084fc;
          --purple-600: #9333ea;
          --red-400: #f87171;
          --red-600: #dc2626;
          --orange-400: #fb923c;
          --orange-600: #ea580c;
        }
      `}</style>
    </div>
  )
}