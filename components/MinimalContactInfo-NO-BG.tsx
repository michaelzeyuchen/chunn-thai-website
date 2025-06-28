import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

interface MinimalContactInfoProps {
  isDark?: boolean;
}

const MinimalContactInfo: React.FC<MinimalContactInfoProps> = ({ isDark = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Simplified contact layout without cards */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-16 text-center">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 sm:gap-3 group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => window.open('https://maps.google.com/?q=Shop+T01/152-194+Allison+Crescent,+Menai+NSW+2234', '_blank')}
        >
          <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-colors ${
            isDark ? 'text-yellow-400 group-hover:text-yellow-300' : 'text-yellow-600 group-hover:text-yellow-700'
          }`} />
          <p className={`text-sm sm:text-base md:text-lg font-light transition-colors ${
            isDark ? 'text-gray-200 group-hover:text-yellow-300' : 'text-gray-700 group-hover:text-yellow-600'
          }`}>
            Shop T01/152-194 Allison Crescent, Menai NSW 2234
          </p>
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 sm:gap-3 group"
          whileHover={{ scale: 1.05 }}
        >
          <Phone className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-colors ${
            isDark ? 'text-yellow-400 group-hover:text-yellow-300' : 'text-yellow-600 group-hover:text-yellow-700'
          }`} />
          <a
            href="tel:0432506436"
            className={`text-sm sm:text-base md:text-lg font-light transition-colors ${
              isDark ? 'text-gray-200 group-hover:text-yellow-300' : 'text-gray-700 group-hover:text-yellow-600'
            }`}
          >
            0432 506 436
          </a>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 sm:gap-3 group"
          whileHover={{ scale: 1.05 }}
        >
          <Mail className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-colors ${
            isDark ? 'text-yellow-400 group-hover:text-yellow-300' : 'text-yellow-600 group-hover:text-yellow-700'
          }`} />
          <a
            href="mailto:cuisine@chunnthai.com.au"
            className={`text-sm sm:text-base md:text-lg font-light transition-colors ${
              isDark ? 'text-gray-200 group-hover:text-yellow-300' : 'text-gray-700 group-hover:text-yellow-600'
            }`}
          >
            cuisine@chunnthai.com.au
          </a>
        </motion.div>
      </div>

      {/* Social Media Icons - NO BACKGROUNDS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex items-center justify-center gap-4 mt-4 md:mt-6"
      >
        {/* Facebook - NO BACKGROUND */}
        <motion.a
          href="https://www.facebook.com/profile.php?id=61576853373611"
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors duration-300 ${
            isDark 
              ? 'text-yellow-400 hover:text-yellow-300' 
              : 'text-yellow-600 hover:text-yellow-700'
          }`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Facebook className="w-5 h-5 md:w-6 md:h-6" />
        </motion.a>

        {/* Instagram - NO BACKGROUND */}
        <motion.a
          href="https://www.instagram.com/chunn_thai/"
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors duration-300 ${
            isDark 
              ? 'text-yellow-400 hover:text-yellow-300' 
              : 'text-yellow-600 hover:text-yellow-700'
          }`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Instagram className="w-5 h-5 md:w-6 md:h-6" />
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default MinimalContactInfo;