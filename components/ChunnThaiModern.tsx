'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook } from 'react-icons/fa'
import { BiSolidUserVoice } from 'react-icons/bi'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const AvatarOverlay = dynamic(() => import('./AvatarOverlay'), {
  ssr: false
})

export default function ChunnThaiModern() {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [isDarkMode] = useState(true) // Always dark for premium feel
  // Sections content
  const sections = [
    {
      title: "Authentic Thai starts now",
      subtitle: "Traditional recipes, modern elegance, unforgettable flavors. Opening August 2025.",
      cta: "Reserve Your Table",
      bgClass: "bg-gradient-to-br from-orange-900 via-red-900 to-amber-900"
    },
    {
      title: "Where tradition meets innovation",
      subtitle: "Experience the perfect harmony of time-honored Thai cooking and contemporary presentation.",
      cta: "View Our Menu",
      bgClass: "bg-gradient-to-br from-amber-900 via-orange-800 to-red-900"
    },
    {
      title: "Your journey awaits",
      subtitle: "Shop 21, HomeCo Menai Marketplace. Join us for an extraordinary culinary adventure.",
      cta: "Get Directions",
      bgClass: "bg-gradient-to-br from-red-900 via-amber-900 to-orange-900"
    }
  ]

  // Auto-scroll through sections
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [sections.length])

  // Scroll handler for manual navigation
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 0) {
        setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1))
      } else {
        setCurrentSection((prev) => Math.max(prev - 1, 0))
      }
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [sections.length])

  const handleCTA = (index: number) => {
    switch(index) {
      case 0:
        window.location.href = 'tel:0432506436'
        break
      case 1:
        // Menu action
        break
      case 2:
        window.open('https://maps.google.com/?q=Shop+21+HomeCo+Menai+Marketplace+152-194+Allison+Crescent+Menai+NSW+2234', '_blank')
        break
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/chunn-thai-logo.svg"
              alt="Chunn Thai"
              width={120}
              height={40}
              className="brightness-0 invert"
            />
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#menu" className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-wider">Menu</a>
            <a href="#location" className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-wider">Location</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-wider">About</a>
            <button className="ml-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105">
              Book Now
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Full-screen sections */}
      <AnimatePresence mode="wait">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            className={`fixed inset-0 flex items-center justify-center ${section.bgClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSection === index ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ zIndex: currentSection === index ? 10 : 0 }}
          >
            {/* Radial burst effect */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: currentSection === index ? 3 : 0,
                  rotate: currentSection === index ? 360 : 0
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                <div className="w-[1000px] h-[1000px] relative">
                  {[...Array(72)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-0.5 origin-bottom"
                      style={{
                        height: `${300 + Math.random() * 200}px`,
                        transform: `rotate(${i * 5}deg)`,
                        background: `linear-gradient(to top, transparent, ${
                          i % 4 === 0 ? 'rgba(251, 191, 36, 0.4)' : 
                          i % 4 === 1 ? 'rgba(249, 115, 22, 0.3)' : 
                          i % 4 === 2 ? 'rgba(220, 38, 38, 0.3)' :
                          'rgba(255, 255, 255, 0.1)'
                        })`
                      }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ 
                        scaleY: currentSection === index ? 1 : 0,
                        opacity: currentSection === index ? 1 : 0
                      }}
                      transition={{ 
                        duration: 1.5, 
                        delay: i * 0.01,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Additional glow effect */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)',
                  filter: 'blur(60px)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: currentSection === index ? 2 : 0 }}
                transition={{ duration: 2 }}
              />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: currentSection === index ? 0 : 50, opacity: currentSection === index ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {section.title}
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: currentSection === index ? 0 : 50, opacity: currentSection === index ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {section.subtitle}
              </motion.p>

              <motion.button
                onClick={() => handleCTA(index)}
                className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-105"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: currentSection === index ? 0 : 50, opacity: currentSection === index ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {section.cta}
              </motion.button>
            </div>

            {/* Thai pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="thai-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="currentColor" />
                  <circle cx="10" cy="10" r="3" fill="currentColor" />
                </pattern>
                <rect width="100" height="100" fill="url(#thai-pattern)" />
              </svg>
            </div>
          </motion.section>
        ))}
      </AnimatePresence>

      {/* Section indicators */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 space-y-4">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-white scale-150' 
                : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Floating Avatar Button */}
      <motion.button
        onClick={() => setIsAvatarOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ rotate: 15 }}
      >
        <BiSolidUserVoice size={28} className="text-white" />
      </motion.button>

      {/* Quick contact bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-t border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-white/80">
            <a href="tel:0432506436" className="flex items-center gap-2 hover:text-white transition-colors">
              <FaPhone size={14} />
              <span>0432 506 436</span>
            </a>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt size={14} />
              <span>Opening August 2025 • Menai NSW</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/chunn_thai" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="https://facebook.com/chunnthai" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <FaFacebook size={20} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Avatar Overlay */}
      <AvatarOverlay
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}