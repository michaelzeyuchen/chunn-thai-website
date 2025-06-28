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
      className="w-full max-w-6xl mx-auto"
    >
      {/* All contact info and social media in one row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-8 lg:gap-10 xl:gap-12 text-center">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 sm:gap-2 group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => window.open('https://maps.google.com/?q=Shop+T01/152-194+Allison+Crescent,+Menai+NSW+2234', '_blank')}
        >
          <MapPin className={`w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-colors ${
            isDark ? 'text-yellow-400 group-hover:text-yellow-300' : 'text-yellow-600 group-hover:text-yellow-700'
          }`} />
          <p className={`text-sm xs:text-base sm:text-base md:text-sm lg:text-base font-light transition-colors ${
            isDark ? 'text-gray-200 group-hover:text-yellow-300' : 'text-gray-700 group-hover:text-yellow-600'
          }`}>
            <span className="hidden md:inline">Shop T01/152-194 Allison Crescent, Menai NSW 2234</span>
            <span className="md:hidden">Shop T01/152-194 Allison Crescent<br className="sm:hidden"/>Menai NSW 2234</span>
          </p>
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1 sm:gap-2 group"
          whileHover={{ scale: 1.05 }}
        >
          <Phone className={`w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-colors ${
            isDark ? 'text-yellow-400 group-hover:text-yellow-300' : 'text-yellow-600 group-hover:text-yellow-700'
          }`} />
          <a
            href="tel:0432506436"
            className={`text-sm xs:text-base sm:text-base md:text-sm lg:text-base font-light transition-colors ${
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
          className="flex items-center gap-1 sm:gap-2 group"
          whileHover={{ scale: 1.05 }}
        >
          <Mail className={`w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-colors ${
            isDark ? 'text-yellow-400 group-hover:text-yellow-300' : 'text-yellow-600 group-hover:text-yellow-700'
          }`} />
          <a
            href="mailto:cuisine@chunnthai.com.au"
            className={`text-sm xs:text-base sm:text-base md:text-sm lg:text-base font-light transition-colors ${
              isDark ? 'text-gray-200 group-hover:text-yellow-300' : 'text-gray-700 group-hover:text-yellow-600'
            }`}
          >
            cuisine@chunnthai.com.au
          </a>
        </motion.div>


        {/* Social Media Icons - Same row */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 sm:gap-4"
        >
          {/* Facebook */}
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
            <Facebook className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </motion.a>

          {/* Instagram */}
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
            <Instagram className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MinimalContactInfo;