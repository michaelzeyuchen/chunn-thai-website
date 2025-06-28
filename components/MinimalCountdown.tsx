import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeUnit {
  value: number;
  label: string;
}

interface CountdownUnitProps {
  value: number;
  label: string;
  delay: number;
  isDark?: boolean;
}

const CountdownUnit = React.memo<CountdownUnitProps>(({ value, label, delay, isDark = false }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isSamsungBrowser, setIsSamsungBrowser] = useState(false);
  
  useEffect(() => {
    // Detect Samsung browser
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isSamsung = userAgent.includes('samsungbrowser');
    setIsSamsungBrowser(isSamsung);
  }, []);
  
  useEffect(() => {
    if (displayValue !== value) {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="text-center"
    >
      <motion.div 
        className="relative inline-block"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={displayValue}
            initial={{ opacity: 0, rotateX: -90, y: 10 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: 90, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`relative text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extralight tabular-nums ${
              isSamsungBrowser 
                ? '' 
                : 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500'
            }`}
            style={{ 
              letterSpacing: '-0.02em',
              fontWeight: 200,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              ...(isSamsungBrowser ? { 
                color: isDark ? '#FFD700' : '#B8860B',
                WebkitTextFillColor: 'initial'
              } : {})
            }}
          >
            {String(displayValue).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            background: isDark 
              ? 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(184, 134, 11, 0.1) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
        {/* Ultra-narrow obstacle for countdown number - just the digits */}
        <div className="herb-obstacle absolute left-1/2 top-0 -translate-x-1/2 h-full pointer-events-none" style={{ width: '1.5ch' }} />
      </motion.div>
      
      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
        className={`text-xs sm:text-sm md:text-sm lg:text-base uppercase tracking-[0.1em] sm:tracking-[0.15em] font-light mt-1 sm:mt-2 ${
          isDark ? 'text-neutral-300/80' : 'text-gray-600/80'
        }`}
      >
        {label}
      </motion.p>
    </motion.div>
  );
});

CountdownUnit.displayName = 'CountdownUnit';

interface MinimalCountdownProps {
  isDark?: boolean;
}

const MinimalCountdown: React.FC<MinimalCountdownProps> = ({ isDark = false }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2025-08-01T00:00:00+10:00'); // August 1st, 2025 Sydney time
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateCountdown();
    setIsLoaded(true);
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) {
    return <div className="h-24" />; // Placeholder to prevent layout shift
  }

  const timeUnits: TimeUnit[] = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-4 gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 max-w-sm xs:max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto"
      >
        {timeUnits.map((unit, index) => (
          <CountdownUnit
            key={unit.label}
            value={unit.value}
            label={unit.label}
            delay={index * 0.15}
            isDark={isDark}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default MinimalCountdown;