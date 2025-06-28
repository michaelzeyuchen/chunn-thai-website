'use client'

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { BiSolidUserVoice } from 'react-icons/bi'
import MinimalCountdown from './MinimalCountdown'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import ThaiBackground from './ThaiBackground'
import AvatarOverlay from './AvatarOverlay'

// Lazy load ZenHerbs for better performance
const ZenHerbs = dynamic(() => import('./ZenHerbs'), {
  ssr: false,
  loading: () => null
})

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
            {/* Just the logo image - no SVG petals since the new logo already has them */}
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
                {/* Loading skeleton */}
                {!imageLoaded && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      background: [
                        'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-zinc-800/50' : 'bg-orange-100/50'} animate-pulse`} />
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
                    transform: imageLoaded ? 'scale(1)' : 'scale(0.95)'
                  }}
                />
              </div>
            </motion.div>
            
            {/* Text below logo */}
            <motion.div
              className="absolute bottom-[10%] left-0 right-0 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className={`text-xl md:text-2xl font-black tracking-wider ${isDarkMode ? 'text-amber-400' : 'text-orange-900'} drop-shadow-lg`}>
                CHUNN THAI
              </h1>
              <p className={`text-base md:text-lg font-medium ${isDarkMode ? 'text-amber-300' : 'text-orange-800'} tracking-[0.2em]`}>
                CUISINE
              </p>
            </motion.div>
          </motion.div>
        )
      }

export default function ChunnThaiHomepageOld() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleDarkMode = () => {
    // Haptic feedback for mobile
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
        // Haptic feedback for refresh
        if ('vibrate' in navigator) {
          navigator.vibrate(20)
        }
        // Simulate refresh
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
      {/* Pull to refresh indicator */}
      {(pullDistance > 0 || refreshing) && (
        <motion.div
          className="absolute top-0 left-0 right-0 flex justify-center items-center py-4"
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
      {/* Intricate Thai-inspired pattern background */}
      <ThaiBackground isDarkMode={isDarkMode} />
      
      
      {/* Floating light particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, transparent 70%)',
              boxShadow: isDarkMode
                ? '0 0 20px rgba(251, 191, 36, 0.8)'
                : '0 0 15px rgba(251, 146, 60, 0.6)'
            }}
            animate={{
              y: ['100vh', '-10vh'],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Zen Herb Animation - Below all content */}
      <React.Suspense fallback={null}>
        <ZenHerbs />
      </React.Suspense>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-24">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-72 h-72 md:w-96 md:h-96 mb-8 cursor-pointer -mt-12 focus:outline-none"
          onClick={toggleDarkMode}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleDarkMode()
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          tabIndex={0}
          role="button"
          aria-label="Toggle dark mode"
        >
          <ChunnLogo isDarkMode={isDarkMode} />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <MinimalCountdown isDark={isDarkMode} />
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: [0, -5, 0],
            opacity: 1 
          }}
          transition={{ 
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            },
            opacity: {
              duration: 0.8,
              delay: 0.6
            }
          }}
          className="flex gap-4 mb-8 relative"
        >
          <motion.a 
            href="https://www.facebook.com/profile.php?id=61576853373611" 
            className={`relative ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent`}
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onTouchStart={() => {
              if ('vibrate' in navigator && window.innerWidth < 768) {
                navigator.vibrate(5)
              }
            }}
            tabIndex={0}
          >
            <FaFacebook size={28} />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 1, scale: 2 }}
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 0.6, scale: 1.2 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 50%)',
                filter: 'blur(5px)',
              }}
            />
          </motion.a>
          <motion.a 
            href="https://www.instagram.com/chunn_thai/" 
            className={`relative ${isDarkMode ? 'text-pink-400' : 'text-pink-600'} transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:ring-offset-2 focus:ring-offset-transparent`}
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onTouchStart={() => {
              if ('vibrate' in navigator && window.innerWidth < 768) {
                navigator.vibrate(5)
              }
            }}
            tabIndex={0}
          >
            <FaInstagram size={28} />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 1, scale: 2 }}
              style={{
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 0.6, scale: 1.2 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 50%)',
                filter: 'blur(5px)',
              }}
            />
          </motion.a>
          <motion.a 
            href="tel:+61432506436" 
            className={`relative ${isDarkMode ? 'text-green-400' : 'text-green-600'} transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-transparent`}
            aria-label="Phone"
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onTouchStart={() => {
              if ('vibrate' in navigator && window.innerWidth < 768) {
                navigator.vibrate(5)
              }
            }}
            tabIndex={0}
          >
            <FaPhone size={26} />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 1, scale: 2 }}
              style={{
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 0.6, scale: 1.2 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 50%)',
                filter: 'blur(5px)',
              }}
            />
          </motion.a>
          <a 
            href="mailto:cuisine@chunnthai.com.au" 
            className={`relative ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-transparent block`}
            aria-label="Email"
            tabIndex={0}
          >
            <motion.div
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onTouchStart={() => {
                if ('vibrate' in navigator && window.innerWidth < 768) {
                  navigator.vibrate(5)
                }
              }}
              className="relative"
            >
              <FaEnvelope size={28} />
              <motion.span
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0, scale: 0.5 }}
                whileHover={{ opacity: 1, scale: 2 }}
                style={{
                  background: 'radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, transparent 70%)',
                  filter: 'blur(15px)',
                }}
              />
              <motion.span
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 0.6, scale: 1.2 }}
                transition={{ delay: 0.1 }}
                style={{
                  background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 50%)',
                  filter: 'blur(5px)',
                }}
              />
            </motion.div>
          </a>
          <motion.a 
            href="https://maps.google.com/?q=Shop+21,+HomeCo+Menai+Marketplace,+152-194+Allison+Crescent,+Menai+NSW+2234" 
            className={`relative ${isDarkMode ? 'text-red-400' : 'text-red-600'} transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-transparent`}
            aria-label="Address"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onTouchStart={() => {
              if ('vibrate' in navigator && window.innerWidth < 768) {
                navigator.vibrate(5)
              }
            }}
            tabIndex={0}
          >
            <FaMapMarkerAlt size={28} />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 1, scale: 2 }}
              style={{
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 0.6, scale: 1.2 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 50%)',
                filter: 'blur(5px)',
              }}
            />
          </motion.a>
          <motion.button
            onClick={() => setIsAvatarOpen(true)}
            className={`relative ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer`}
            aria-label="Virtual Assistant"
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onTouchStart={() => {
              if ('vibrate' in navigator && window.innerWidth < 768) {
                navigator.vibrate(5)
              }
            }}
            tabIndex={0}
            title="Talk to our Virtual Assistant"
          >
            <BiSolidUserVoice size={32} />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 1, scale: 2 }}
              style={{
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 0.6, scale: 1.2 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 50%)',
                filter: 'blur(5px)',
              }}
            />
          </motion.button>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-orange-800'} ${isDarkMode ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'drop-shadow-sm'}`}>
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
    </div>
  )
}