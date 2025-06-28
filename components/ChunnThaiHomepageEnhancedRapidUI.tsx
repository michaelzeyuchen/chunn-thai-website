'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUtensils, FaStar } from 'react-icons/fa'
import { BiSolidUserVoice, BiChevronDown } from 'react-icons/bi'
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

// Tooltip component inspired by Headless UI patterns
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
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
            isDarkMode ? 'bg-zinc-800 text-amber-400' : 'bg-white text-orange-800'
          } shadow-lg z-50`}
        >
          {content}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 ${
            isDarkMode ? 'border-zinc-800' : 'border-white'
          } border-l-transparent border-r-transparent`} />
        </motion.div>
      )}
    </div>
  )
}

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
      {/* Enhanced logo with better effects */}
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
          {/* Enhanced loading skeleton with shimmer effect */}
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
              filter: `drop-shadow(0 10px 30px ${isDarkMode ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 146, 60, 0.2)'})`
            }}
          />
        </div>
      </motion.div>
      
      {/* Enhanced text with gradient */}
      <motion.div
        className="absolute bottom-[10%] left-0 right-0 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1 className={`text-2xl md:text-3xl font-black tracking-wider ${
          isDarkMode 
            ? 'bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-orange-700 to-orange-900 bg-clip-text text-transparent'
        } drop-shadow-lg`}>
          CHUNN THAI
        </h1>
        <p className={`text-lg md:text-xl font-medium ${isDarkMode ? 'text-amber-300' : 'text-orange-800'} tracking-[0.3em]`}>
          CUISINE
        </p>
      </motion.div>
    </motion.div>
  )
}

// Enhanced contact button component
const ContactButton = ({ href, icon: Icon, color, label, isDarkMode, delay, isEmail = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
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
    >
      <Tooltip content={label} isDarkMode={isDarkMode}>
        <Component
          href={onClick ? undefined : href}
          onClick={handleClick}
          className={`relative block p-3 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? `bg-zinc-800/50 hover:bg-zinc-700/50 text-${color}-400` 
              : `bg-white/70 hover:bg-white text-${color}-600`
          } shadow-lg hover:shadow-xl backdrop-blur-sm`}
          aria-label={label}
          target={href?.startsWith('http') ? "_blank" : undefined}
          rel={href?.startsWith('http') ? "noopener noreferrer" : undefined}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <Icon size={24} />
          </motion.div>
          
          {/* Ripple effect on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: `radial-gradient(circle, ${isDarkMode ? `var(--${color}-400)` : `var(--${color}-600)`} 0%, transparent 70%)`
              }}
            />
          )}
        </Component>
      </Tooltip>
    </motion.div>
  )
}

export default function ChunnThaiHomepageEnhancedRapidUI() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const touchStartY = useRef<number | null>(null)
  const { scrollY } = useScroll()
  
  // Subtle parallax for background
  const backgroundY = useTransform(scrollY, [0, 300], [0, 50])

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
      {/* Pull to refresh indicator - Enhanced design */}
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

      {/* Background with subtle parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <ThaiBackground isDarkMode={isDarkMode} />
      </motion.div>
      
      {/* Enhanced floating light particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, transparent 70%)',
              boxShadow: isDarkMode
                ? '0 0 20px rgba(251, 191, 36, 0.8)'
                : '0 0 15px rgba(251, 146, 60, 0.6)'
            }}
            animate={{
              y: ['100vh', '-10vh'],
              x: [0, Math.random() * 40 - 20, 0],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
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
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-24">
        {/* Logo section with glow effect */}
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
          {/* Animated glow behind logo */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            animate={{
              background: isDarkMode
                ? ['radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 60%)',
                   'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 60%)',
                   'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 60%)']
                : ['radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 60%)',
                   'radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, transparent 60%)',
                   'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 60%)']
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <ChunnLogo isDarkMode={isDarkMode} />
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

        {/* Quick Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`flex flex-wrap justify-center gap-4 mb-8 text-sm ${
            isDarkMode ? 'text-amber-400/80' : 'text-orange-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-xs" />
            <span>Shop 21, HomeCo Menai</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-xs" />
            <span>Opening August 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUtensils className="text-xs" />
            <span>Authentic Thai Cuisine</span>
          </div>
        </motion.div>

        {/* Enhanced Contact Information Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12"
        >
          <ContactButton
            href="https://www.facebook.com/profile.php?id=61576853373611"
            icon={FaFacebook}
            color="blue"
            label="Follow us on Facebook"
            isDarkMode={isDarkMode}
            delay={0.7}
          />
          <ContactButton
            href="https://www.instagram.com/chunn_thai/"
            icon={FaInstagram}
            color="pink"
            label="Follow us on Instagram"
            isDarkMode={isDarkMode}
            delay={0.8}
          />
          <ContactButton
            href="tel:+61432506436"
            icon={FaPhone}
            color="green"
            label="Call us: 0432 506 436"
            isDarkMode={isDarkMode}
            delay={0.9}
          />
          <ContactButton
            href="mailto:cuisine@chunnthai.com.au"
            icon={FaEnvelope}
            color="purple"
            label="Email us"
            isDarkMode={isDarkMode}
            delay={1.0}
            isEmail={true}
          />
          <ContactButton
            href="https://maps.google.com/?q=Shop+21,+HomeCo+Menai+Marketplace,+152-194+Allison+Crescent,+Menai+NSW+2234"
            icon={FaMapMarkerAlt}
            color="red"
            label="Get directions"
            isDarkMode={isDarkMode}
            delay={1.1}
          />
          <ContactButton
            onClick={() => setIsAvatarOpen(true)}
            icon={BiSolidUserVoice}
            color="orange"
            label="Talk to our assistant"
            isDarkMode={isDarkMode}
            delay={1.2}
          />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12"
        >
          {[
            { icon: '🌶️', title: 'Authentic Flavors', description: 'Traditional recipes from Thailand' },
            { icon: '🌿', title: 'Fresh Ingredients', description: 'Locally sourced & imported spices' },
            { icon: '⭐', title: 'Premium Experience', description: 'Modern dining with Thai hospitality' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`p-6 rounded-2xl backdrop-blur-md ${
                isDarkMode 
                  ? 'bg-zinc-800/30 border border-amber-400/20' 
                  : 'bg-white/50 border border-orange-200'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
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
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Scroll Indicator */}
        {showScrollIndicator && (
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <BiChevronDown className={`text-3xl ${isDarkMode ? 'text-amber-400/50' : 'text-orange-600/50'}`} />
          </motion.div>
        )}

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

      {/* Additional content section that appears on scroll */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-orange-700 to-orange-900 bg-clip-text text-transparent'
            }`}>
              A Culinary Journey Awaits
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
              Experience the perfect blend of traditional Thai recipes and contemporary presentation
            </p>
          </motion.div>

          {/* Menu Preview Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: 'Appetizers',
                items: ['Spring Rolls', 'Satay Skewers', 'Tom Yum Soup'],
                icon: '🥟'
              },
              {
                category: 'Main Courses',
                items: ['Pad Thai', 'Green Curry', 'Massaman Beef'],
                icon: '🍜'
              },
              {
                category: 'Desserts',
                items: ['Mango Sticky Rice', 'Thai Tea Ice Cream', 'Coconut Pudding'],
                icon: '🍮'
              }
            ].map((menu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`p-8 rounded-3xl backdrop-blur-md ${
                  isDarkMode 
                    ? 'bg-zinc-800/40 border border-amber-400/30' 
                    : 'bg-white/60 border border-orange-300'
                } shadow-xl hover:shadow-2xl transition-all duration-300 group`}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {menu.icon}
                </div>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-amber-400' : 'text-orange-800'
                }`}>
                  {menu.category}
                </h3>
                <ul className="space-y-2">
                  {menu.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + itemIndex * 0.1 }}
                      className={`flex items-center ${
                        isDarkMode ? 'text-zinc-300' : 'text-gray-600'
                      }`}
                    >
                      <FaStar className="text-xs mr-2 text-orange-400" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
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

      {/* Custom CSS for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}