"use client"

import React, { useEffect, useRef } from 'react'

interface WorkingLeafProps {
  index: number
}

const WorkingLeaf: React.FC<WorkingLeafProps> = ({ index }) => {
  const leafRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!leafRef.current) return
    
    let y = -50
    let x = 100 + index * 200
    const speed = 2 + Math.random() * 2
    
    const animate = () => {
      y += speed
      
      if (y > window.innerHeight + 50) {
        y = -50
      }
      
      if (leafRef.current) {
        leafRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
      
      requestAnimationFrame(animate)
    }
    
    animate()
  }, [index])
  
  return (
    <div 
      ref={leafRef}
      className="absolute"
      style={{
        left: 0,
        top: 0,
        width: '30px',
        height: '36px',
      }}
    >
      <svg
        width="30"
        height="36"
        viewBox="0 0 30 36"
        fill="none"
      >
        <path
          d="M15 1 C10 2 6 5 4 10 C2 15 2 21 4 26 C6 31 10 34 15 36 C20 34 24 31 26 26 C28 21 28 15 26 10 C24 5 20 2 15 1"
          fill="#22c55e"
        />
      </svg>
    </div>
  )
}

export default WorkingLeaf