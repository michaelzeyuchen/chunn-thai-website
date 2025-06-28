import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAnimation?: boolean;
  useImage?: boolean; // Option to use actual image instead of SVG
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'lg', 
  showAnimation = true,
  useImage = false 
}) => {
  const sizes = {
    sm: { width: 80, height: 80 },
    md: { width: 128, height: 128 },
    lg: { width: 192, height: 192 },
    xl: { width: 288, height: 288 }
  };

  const currentSize = sizes[size];

  // If you want to use the actual logo image
  if (useImage) {
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
        {/* Note: You'll need to add the actual logo image to public/logo-chunn-thai.png */}
        <div 
          style={{ width: currentSize.width, height: currentSize.height }}
          className="relative"
        >
          <div className="text-yellow-400 text-center">
            [Logo Image Here]
          </div>
        </div>
      </motion.div>
    );
  }

  // SVG version (currently being used)
  return null; // The ChunnLogo component in ChunnThaiHomepage.tsx is being used
};

export default Logo;