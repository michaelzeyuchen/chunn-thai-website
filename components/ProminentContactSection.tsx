import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ProminentContactSectionProps {
  isDark?: boolean;
}

const ProminentContactSection: React.FC<ProminentContactSectionProps> = ({ isDark = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Section Header */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`text-3xl md:text-4xl font-light text-center mb-8 ${
          isDark ? 'text-yellow-400' : 'text-yellow-600'
        }`}
        style={{
          fontFamily: "'Playfair Display', serif",
          letterSpacing: '0.05em'
        }}
      >
        Visit Us
      </motion.h2>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Location Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, translateY: -5 }}
          className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-700/30 hover:border-yellow-600/50' 
              : 'bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 hover:border-yellow-300 shadow-lg hover:shadow-xl'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${
              isDark ? 'bg-yellow-800/30' : 'bg-yellow-100'
            }`}>
              <MapPin className={`w-6 h-6 ${
                isDark ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-yellow-300' : 'text-gray-800'
              }`}>Location</h3>
              <p className={`text-base leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Shop T01/152-194 Allison Crescent<br />
                Menai NSW 2234
              </p>
              <motion.a
                href="https://maps.google.com/?q=Shop+T01/152-194+Allison+Crescent+Menai+NSW+2234"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 mt-3 text-sm font-medium ${
                  isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'
                }`}
              >
                Get Directions
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, translateY: -5 }}
          className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-700/30 hover:border-yellow-600/50' 
              : 'bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 hover:border-yellow-300 shadow-lg hover:shadow-xl'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${
              isDark ? 'bg-yellow-800/30' : 'bg-yellow-100'
            }`}>
              <Phone className={`w-6 h-6 ${
                isDark ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-yellow-300' : 'text-gray-800'
              }`}>Contact</h3>
              <motion.a
                href="tel:0432506436"
                whileHover={{ scale: 1.02 }}
                className={`block text-base mb-2 ${
                  isDark ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                0432 506 436
              </motion.a>
              <motion.a
                href="mailto:cuisine@chunnthai.com.au"
                whileHover={{ scale: 1.02 }}
                className={`block text-base ${
                  isDark ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                cuisine@chunnthai.com.au
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Opening Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`text-center p-6 rounded-2xl backdrop-blur-sm ${
          isDark 
            ? 'bg-gradient-to-br from-yellow-900/10 to-transparent' 
            : 'bg-gradient-to-br from-yellow-50/50 to-transparent'
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className={`w-5 h-5 ${
            isDark ? 'text-yellow-400' : 'text-yellow-600'
          }`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-yellow-300' : 'text-gray-800'
          }`}>Opening Hours</h3>
        </div>
        <p className={`text-base ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Tuesday - Sunday: 5:00 PM - 9:30 PM<br />
          <span className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>Closed Mondays</span>
        </p>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute -top-10 -left-10 w-32 h-32 opacity-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className={`w-full h-full rounded-full ${
          isDark ? 'bg-yellow-400' : 'bg-yellow-500'
        }`} />
      </motion.div>
    </motion.div>
  );
};

export default ProminentContactSection;