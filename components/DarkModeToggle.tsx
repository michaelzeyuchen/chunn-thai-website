import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDark, toggle }) => {
  return (
    <motion.button
      onClick={toggle}
      className={`fixed top-2 right-2 sm:top-4 sm:right-4 z-50 p-2 sm:p-3 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-neutral-800/80 text-yellow-400 hover:bg-neutral-700/80' 
          : 'bg-white/80 text-gray-800 hover:bg-gray-100/80'
      } backdrop-blur-sm shadow-lg`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 360 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;