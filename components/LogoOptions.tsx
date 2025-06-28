import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoOptionsProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAnimation?: boolean;
  usePDF?: boolean;
}

const LogoOptions: React.FC<LogoOptionsProps> = ({ 
  size = 'lg', 
  showAnimation = true,
  usePDF = false 
}) => {
  const sizes = {
    sm: { width: 80, height: 80 },
    md: { width: 128, height: 128 },
    lg: { width: 192, height: 192 },
    xl: { width: 288, height: 288 }
  };

  const currentSize = sizes[size];

  if (usePDF) {
    // Option to use the actual PDF/image logo
    return (
      <motion.div
        className="relative"
        whileHover={showAnimation ? { scale: 1.05 } : {}}
        animate={showAnimation ? {
          filter: [
            'drop-shadow(0 0 20px rgba(212, 175, 55, 0.5))',
            'drop-shadow(0 0 40px rgba(212, 175, 55, 0.8))',
            'drop-shadow(0 0 20px rgba(212, 175, 55, 0.5))'
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Image
          src="/logo-chunn-thai.png" // You'll need to convert PDF to PNG
          alt="Chunn Thai Cuisine"
          width={currentSize.width}
          height={currentSize.height}
          priority
        />
      </motion.div>
    );
  }

  // SVG Recreation matching the actual logo
  return (
    <motion.div
      className="relative"
      style={{ width: currentSize.width, height: currentSize.height }}
      whileHover={showAnimation ? { scale: 1.05, rotateY: 10 } : {}}
    >
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle with gradient */}
        <circle
          cx="100"
          cy="100"
          r="98"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          fill="black"
        />
        
        {/* Inner circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />

        {/* Wheat decoration on left */}
        <g transform="translate(20, 100) rotate(-15)">
          {/* Wheat stalk */}
          <path
            d="M0 0 Q5 -20 0 -40"
            stroke="#D4AF37"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Wheat grains */}
          {[...Array(5)].map((_, i) => (
            <ellipse
              key={i}
              cx={-2 - i * 3}
              cy={-10 - i * 6}
              rx="3"
              ry="5"
              fill="url(#grainGradient)"
              transform={`rotate(${-30 + i * 10} ${-2 - i * 3} ${-10 - i * 6})`}
            />
          ))}
        </g>

        {/* Text */}
        <text
          x="100"
          y="90"
          textAnchor="middle"
          className="font-serif"
          fill="#D4AF37"
          fontSize={size === 'xl' ? '36' : size === 'lg' ? '28' : size === 'md' ? '20' : '16'}
          fontWeight="bold"
          letterSpacing="2"
        >
          CHUNN
        </text>
        
        <text
          x="100"
          y={size === 'xl' ? '125' : size === 'lg' ? '115' : size === 'md' ? '110' : '105'}
          textAnchor="middle"
          className="font-serif"
          fill="#D4AF37"
          fontSize={size === 'xl' ? '36' : size === 'lg' ? '28' : size === 'md' ? '20' : '16'}
          fontWeight="bold"
          letterSpacing="6"
        >
          THAI
        </text>
        
        <text
          x="100"
          y={size === 'xl' ? '145' : size === 'lg' ? '135' : size === 'md' ? '125' : '120'}
          textAnchor="middle"
          className="font-serif"
          fill="#D4AF37"
          fontSize={size === 'xl' ? '16' : size === 'lg' ? '14' : size === 'md' ? '12' : '10'}
          fontStyle="italic"
          letterSpacing="4"
        >
          cuisine
        </text>

        {/* Gradients */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700">
              {showAnimation && (
                <animate
                  attributeName="stop-color"
                  values="#FFD700;#D4AF37;#FFD700"
                  dur="3s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8860B">
              {showAnimation && (
                <animate
                  attributeName="stop-color"
                  values="#B8860B;#FFD700;#B8860B"
                  dur="3s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>
          
          <linearGradient id="grainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default LogoOptions;