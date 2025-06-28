'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUtensils, FaStar, FaArrowRight } from 'react-icons/fa'
import { BiSolidUserVoice, BiChevronDown } from 'react-icons/bi'
import MinimalCountdown from './MinimalCountdown'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import ThaiBackground from './ThaiBackground'
import AvatarOverlay from './AvatarOverlay'
import autoAnimate from '@formkit/auto-animate'
import gsap from 'gsap'

// Lazy load ZenHerbs
const ZenHerbs = dynamic(() => import('./ZenHerbs'), {
  ssr: false,
  loading: () => null
})

// Aceternity-inspired hover card component
const HoverCard = ({ children, className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
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
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 191, 36, 0.1), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  )
}

// GSAP magnetic button effect
const MagneticButton = ({ children, href, icon: Icon, color, label, isDarkMode, delay, isEmail = false, onClick }) => {
  const buttonRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!buttonRef.current) return

    const button = buttonRef.current
    let animationId = null

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      if (animationId) cancelAnimationFrame(animationId)
      
      animationId = requestAnimationFrame(() => {
        gsap.to(button, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out"
        })
      })
    }

    const handleMouseLeave = () => {
      if (animationId) cancelAnimationFrame(animationId)
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
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault()
      onClick()
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
    
    if ('vibrate' in navigator && window.innerWidth < 768) {
      navigator.vibrate(5)
    }
  }

  const Component = onClick ? 'button' : 'a'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="relative"
    >
      <Component
        ref={buttonRef}
        href={onClick ? undefined : href}
        onClick={handleClick}
        className={`magnetic-button relative block p-4 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? `bg-zinc-800/50 hover:bg-zinc-700/50 text-${color}-400` 
            : `bg-white/70 hover:bg-white text-${color}-600`
        } shadow-lg hover:shadow-xl backdrop-blur-sm overflow-hidden`}
        aria-label={label}
        target={href?.startsWith('http') ? "_blank" : undefined}
        rel={href?.startsWith('http') ? "noopener noreferrer" : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={28} />
        </motion.div>
        
        {/* Tooltip with slide animation */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className={`absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                isDarkMode ? 'bg-zinc-800 text-amber-400' : 'bg-white text-orange-800'
              } shadow-xl z-50 font-medium`}
            >
              {label}
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 ${
                isDarkMode ? 'border-zinc-800' : 'border-white'
              } border-l-transparent border-r-transparent`} />
            </motion.div>
          )}
        </AnimatePresence>
      </Component>
      
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
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
    </motion.div>
  )
}

// Enhanced logo with morphing glow effect
const EnhancedChunnLogo = ({ isDarkMode }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const glowRef = useRef(null)

  useEffect(() => {
    if (!glowRef.current) return

    // Morphing glow animation using GSAP
    gsap.to(glowRef.current, {
      scale: 1.2,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    })
  }, [])

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
      {/* Morphing glow background */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, transparent 60%)'
        }}
      />

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
          {/* Ultra smooth loading with gradient shimmer */}
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
              <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-zinc-800/50' : 'bg-orange-100/50'} relative overflow-hidden`}>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
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
              filter: `drop-shadow(0 10px 30px ${isDarkMode ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 146, 60, 0.2)'})`
            }}
          />
        </div>
      </motion.div>
      
      {/* Text with gradient animation */}
      <motion.div
        className="absolute bottom-[10%] left-0 right-0 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.h1 
          className={`text-2xl md:text-3xl font-black tracking-wider bg-gradient-to-r bg-clip-text text-transparent drop-shadow-lg`}
          animate={{
            backgroundImage: isDarkMode ? [
              'linear-gradient(to right, #fbbf24, #f59e0b)',
              'linear-gradient(to right, #f59e0b, #fbbf24)',
              'linear-gradient(to right, #fbbf24, #f59e0b)'
            ] : [
              'linear-gradient(to right, #ea580c, #dc2626)',
              'linear-gradient(to right, #dc2626, #ea580c)',
              'linear-gradient(to right, #ea580c, #dc2626)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
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

export default function ChunnThaiUltraEnhanced() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const touchStartY = useRef(null)
  const { scrollY } = useScroll()
  const featureCardsRef = useRef(null)
  const menuPreviewRef = useRef(null)
  
  // Ultra smooth parallax
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100])
  const particlesY = useTransform(scrollY, [0, 300], [0, -50])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Auto animate for smooth transitions
    if (featureCardsRef.current) {
      autoAnimate(featureCardsRef.current)
    }
    if (menuPreviewRef.current) {
      autoAnimate(menuPreviewRef.current)
    }
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

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
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
      {/* Pull to refresh with smooth animation */}
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

      {/* Ultra smooth parallax background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <ThaiBackground isDarkMode={isDarkMode} />
      </motion.div>
      
      {/* Enhanced floating particles with physics */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none z-10"
        style={{ y: particlesY }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
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
              x: [
                0, 
                Math.random() * 60 - 30, 
                Math.random() * -60 + 30,
                0
              ],
              scale: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1]
            }}
          />
        ))}
      </motion.div>
      
      {/* Zen Herbs */}
      <React.Suspense fallback={null}>
        <ZenHerbs />
      </React.Suspense>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-24">
        {/* Logo with ultra effects */}
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
          <EnhancedChunnLogo isDarkMode={isDarkMode} />
        </motion.div>

        {/* Enhanced Countdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <MinimalCountdown isDark={isDarkMode} />
        </motion.div>

        {/* Quick Info Bar with hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <HoverCard className={`flex flex-wrap justify-center gap-6 px-6 py-3 rounded-full backdrop-blur-md ${
            isDarkMode ? 'bg-zinc-800/30 border border-amber-400/20' : 'bg-white/50 border border-orange-200'
          }`}>
            {[
              { icon: FaMapMarkerAlt, text: 'Shop 21, HomeCo Menai' },
              { icon: FaClock, text: 'Opening August 2025' },
              { icon: FaUtensils, text: 'Authentic Thai Cuisine' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`flex items-center gap-2 text-sm ${
                  isDarkMode ? 'text-amber-400/90' : 'text-orange-700'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className="text-xs" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </HoverCard>
        </motion.div>

        {/* Ultra Enhanced Contact Grid with Magnetic Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-6 mb-12"
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

        {/* Feature Cards with AutoAnimate and Hover Effects */}
        <motion.div
          ref={featureCardsRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12"
        >
          {[
            { icon: '🌶️', title: 'Authentic Flavors', description: 'Traditional recipes from Thailand', color: 'red' },
            { icon: '🌿', title: 'Fresh Ingredients', description: 'Locally sourced & imported spices', color: 'green' },
            { icon: '⭐', title: 'Premium Experience', description: 'Modern dining with Thai hospitality', color: 'yellow' }
          ].map((feature, index) => (
            <HoverCard key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl backdrop-blur-md h-full ${
                  isDarkMode 
                    ? 'bg-zinc-800/30 border border-amber-400/20' 
                    : 'bg-white/50 border border-orange-200'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className={`text-lg font-bold mb-2 ${
                  isDarkMode ? 'text-amber-400' : 'text-orange-800'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-zinc-300' : 'text-gray-700'
                }`}>
                  {feature.description}
                </p>
                <motion.div
                  className={`mt-4 flex items-center text-sm font-medium ${
                    isDarkMode ? 'text-amber-400' : 'text-orange-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  Learn more <FaArrowRight className="ml-2 text-xs" />
                </motion.div>
              </motion.div>
            </HoverCard>
          ))}
        </motion.div>

        {/* Smooth Scroll Indicator */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <BiChevronDown className={`text-3xl ${isDarkMode ? 'text-amber-400/50' : 'text-orange-600/50'}`} />
              </motion.div>
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

      {/* Menu Preview Section with Stagger Animation */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className={`text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent`}
              animate={{
                backgroundImage: isDarkMode ? [
                  'linear-gradient(to right, #fbbf24, #f59e0b)',
                  'linear-gradient(to right, #f59e0b, #fbbf24)',
                  'linear-gradient(to right, #fbbf24, #f59e0b)'
                ] : [
                  'linear-gradient(to right, #ea580c, #dc2626)',
                  'linear-gradient(to right, #dc2626, #ea580c)',
                  'linear-gradient(to right, #ea580c, #dc2626)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              A Culinary Journey Awaits
            </motion.h2>
            <p className={`text-lg ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
              Experience the perfect blend of traditional Thai recipes and contemporary presentation
            </p>
          </motion.div>

          {/* Staggered Menu Cards */}
          <div ref={menuPreviewRef} className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: 'Appetizers',
                items: ['Spring Rolls', 'Satay Skewers', 'Tom Yum Soup'],
                icon: '🥟',
                color: 'orange'
              },
              {
                category: 'Main Courses',
                items: ['Pad Thai', 'Green Curry', 'Massaman Beef'],
                icon: '🍜',
                color: 'green'
              },
              {
                category: 'Desserts',
                items: ['Mango Sticky Rice', 'Thai Tea Ice Cream', 'Coconut Pudding'],
                icon: '🍮',
                color: 'purple'
              }
            ].map((menu, index) => (
              <HoverCard key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-3xl backdrop-blur-md h-full ${
                    isDarkMode 
                      ? 'bg-zinc-800/40 border border-amber-400/30' 
                      : 'bg-white/60 border border-orange-300'
                  } shadow-xl hover:shadow-2xl transition-all duration-300 group`}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className="text-5xl mb-4"
                    animate={{ 
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    {menu.icon}
                  </motion.div>
                  <h3 className={`text-xl font-bold mb-4 ${
                    isDarkMode ? 'text-amber-400' : 'text-orange-800'
                  }`}>
                    {menu.category}
                  </h3>
                  <ul className="space-y-3">
                    {menu.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.2 + itemIndex * 0.1,
                          type: "spring"
                        }}
                        className={`flex items-center ${
                          isDarkMode ? 'text-zinc-300' : 'text-gray-600'
                        } group-hover:translate-x-2 transition-transform`}
                      >
                        <FaStar className={`text-xs mr-2 text-${menu.color}-400`} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>

      {/* Avatar Overlay */}
      <AvatarOverlay 
        isOpen={isAvatarOpen} 
        onClose={() => setIsAvatarOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}
