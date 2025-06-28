import React, { useRef, useEffect, memo } from 'react';

interface FloatingLeafProps {
  delay?: number;
  index?: number;
  obstacles?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    type?: 'rect' | 'circle';
    radius?: number;
  }>;
}

const FloatingLeaf: React.FC<FloatingLeafProps> = memo(({ delay = 0, index = 0, obstacles = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const positionRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  
  
  // Leaf configuration
  const config = React.useMemo(() => {
    const types = ['thai-basil', 'cilantro', 'lemongrass', 'kaffir'];
    const typeIndex = Math.floor(Math.random() * types.length);
    const leafType = types[typeIndex];
    
    const colors = {
      'thai-basil': ['#22c55e', '#16a34a', '#059669'],
      'cilantro': ['#4ade80', '#22c55e', '#16a34a'],
      'lemongrass': ['#bef264', '#a3e635', '#84cc16'],
      'kaffir': ['#059669', '#047857', '#065f46']
    };
    
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    // More columns for better distribution
    const numColumns = screenWidth < 768 ? 6 : 10;
    const columnWidth = screenWidth / numColumns;
    const column = index % numColumns;
    const baseX = column * columnWidth + columnWidth / 2;
    // Smaller offset for more predictable positioning
    const offsetX = (Math.random() - 0.5) * columnWidth * 0.5;
    
    // Calculate logo area to avoid
    const logoSize = screenWidth >= 1024 ? 320 : screenWidth >= 768 ? 288 : screenWidth >= 640 ? 256 : 224;
    const logoRadius = logoSize / 2;
    const logoCenterX = screenWidth / 2;
    const logoCenterY = 24 + logoRadius; // 24px padding + radius
    
    // Check if starting position is within logo area
    const finalX = baseX + offsetX;
    const distanceFromLogoCenter = Math.sqrt(Math.pow(finalX - logoCenterX, 2) + Math.pow(logoCenterY - logoCenterY, 2));
    
    // If starting in logo area, move to edges
    let adjustedX = finalX;
    if (Math.abs(finalX - logoCenterX) < logoRadius + 50) {
      // Add 50px buffer around logo
      if (finalX < logoCenterX) {
        adjustedX = logoCenterX - logoRadius - 60;
      } else {
        adjustedX = logoCenterX + logoRadius + 60;
      }
    }
    
    return {
      type: leafType,
      colors: colors[leafType as keyof typeof colors],
      size: 0.6 + Math.random() * 0.4,
      mass: 0.7 + Math.random() * 0.2, // Heavier mass for faster fall
      fallSpeed: 15 + Math.random() * 5, // Faster fall speed
      swayAmount: 25 + Math.random() * 15, // Gentle zen-like sway
      swaySpeed: 3.5 + Math.random() * 1, // Slow, mesmerizing sway
      rotationSpeed: 40 + Math.random() * 20, // Very slow rotation
      startX: adjustedX,
      startY: -50 - Math.random() * 100
    };
  }, [index]);
  
  // Physics-based animation with mouse interaction
  useEffect(() => {
    if (!containerRef.current) return;
    
    let startTime = Date.now();
    let hasStarted = false;
    const delayMs = delay * 1000;
    
    // Initialize position
    positionRef.current = {
      x: config.startX,
      y: config.startY,
      vx: 0,
      vy: 0
    };
    
    
    // Track mouse/touch position with passive listeners for better performance
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    
    // Use passive event listeners for better scroll performance
    const eventOptions = { passive: true };
    window.addEventListener('mousemove', handleMouseMove, eventOptions);
    window.addEventListener('touchmove', handleTouchMove, eventOptions);
    window.addEventListener('touchstart', handleTouchStart, eventOptions);
    
    let lastTime = Date.now();
    const animate = (timestamp?: number) => {
      const currentTime = timestamp || Date.now();
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.033); // Cap at 30fps min
      lastTime = currentTime;
      const elapsed = currentTime - startTime;
      
      
      if (!containerRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Wait for delay
      if (!hasStarted && elapsed >= delayMs) {
        hasStarted = true;
      }
      
      if (!hasStarted) {
        containerRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) scale(${config.size})`;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const pos = positionRef.current;
      const mouse = mouseRef.current;
      
      // Calculate opacity based on position
      let opacity = 0;
      if (pos.y < -150) {
        // Completely off screen - invisible
        opacity = 0;
      } else if (pos.y < -50) {
        // Starting to enter - fade in quickly
        opacity = (pos.y + 150) / 100 * 0.7;
      } else if (pos.y < 100) {
        // Fully fading in
        opacity = (pos.y + 50) / 150 * 0.7;
      } else if (pos.y < window.innerHeight - 100) {
        // Full opacity
        opacity = 0.7;
      } else {
        // Fade out
        opacity = Math.max(0, (window.innerHeight + 100 - pos.y) / 200 * 0.7);
      }
      
      containerRef.current.style.opacity = opacity.toString();
      
      
      // Reset if leaf has fallen off screen - continuous rain
      if (pos.y > window.innerHeight + 100) {
        // Maintain column distribution
        const screenWidth = window.innerWidth;
        const numColumns = screenWidth < 768 ? 6 : 10;
        const columnWidth = screenWidth / numColumns;
        const column = index % numColumns;
        const baseX = column * columnWidth + columnWidth / 2;
        const offsetX = (Math.random() - 0.5) * columnWidth * 0.5;
        
        // Calculate logo area to avoid
        const logoSize = screenWidth >= 1024 ? 320 : screenWidth >= 768 ? 288 : screenWidth >= 640 ? 256 : 224;
        const logoRadius = logoSize / 2;
        const logoCenterX = screenWidth / 2;
        
        // Check if reset position is within logo area
        const finalX = baseX + offsetX;
        let adjustedX = finalX;
        if (Math.abs(finalX - logoCenterX) < logoRadius + 50) {
          // Add 50px buffer around logo
          if (finalX < logoCenterX) {
            adjustedX = logoCenterX - logoRadius - 60;
          } else {
            adjustedX = logoCenterX + logoRadius + 60;
          }
        }
        
        pos.x = adjustedX;
        pos.y = -50 - Math.random() * 100;
        pos.vx = 0;
        pos.vy = 0;
      }
      
      // Calculate forces
      const time = elapsed / 1000;
      
      // Natural sway with zen-like sine waves
      const primarySway = Math.sin(time / config.swaySpeed) * config.swayAmount * 0.006;
      const secondarySway = Math.sin(time / (config.swaySpeed * 1.3)) * config.swayAmount * 0.003;
      const tertiarySway = Math.sin(time / (config.swaySpeed * 0.5)) * config.swayAmount * 0.002;
      const swayForce = primarySway + secondarySway + tertiarySway;
      
      // Gravity affected by mass - increased for faster fall
      const gravity = 0.09 * config.mass;
      
      // Air resistance - minimal Y resistance for faster fall
      const airResistanceX = -pos.vx * 0.10;
      const airResistanceY = -pos.vy * 0.04;
      
      // Mouse repulsion - more responsive
      const leafCenterX = pos.x;
      const leafCenterY = pos.y;
      const dx = leafCenterX - mouse.x;
      const dy = leafCenterY - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const interactionRadius = window.innerWidth < 768 ? 100 : 150; // Increased radius
      const maxForce = window.innerWidth < 768 ? 2.5 : 4; // Increased force
      
      let repulsionX = 0;
      let repulsionY = 0;
      
      if (distance < interactionRadius && distance > 0) {
        const normalizedDistance = distance / interactionRadius;
        // More responsive exponential falloff
        const repulsionForce = Math.pow(1 - normalizedDistance, 2) * maxForce; // Changed from 3 to 2 for faster response
        repulsionX = (dx / distance) * repulsionForce;
        repulsionY = (dy / distance) * repulsionForce * 0.5; // Increased vertical response
      }
      
      // Update velocity with all forces (multiply by deltaTime for frame-independent physics)
      pos.vx += (swayForce + repulsionX + airResistanceX) * deltaTime * 60;
      pos.vy += (gravity + repulsionY + airResistanceY) * deltaTime * 60;
      
      // Apply damping - less Y damping for faster fall
      pos.vx *= 0.95;
      pos.vy *= 0.985;
      
      // Limit max velocity to prevent too fast movement
      const maxVx = 5;
      const maxVy = 8;
      pos.vx = Math.max(-maxVx, Math.min(maxVx, pos.vx));
      pos.vy = Math.max(-maxVy, Math.min(maxVy, pos.vy));
      
      
      // Check for collisions with obstacles BEFORE moving
      // Calculate actual leaf size based on type and config
      let leafWidth, leafHeight;
      if (config.type === 'lemongrass') {
        leafWidth = 24 * config.size;
        leafHeight = 65 * config.size;
      } else if (config.type === 'kaffir') {
        leafWidth = 32 * config.size;
        leafHeight = 46 * config.size;
      } else if (config.type === 'cilantro') {
        leafWidth = 28 * config.size;
        leafHeight = 32 * config.size;
      } else { // thai-basil
        leafWidth = 30 * config.size;
        leafHeight = 36 * config.size;
      }
      
      // Calculate NEXT position for predictive collision detection using deltaTime
      let nextX = pos.x + pos.vx * deltaTime * 60; // Scale by 60 for 60fps baseline
      let nextY = pos.y + pos.vy * deltaTime * 60; // Scale by 60 for 60fps baseline
      
      // Check collisions at the NEXT position
      let collisionDetected = false;
        obstacles.forEach((obstacle, obstacleIndex) => {
        // Use the PREDICTED center of the leaf for collision detection
        const leafCenterX = nextX + leafWidth / 2;
        const leafCenterY = nextY + leafHeight / 2;
        
        let dx, dy, distance;
        
        if (obstacle.type === 'circle' && obstacle.radius) {
          // Circle-to-circle collision detection
          const obstacleCenterX = obstacle.x + obstacle.radius;
          const obstacleCenterY = obstacle.y + obstacle.radius;
          
          dx = leafCenterX - obstacleCenterX;
          dy = leafCenterY - obstacleCenterY;
          distance = Math.sqrt(dx * dx + dy * dy);
          
          // Use a much smaller collision radius for tighter boundaries
          const effectiveRadius = Math.min(leafWidth, leafHeight) / 8; // Changed from 2.5 to 8 for much tighter collision
          
          // Check if we're colliding (circle to circle) with minimal margin
          const collisionDistance = obstacle.radius + effectiveRadius + 1; // 1px minimal safety margin
          
          if (distance < collisionDistance) {
            collisionDetected = true;
            
            // Prevent the movement by keeping current position
            nextX = pos.x;
            nextY = pos.y;
            
            // Handle edge case where centers overlap
            if (distance < 0.01) {
              const angle = Math.random() * Math.PI * 2;
              nextX = obstacleCenterX + Math.cos(angle) * collisionDistance - leafWidth / 2;
              nextY = obstacleCenterY + Math.sin(angle) * collisionDistance - leafHeight / 2;
              pos.vx = Math.cos(angle) * 2;
              pos.vy = Math.sin(angle) * 2;
            } else {
              // Reflect velocity based on collision normal
              const normalX = dx / distance;
              const normalY = dy / distance;
              
              // Calculate velocity component along normal
              const velocityDotNormal = pos.vx * normalX + pos.vy * normalY;
              
              // Only bounce if moving towards obstacle
              if (velocityDotNormal < 0) {
                // Reflect velocity with controlled bounce
                pos.vx -= 1.8 * velocityDotNormal * normalX;
                pos.vy -= 1.8 * velocityDotNormal * normalY;
                
                // Apply damping for stability
                pos.vx *= 0.6;
                pos.vy *= 0.6;
                
                // Add minimal random movement
                pos.vx += (Math.random() - 0.5) * 0.2;
                pos.vy += (Math.random() - 0.5) * 0.1;
              }
            }
          }
        } else {
          // Rectangle collision detection (existing code)
          const closestX = Math.max(obstacle.x, Math.min(leafCenterX, obstacle.x + obstacle.width));
          const closestY = Math.max(obstacle.y, Math.min(leafCenterY, obstacle.y + obstacle.height));
          
          dx = leafCenterX - closestX;
          dy = leafCenterY - closestY;
          distance = Math.sqrt(dx * dx + dy * dy);
          
          const effectiveRadius = Math.min(leafWidth, leafHeight) / 8; // Changed from 2.5 to 8 for much tighter collision
          const collisionThreshold = effectiveRadius + 1; // 1px minimal safety margin
          
          if (distance < collisionThreshold) {
            collisionDetected = true;
            
            // Prevent the movement
            nextX = pos.x;
            nextY = pos.y;
            
            if (distance < 0.01) {
              const angle = Math.random() * Math.PI * 2;
              nextX = pos.x + Math.cos(angle) * collisionThreshold;
              nextY = pos.y + Math.sin(angle) * collisionThreshold;
              pos.vx = Math.cos(angle) * 2;
              pos.vy = Math.sin(angle) * 2;
            } else {
              const normalX = dx / distance;
              const normalY = dy / distance;
              
              const velocityDotNormal = pos.vx * normalX + pos.vy * normalY;
              
              if (velocityDotNormal < 0) {
                pos.vx -= 1.8 * velocityDotNormal * normalX;
                pos.vy -= 1.8 * velocityDotNormal * normalY;
                
                pos.vx *= 0.6;
                pos.vy *= 0.6;
                
                pos.vx += (Math.random() - 0.5) * 0.2;
                pos.vy += (Math.random() - 0.5) * 0.1;
              }
            }
          }
        }
      });
      
      // Update position to the validated next position
      pos.x = nextX;
      pos.y = nextY;
      
      // Apply transform with will-change for GPU optimization
      const transformValue = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${config.size})`;
      containerRef.current.style.transform = transformValue;
      
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, delay, obstacles]);
  
  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden', // Prevent flickering
        transform: `translate3d(${config.startX}px, ${config.startY}px, 0) scale(${config.size})` // Set initial position
      }}
    >
      <div>
        <svg
          width={config.type === 'lemongrass' ? "24" : config.type === 'kaffir' ? "32" : config.type === 'cilantro' ? "28" : "30"}
          height={config.type === 'lemongrass' ? "65" : config.type === 'kaffir' ? "46" : config.type === 'cilantro' ? "32" : "36"}
          viewBox={config.type === 'lemongrass' ? "0 0 24 65" : config.type === 'kaffir' ? "0 0 32 46" : config.type === 'cilantro' ? "0 0 28 32" : "0 0 30 36"}
          fill="none"
          style={{
            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
          }}
        >
          {config.type === 'lemongrass' ? (
            // Lemongrass - realistic grass blades with natural curves
            <>
              {/* Main blade with natural bend */}
              <path
                d="M12 0 C11.8 8 11.5 18 11.2 28 C11 38 10.8 48 11 56 C11.2 60 11.5 63 12 65 C12.5 63 12.8 60 13 56 C13.2 48 13 38 12.8 28 C12.5 18 12.2 8 12 0"
                fill={`url(#${config.type}Gradient${index})`}
              />
              {/* Left blade with different curve */}
              <path
                d="M7 4 C6.5 12 6 22 5.5 32 C5 42 4.8 52 5.2 58 C5.5 62 6 64 6.5 65 C7 64 7.2 62 7.5 58 C7.8 52 8 42 7.8 32 C7.5 22 7.2 12 7 4"
                fill={`url(#${config.type}Gradient${index}2)`}
                opacity="0.9"
              />
              {/* Right blade tilted */}
              <path
                d="M17 3 C16.8 11 16.5 21 16.5 31 C16.5 41 16.8 51 17.2 57 C17.5 61 18 63 18.5 64 C19 63 19.2 61 19.5 57 C19.8 51 20 41 19.8 31 C19.5 21 19 11 17 3"
                fill={`url(#${config.type}Gradient${index}3)`}
                opacity="0.85"
              />
              {/* Blade lines for texture */}
              <path
                d="M12 8 C12 20 12 35 12 55 M7 10 C7 22 7 38 7 52 M17 9 C17 21 17 36 17 50"
                stroke={config.colors[2]}
                strokeWidth="0.3"
                opacity="0.4"
              />
            </>
          ) : config.type === 'kaffir' ? (
            // Kaffir lime - realistic double leaf with waist
            <>
              {/* Top leaf segment with natural shape */}
              <path
                d="M16 2 C10 2 6 6 5 11 C4 16 6 20 10 22 C12 22.5 14 22.5 16 22 C16.5 21.8 17 21.5 17.5 21 C18 21.5 18.5 21.8 19 22 C21 22.5 23 22.5 25 22 C29 20 31 16 30 11 C29 6 25 2 19 2"
                fill={`url(#${config.type}Gradient${index})`}
              />
              {/* Bottom leaf segment */}
              <path
                d="M16 22 C15.5 22 15 22.2 14.5 22.5 C14 22.8 13.5 23 13 23.5 C10 25 6 29 5 34 C4 39 6 43 11 45 C14 46 16 46 16 46 C16 46 18 46 21 45 C26 43 28 39 27 34 C26 29 22 25 19 23.5 C18.5 23 18 22.8 17.5 22.5 C17 22.2 16.5 22 16 22"
                fill={`url(#${config.type}Gradient${index})`}
              />
              {/* Central vein */}
              <path
                d="M16 2 C16 12 16 22 16 22 C16 22 16 34 16 46"
                stroke={config.colors[2]}
                strokeWidth="1"
                opacity="0.7"
              />
              {/* Lateral veins */}
              <path
                d="M16 6 C12 7 9 8 6 10 M16 10 C12 11 9 12 6 14 M16 14 C12 15 9 16 6 18 M16 18 C12 19 9 20 7 21"
                stroke={config.colors[2]}
                strokeWidth="0.4"
                opacity="0.4"
              />
              <path
                d="M16 6 C20 7 23 8 26 10 M16 10 C20 11 23 12 26 14 M16 14 C20 15 23 16 26 18 M16 18 C20 19 23 20 25 21"
                stroke={config.colors[2]}
                strokeWidth="0.4"
                opacity="0.4"
              />
              {/* Bottom veins */}
              <path
                d="M16 26 C12 27 9 28 6 30 M16 30 C12 31 9 32 6 34 M16 34 C12 35 9 36 6 38 M16 38 C12 39 9 40 7 42 M16 42 C12 43 9 44 7 45"
                stroke={config.colors[2]}
                strokeWidth="0.4"
                opacity="0.4"
              />
              <path
                d="M16 26 C20 27 23 28 26 30 M16 30 C20 31 23 32 26 34 M16 34 C20 35 23 36 26 38 M16 38 C20 39 23 40 25 42 M16 42 C20 43 23 44 25 45"
                stroke={config.colors[2]}
                strokeWidth="0.4"
                opacity="0.4"
              />
              {/* Waist connection detail */}
              <circle cx="16" cy="22" r="1.5" fill={config.colors[1]} opacity="0.3" />
              {/* Natural spots */}
              <circle cx="11" cy="12" r="0.4" fill={config.colors[2]} opacity="0.2" />
              <circle cx="21" cy="35" r="0.4" fill={config.colors[2]} opacity="0.2" />
            </>
          ) : config.type === 'cilantro' ? (
            // Cilantro - realistic compound leaf structure
            <>
              {/* Central leaflet */}
              <path
                d="M14 28 C11 28 9 26 8 23 C7 20 8 18 10 16 C12 15 14 15 16 16 C18 15 20 15 22 16 C24 18 25 20 24 23 C23 26 21 28 18 28 C17 28 16 28 14 28"
                fill={`url(#${config.type}Gradient${index})`}
              />
              {/* Left leaflet */}
              <path
                d="M8 20 C5 20 3 18 2 15 C1 12 2 10 4 8 C6 7 8 7 10 8 C12 10 13 12 12 15 C11 18 9 20 8 20"
                fill={`url(#${config.type}Gradient${index})`}
              />
              {/* Right leaflet */}
              <path
                d="M20 20 C23 20 25 18 26 15 C27 12 26 10 24 8 C22 7 20 7 18 8 C16 10 15 12 16 15 C17 18 19 20 20 20"
                fill={`url(#${config.type}Gradient${index})`}
              />
              {/* Top leaflets */}
              <path
                d="M10 12 C8 12 6 10 5 8 C4 6 5 4 7 3 C9 2 11 2 12 3 C13 4 14 6 13 8 C12 10 11 12 10 12"
                fill={`url(#${config.type}Gradient${index})`}
                opacity="0.9"
              />
              <path
                d="M18 12 C20 12 22 10 23 8 C24 6 23 4 21 3 C19 2 17 2 16 3 C15 4 14 6 15 8 C16 10 17 12 18 12"
                fill={`url(#${config.type}Gradient${index})`}
                opacity="0.9"
              />
              {/* Stems */}
              <path
                d="M14 32 C14 28 14 24 14 20 C14 16 14 12 14 8 C14 4 14 2 14 0 M8 20 L14 16 M20 20 L14 16 M10 12 L14 8 M18 12 L14 8"
                stroke={config.colors[2]}
                strokeWidth="0.6"
                opacity="0.5"
              />
              {/* Leaf veins */}
              <path
                d="M14 26 C12 25 10 24 9 22 M14 26 C16 25 18 24 19 22 M14 26 L14 20 M8 18 C6 17 4 16 3 14 M8 18 L8 12 M20 18 C22 17 24 16 25 14 M20 18 L20 12"
                stroke={config.colors[2]}
                strokeWidth="0.3"
                opacity="0.3"
              />
            </>
          ) : (
            // Thai Basil - realistic horapha with purple tinge
            <>
              {/* Thai basil leaf with characteristic pointed shape */}
              <path
                d="M15 1 C10 2 6 5 4 10 C2 15 2 21 4 26 C6 31 10 34 15 36 C20 34 24 31 26 26 C28 21 28 15 26 10 C24 5 20 2 15 1"
                fill={`url(#${config.type}Gradient${index})`}
              />
              {/* Central vein */}
              <path
                d="M15 1 L15 36"
                stroke={config.colors[2]}
                strokeWidth="0.8"
                opacity="0.7"
              />
              {/* Lateral veins */}
              <path
                d="M15 6 C11 7 8 9 6 11 M15 11 C11 12 8 14 6 16 M15 16 C11 17 8 19 6 21 M15 21 C11 22 8 24 6 26 M15 26 C11 27 8 29 6 31 M15 31 C11 32 8 33 7 34"
                stroke={config.colors[2]}
                strokeWidth="0.5"
                opacity="0.5"
              />
              <path
                d="M15 6 C19 7 22 9 24 11 M15 11 C19 12 22 14 24 16 M15 16 C19 17 22 19 24 21 M15 21 C19 22 22 24 24 26 M15 26 C19 27 22 29 24 31 M15 31 C19 32 22 33 23 34"
                stroke={config.colors[2]}
                strokeWidth="0.5"
                opacity="0.5"
              />
              {/* Purple flower buds at tips - characteristic of Thai basil */}
              <circle cx="15" cy="3" r="0.6" fill="#9333ea" opacity="0.7" />
              <circle cx="14" cy="5" r="0.5" fill="#9333ea" opacity="0.6" />
              <circle cx="16" cy="5" r="0.5" fill="#9333ea" opacity="0.6" />
              {/* Purple stem accent */}
              <path
                d="M15 1 L15 36"
                stroke="#8b5cf6"
                strokeWidth="0.3"
                opacity="0.2"
              />
              {/* Glossy sheen */}
              <ellipse cx="15" cy="18" rx="4" ry="8" fill="white" opacity="0.1" />
            </>
          )}
          
          <defs>
            <linearGradient id={`${config.type}Gradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={config.colors[0]} />
              <stop offset="30%" stopColor={config.colors[1]} />
              <stop offset="70%" stopColor={config.colors[1]} />
              <stop offset="100%" stopColor={config.colors[2]} />
            </linearGradient>
            {config.type === 'lemongrass' && (
              <>
                <linearGradient id={`${config.type}Gradient${index}2`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={config.colors[0]} />
                  <stop offset="40%" stopColor={config.colors[1]} />
                  <stop offset="100%" stopColor={config.colors[2]} />
                </linearGradient>
                <linearGradient id={`${config.type}Gradient${index}3`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={config.colors[1]} />
                  <stop offset="60%" stopColor={config.colors[1]} />
                  <stop offset="100%" stopColor={config.colors[2]} />
                </linearGradient>
              </>
            )}
          </defs>
        </svg>
      </div>
    </div>
  );
});

FloatingLeaf.displayName = 'FloatingLeaf';

export default FloatingLeaf;