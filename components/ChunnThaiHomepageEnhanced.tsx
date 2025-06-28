'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import ZenHerbs from './ZenHerbs'
import MinimalCountdown from './MinimalCountdown'

interface ChunnLogoProps {
  isDarkMode: boolean;
}

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
        repeatType: "reverse" as const,
        ease: "easeInOut"
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
          <motion.img
            src="/chunn-lotus-logo-new.png"
            alt="Chunn Thai Logo"
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setImageLoaded(true)}
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
        <h1 className={`text-lg md:text-xl font-bold tracking-wider ${isDarkMode ? 'text-amber-400' : 'text-orange-800'}`}>
          CHUNN THAI
        </h1>
        <p className={`text-sm md:text-base ${isDarkMode ? 'text-amber-300' : 'text-orange-700'}`}>
          CUISINE
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function ChunnThaiHomepageEnhanced() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-orange-50'} transition-all duration-700 relative overflow-hidden`}>
      {/* Enhanced 9-Layer Thai-inspired pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1: Base gradient mesh - Multiple overlapping gradients */}
        <div 
          className="absolute inset-0"
          style={{
            background: isDarkMode
              ? `radial-gradient(ellipse at 25% 25%, rgba(251, 191, 36, 0.05), transparent 50%),
                 radial-gradient(ellipse at 75% 75%, rgba(251, 191, 36, 0.05), transparent 50%),
                 radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.03), transparent 70%),
                 radial-gradient(ellipse at 50% 100%, rgba(251, 191, 36, 0.03), transparent 70%)`
              : `radial-gradient(ellipse at 25% 25%, rgba(212, 175, 55, 0.08), transparent 50%),
                 radial-gradient(ellipse at 75% 75%, rgba(212, 175, 55, 0.08), transparent 50%),
                 radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.05), transparent 70%),
                 radial-gradient(ellipse at 50% 100%, rgba(212, 175, 55, 0.05), transparent 70%)`
          }}
        />
        
        {/* Layer 2: Thai Temple Roof Pattern - Chofa inspired */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.04 : 0.06 }}>
          <defs>
            <pattern id="thai-temple-roof" x="0" y="0" width="300" height="150" patternUnits="userSpaceOnUse">
              {/* Temple roof silhouette */}
              <path d="M150,0 Q100,20 50,50 Q25,65 0,75 L0,80 Q30,70 60,55 Q110,30 150,15 Q190,30 240,55 Q270,70 300,80 L300,75 Q275,65 250,50 Q200,20 150,0" 
                    fill="none" 
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    strokeWidth="0.3"
                    opacity="0.6"/>
              {/* Decorative elements */}
              <circle cx="150" cy="15" r="3" fill={isDarkMode ? '#fbbf24' : '#d4af37'} opacity="0.3"/>
              <path d="M150,15 L145,25 L155,25 Z" fill={isDarkMode ? '#fbbf24' : '#d4af37'} opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#thai-temple-roof)" />
        </svg>
        
        {/* Layer 3: Thai Elephant Pattern */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.03 : 0.05 }}>
          <defs>
            <pattern id="thai-elephant" x="0" y="0" width="500" height="500" patternUnits="userSpaceOnUse">
              {/* Simplified geometric elephant */}
              <g transform="translate(250, 250)">
                {/* Body */}
                <ellipse cx="0" cy="0" rx="40" ry="30" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.2" opacity="0.5"/>
                {/* Head */}
                <circle cx="-35" cy="-10" r="20" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.2" opacity="0.5"/>
                {/* Trunk */}
                <path d="M-50,-10 Q-55,0 -50,10 Q-45,15 -40,10" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.15" opacity="0.4"/>
                {/* Legs */}
                <line x1="-20" y1="25" x2="-20" y2="45" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.15" opacity="0.4"/>
                <line x1="0" y1="25" x2="0" y2="45" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.15" opacity="0.4"/>
                <line x1="20" y1="25" x2="20" y2="45" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.15" opacity="0.4"/>
              </g>
              {/* Corner elephants */}
              {[[100, 100], [400, 100], [100, 400], [400, 400]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x}, ${y}) scale(0.3) rotate(${i * 90})`}>
                  <ellipse cx="0" cy="0" rx="40" ry="30" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.3" opacity="0.3"/>
                  <circle cx="-35" cy="-10" r="20" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.3" opacity="0.3"/>
                </g>
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#thai-elephant)" />
        </svg>
        
        {/* Layer 4: Thai Wave Pattern - Lai Nam */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.05 : 0.07 }}>
          <defs>
            <pattern id="thai-waves" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
              {/* Traditional Thai wave pattern */}
              <path d="M0,50 Q25,25 50,50 T100,50 T150,50 T200,50" 
                    fill="none" 
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    strokeWidth="0.25"
                    opacity="0.6"/>
              <path d="M0,70 Q25,45 50,70 T100,70 T150,70 T200,70" 
                    fill="none" 
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    strokeWidth="0.2"
                    opacity="0.4"/>
              <path d="M0,30 Q25,5 50,30 T100,30 T150,30 T200,30" 
                    fill="none" 
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    strokeWidth="0.2"
                    opacity="0.4"/>
              {/* Wave crests */}
              {[50, 100, 150].map((x, i) => (
                <circle key={i} cx={x} cy="50" r="1.5" fill={isDarkMode ? '#fbbf24' : '#d4af37'} opacity="0.3"/>
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#thai-waves)" />
        </svg>
        
        {/* Layer 5: Modern Lai Kranok Grid - Enhanced with more detail */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.08 : 0.12 }}>
          <defs>
            <pattern id="modern-kranok-enhanced" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Enhanced Kranok flame with multiple layers */}
              <g transform="translate(100, 100)">
                {/* Outer flame layer */}
                <path d="M0,-45 Q-18,-35 -25,-20 Q-20,-5 -15,5 Q-10,15 0,20 Q10,15 15,5 Q20,-5 25,-20 Q18,-35 0,-45" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.4"
                      opacity="0.8"/>
                
                {/* Main flame shape */}
                <path d="M0,-40 Q-15,-30 -20,-15 Q-15,0 0,10 Q15,0 20,-15 Q15,-30 0,-40" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.5"/>
                
                {/* Inner flame detail */}
                <path d="M0,-25 Q-8,-18 -10,-8 Q-8,2 0,8 Q8,2 10,-8 Q8,-18 0,-25" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.3"
                      opacity="0.7"/>
                
                {/* Central core */}
                <path d="M0,-15 Q-4,-10 -5,-4 Q-4,1 0,4 Q4,1 5,-4 Q4,-10 0,-15" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.2"
                      opacity="0.5"/>
                
                {/* Base flourishes */}
                <path d="M-15,10 Q-18,15 -15,20 Q-12,18 -10,15 M15,10 Q18,15 15,20 Q12,18 10,15" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.2"
                      opacity="0.4"/>
                
                {/* Side spirals */}
                <path d="M-25,-10 Q-28,-8 -27,-5 Q-24,-3 -22,-5 Q-20,-8 -22,-10" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.15"
                      opacity="0.3"/>
                <path d="M25,-10 Q28,-8 27,-5 Q24,-3 22,-5 Q20,-8 22,-10" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.15"
                      opacity="0.3"/>
              </g>
              
              {/* Enhanced corner accent flames */}
              {[[50, 50], [150, 50], [50, 150], [150, 150]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x}, ${y}) scale(0.6) rotate(${i * 45})`}>
                  <path d="M0,-40 Q-15,-30 -20,-15 Q-15,0 0,10 Q15,0 20,-15 Q15,-30 0,-40" 
                        fill="none" 
                        stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                        strokeWidth="0.3"
                        opacity="0.4"/>
                  <path d="M0,-25 Q-8,-18 -10,-8 Q-8,2 0,8 Q8,2 10,-8 Q8,-18 0,-25" 
                        fill="none" 
                        stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                        strokeWidth="0.2"
                        opacity="0.3"/>
                </g>
              ))}
              
              {/* Enhanced grid with diagonal lines */}
              <line x1="0" y1="100" x2="200" y2="100" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.1" opacity="0.3"/>
              <line x1="100" y1="0" x2="100" y2="200" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.1" opacity="0.3"/>
              <line x1="0" y1="0" x2="200" y2="200" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.08" opacity="0.2"/>
              <line x1="200" y1="0" x2="0" y2="200" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.08" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#modern-kranok-enhanced)" />
        </svg>
        
        {/* Layer 6: Thai Script Pattern */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.02 : 0.04 }}>
          <defs>
            <pattern id="thai-script" x="0" y="0" width="400" height="100" patternUnits="userSpaceOnUse">
              {/* Stylized Thai script characters */}
              <text x="50" y="50" 
                    fontFamily="serif" 
                    fontSize="24" 
                    fill={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    opacity="0.4"
                    transform="rotate(-5 50 50)">
                ชุนไทย
              </text>
              <text x="200" y="70" 
                    fontFamily="serif" 
                    fontSize="18" 
                    fill={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    opacity="0.3"
                    transform="rotate(3 200 70)">
                อาหารไทย
              </text>
              <text x="320" y="40" 
                    fontFamily="serif" 
                    fontSize="20" 
                    fill={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    opacity="0.35"
                    transform="rotate(-2 320 40)">
                แท้
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#thai-script)" />
        </svg>
        
        {/* Layer 7: Lotus Geometry - Enhanced with multiple sizes */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.06 : 0.08 }}>
          <defs>
            <pattern id="lotus-geometry-enhanced" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
              {/* Central large lotus */}
              <g transform="translate(200, 200)">
                {/* Outer petals ring */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, i) => (
                  <path
                    key={`outer-${i}`}
                    d={`M0,0 L${40 * Math.cos(rotation * Math.PI / 180)},${40 * Math.sin(rotation * Math.PI / 180)} 
                        Q${45 * Math.cos((rotation + 22.5) * Math.PI / 180)},${45 * Math.sin((rotation + 22.5) * Math.PI / 180)} 
                        ${40 * Math.cos((rotation + 45) * Math.PI / 180)},${40 * Math.sin((rotation + 45) * Math.PI / 180)} Z`}
                    fill="none"
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'}
                    strokeWidth="0.25"
                    opacity="0.7"
                  />
                ))}
                
                {/* Middle petals ring */}
                {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((rotation, i) => (
                  <path
                    key={`middle-${i}`}
                    d={`M0,0 L${25 * Math.cos(rotation * Math.PI / 180)},${25 * Math.sin(rotation * Math.PI / 180)} 
                        Q${30 * Math.cos((rotation + 22.5) * Math.PI / 180)},${30 * Math.sin((rotation + 22.5) * Math.PI / 180)} 
                        ${25 * Math.cos((rotation + 45) * Math.PI / 180)},${25 * Math.sin((rotation + 45) * Math.PI / 180)} Z`}
                    fill="none"
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'}
                    strokeWidth="0.2"
                    opacity="0.5"
                  />
                ))}
                
                {/* Inner petals */}
                {[0, 72, 144, 216, 288].map((rotation, i) => (
                  <path
                    key={`inner-${i}`}
                    d={`M0,0 L${15 * Math.cos(rotation * Math.PI / 180)},${15 * Math.sin(rotation * Math.PI / 180)} 
                        Q${18 * Math.cos((rotation + 36) * Math.PI / 180)},${18 * Math.sin((rotation + 36) * Math.PI / 180)} 
                        ${15 * Math.cos((rotation + 72) * Math.PI / 180)},${15 * Math.sin((rotation + 72) * Math.PI / 180)} Z`}
                    fill="none"
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'}
                    strokeWidth="0.15"
                    opacity="0.4"
                  />
                ))}
                
                {/* Center circles */}
                <circle r="20" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.15" opacity="0.4"/>
                <circle r="10" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.1" opacity="0.3"/>
                <circle r="3" fill={isDarkMode ? '#fbbf24' : '#d4af37'} opacity="0.4"/>
              </g>
              
              {/* Corner lotus buds - different sizes */}
              {[[100, 100, 0.5], [300, 100, 0.4], [100, 300, 0.4], [300, 300, 0.5]].map(([x, y, scale], i) => (
                <g key={i} transform={`translate(${x}, ${y}) scale(${scale}) rotate(${i * 45})`}>
                  <path d="M0,-30 Q-15,-15 -15,0 Q-10,10 0,15 Q10,10 15,0 Q15,-15 0,-30" 
                        fill="none" 
                        stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                        strokeWidth="0.4"
                        opacity="0.5"/>
                  <path d="M0,-20 Q-10,-10 -10,0 Q-5,5 0,8 Q5,5 10,0 Q10,-10 0,-20" 
                        fill="none" 
                        stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                        strokeWidth="0.3"
                        opacity="0.3"/>
                </g>
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lotus-geometry-enhanced)" />
        </svg>
        
        {/* Layer 8: Thai Mandala Pattern */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.03 : 0.05 }}>
          <defs>
            <pattern id="thai-mandala" x="0" y="0" width="600" height="600" patternUnits="userSpaceOnUse">
              <g transform="translate(300, 300)">
                {/* Outer ring */}
                <circle r="250" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} strokeWidth="0.1" opacity="0.3"/>
                
                {/* Radial lines */}
                {Array.from({length: 16}, (_, i) => i * 22.5).map((angle, i) => (
                  <line key={i}
                        x1={150 * Math.cos(angle * Math.PI / 180)}
                        y1={150 * Math.sin(angle * Math.PI / 180)}
                        x2={250 * Math.cos(angle * Math.PI / 180)}
                        y2={250 * Math.sin(angle * Math.PI / 180)}
                        stroke={isDarkMode ? '#fbbf24' : '#d4af37'}
                        strokeWidth="0.08"
                        opacity="0.2"/>
                ))}
                
                {/* Concentric circles */}
                {[50, 100, 150, 200].map((r, i) => (
                  <circle key={i} r={r} fill="none" stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                          strokeWidth="0.1" opacity={0.2 - i * 0.03}/>
                ))}
                
                {/* Diamond patterns */}
                {Array.from({length: 8}, (_, i) => i * 45).map((angle, i) => (
                  <g key={i} transform={`rotate(${angle})`}>
                    <path d="M0,-100 L20,-80 L0,-60 L-20,-80 Z" 
                          fill="none" 
                          stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                          strokeWidth="0.15"
                          opacity="0.3"/>
                  </g>
                ))}
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#thai-mandala)" />
        </svg>
        
        {/* Layer 9: Temple Spire Network - Complex architectural elements */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDarkMode ? 0.04 : 0.06 }}>
          <defs>
            <pattern id="temple-spire-network" x="0" y="0" width="800" height="800" patternUnits="userSpaceOnUse">
              {/* Main central spire complex */}
              <g transform="translate(400, 400)">
                {/* Central tall spire */}
                <path d="M0,-150 L-3,-120 L-5,-90 L-7,-60 L-9,-30 L-11,0 L11,0 L9,-30 L7,-60 L5,-90 L3,-120 L0,-150" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.3"
                      opacity="0.6"/>
                
                {/* Spire details */}
                <circle cx="0" cy="-150" r="4" fill={isDarkMode ? '#fbbf24' : '#d4af37'} opacity="0.4"/>
                
                {/* Horizontal tiers */}
                {[-30, -60, -90, -120].map((y, i) => (
                  <line key={i} x1={-10 + i * 2} y1={y} x2={10 - i * 2} y2={y} 
                        stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                        strokeWidth="0.2" opacity="0.4"/>
                ))}
                
                {/* Side spires */}
                {[-50, 50].map((x, i) => (
                  <g key={i} transform={`translate(${x}, 20)`}>
                    <path d="M0,-100 L-2,-80 L-3,-60 L-4,-40 L-5,-20 L-6,0 L6,0 L5,-20 L4,-40 L3,-60 L2,-80 L0,-100" 
                          fill="none" 
                          stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                          strokeWidth="0.25"
                          opacity="0.5"/>
                  </g>
                ))}
                
                {/* Base platform */}
                <rect x="-80" y="0" width="160" height="5" fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.25" opacity="0.5"/>
                
                {/* Decorative base elements */}
                <path d="M-80,5 L-85,10 L-80,15 M80,5 L85,10 L80,15" 
                      fill="none" 
                      stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                      strokeWidth="0.15" opacity="0.3"/>
              </g>
              
              {/* Smaller spire clusters in corners */}
              {[[200, 200], [600, 200], [200, 600], [600, 600]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x}, ${y}) scale(0.6) rotate(${i * 15})`}>
                  <path d="M0,-100 L-2,-80 L-4,-60 L-6,-40 L-8,-20 L-10,0 L10,0 L8,-20 L6,-40 L4,-60 L2,-80 L0,-100" 
                        fill="none" 
                        stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                        strokeWidth="0.3"
                        opacity="0.4"/>
                  {/* Side mini spires */}
                  {[-20, 20].map((offset, j) => (
                    <path key={j} 
                          d={`M${offset},-60 L${offset - 1},-45 L${offset - 2},-30 L${offset - 3},-15 L${offset - 4},0 L${offset + 4},0 L${offset + 3},-15 L${offset + 2},-30 L${offset + 1},-45 L${offset},-60`}
                          fill="none" 
                          stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                          strokeWidth="0.2"
                          opacity="0.3"/>
                  ))}
                </g>
              ))}
              
              {/* Connecting pathways between spires */}
              <path d="M200,200 Q400,150 600,200 M200,600 Q400,650 600,600" 
                    fill="none" 
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    strokeWidth="0.1" opacity="0.2"/>
              <path d="M200,200 Q150,400 200,600 M600,200 Q650,400 600,600" 
                    fill="none" 
                    stroke={isDarkMode ? '#fbbf24' : '#d4af37'} 
                    strokeWidth="0.1" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#temple-spire-network)" />
        </svg>
      </div>
      
      {/* Zen Herb Animation - Below all content */}
      <React.Suspense fallback={null}>
        <ZenHerbs />
      </React.Suspense>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-72 h-72 md:w-96 md:h-96 mb-12 cursor-pointer"
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChunnLogo isDarkMode={isDarkMode} />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <MinimalCountdown isDark={isDarkMode} />
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex gap-6 mb-8"
        >
          <a 
            href="https://www.facebook.com/profile.php?id=61576853373611" 
            className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={28} />
          </a>
          <a 
            href="https://www.instagram.com/chunn_thai/" 
            className={`${isDarkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'} transition-colors`}
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={28} />
          </a>
          <a 
            href="tel:+61432506436" 
            className={`${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors`}
            aria-label="Phone"
          >
            <FaPhone size={26} />
          </a>
          <a 
            href="mailto:cuisine@chunnthai.com.au" 
            className={`${isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-orange-600 hover:text-orange-700'} transition-colors`}
            aria-label="Email"
          >
            <FaEnvelope size={28} />
          </a>
          <a 
            href="https://maps.google.com/?q=Shop+T01/152-194+Allison+Crescent,+Menai+NSW+2234" 
            className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors`}
            aria-label="Address"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaMapMarkerAlt size={28} />
          </a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-orange-600/70'}`}>
            © 2025 Chunn Thai Restaurant. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}