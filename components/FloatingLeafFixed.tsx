import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingLeafProps {
  delay?: number;
  index?: number;
}

const FloatingLeafFixed: React.FC<FloatingLeafProps> = ({ delay = 0, index = 0 }) => {
  const leafRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  // Use ref to track mutable state without causing re-renders
  const stateRef = useRef({
    x: 0,
    y: -200,
    vx: 0,
    vy: 0,
    initialized: false
  });
  
  // Leaf properties determined once
  const leafProps = React.useMemo(() => {
    const leafTypes = ['thai-basil', 'cilantro', 'lemongrass', 'kaffir'];
    const leafType = leafTypes[Math.floor(Math.random() * leafTypes.length)];
    
    const leafColors = {
      'thai-basil': ['#22c55e', '#16a34a', '#059669'],
      'cilantro': ['#4ade80', '#22c55e', '#16a34a'],
      'lemongrass': ['#bef264', '#a3e635', '#84cc16'],
      'kaffir': ['#059669', '#047857', '#065f46']
    };
    
    return {
      type: leafType,
      colors: leafColors[leafType as keyof typeof leafColors],
      mass: 0.15 + Math.random() * 0.1,
      size: 0.8 + Math.random() * 0.4,
      swayPeriod: 3 + Math.random() * 2,
      swayAmplitude: 20 + Math.random() * 20,
      rotationSpeed: 20 + Math.random() * 10,
      // Distribute across screen width with some randomness based on index
      startXFactor: (index * 0.1 + Math.random() * 0.8) % 1
    };
  }, [index]);

  // Initialize and run animation
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let time = delay;
    let hasStarted = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const animate = () => {
      time += 0.016; // ~60fps
      
      if (!leafRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Initialize position after delay
      if (!hasStarted && time >= delay) {
        hasStarted = true;
        stateRef.current.initialized = true;
        // Distribute initial X positions across the screen
        stateRef.current.x = leafProps.startXFactor * window.innerWidth;
        stateRef.current.y = -100 - Math.random() * 100;
      }
      
      if (!hasStarted) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const state = stateRef.current;
      
      // Reset if leaf has fallen off screen
      if (state.y > window.innerHeight + 100) {
        // Randomize the reset position more effectively
        state.x = Math.random() * window.innerWidth;
        state.y = -100 - Math.random() * 200;
        state.vx = 0;
        state.vy = 0;
      }
      
      // Calculate forces
      const forceX = Math.sin(time / leafProps.swayPeriod) * leafProps.swayAmplitude * 0.01;
      const forceY = 0.1 * leafProps.mass;
      
      // Mouse repulsion
      const rect = leafRef.current.getBoundingClientRect();
      const leafX = rect.left + rect.width / 2;
      const leafY = rect.top + rect.height / 2;
      const dx = leafX - mouseX;
      const dy = leafY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const interactionRadius = window.innerWidth < 768 ? 80 : 120;
      const maxForce = window.innerWidth < 768 ? 1.5 : 2.5;
      
      let repulsionX = 0;
      let repulsionY = 0;
      
      if (distance < interactionRadius && distance > 0) {
        const repulsionForce = (interactionRadius - distance) / interactionRadius * maxForce;
        repulsionX = (dx / distance) * repulsionForce;
        repulsionY = (dy / distance) * repulsionForce * 0.3;
      }
      
      // Update velocity and position
      state.vx = (state.vx + forceX + repulsionX) * 0.95;
      state.vy = (state.vy + forceY + repulsionY) * 0.98;
      state.x += state.vx;
      state.y += state.vy;
      
      // Apply position to element
      leafRef.current.style.left = `${state.x}px`;
      leafRef.current.style.top = `${state.y}px`;
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [delay, leafProps, index]);

  // Render only the visual part
  return (
    <motion.div
      ref={leafRef}
      className="absolute pointer-events-none"
      style={{
        transform: `scale(${leafProps.size})`,
        left: 0,
        top: 0
      }}
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ 
        opacity: stateRef.current.initialized ? 0.7 : 0,
        rotate: 360
      }}
      transition={{
        opacity: { duration: 1 },
        rotate: { 
          duration: leafProps.rotationSpeed,
          repeat: Infinity,
          ease: "linear"
        }
      }}
    >
      {/* Simplified SVG rendering - you can copy the full SVG from the original */}
      <svg
        width="30"
        height="36"
        viewBox="0 0 30 36"
        fill="none"
        style={{
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
        }}
      >
        {/* Thai basil leaf as default */}
        <path
          d="M15 1 C10 2 6 5 4 10 C2 15 2 21 4 26 C6 31 10 34 15 36 C20 34 24 31 26 26 C28 21 28 15 26 10 C24 5 20 2 15 1"
          fill={leafProps.colors[0]}
        />
      </svg>
    </motion.div>
  );
};

export default FloatingLeafFixed;