import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  delay: number;
  isDark?: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, text, href, delay, isDark = false }) => {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300"
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        }}
      />
      
      {/* Icon container with animation */}
      <motion.div
        className={`relative z-10 p-1.5 rounded-full transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-yellow-800/20 to-yellow-700/20 group-hover:from-yellow-700/30 group-hover:to-yellow-600/30'
            : 'bg-gradient-to-br from-yellow-100 to-yellow-50 group-hover:from-yellow-200 group-hover:to-yellow-100'
        }`}
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-yellow-600 group-hover:text-yellow-700 transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          {icon}
        </motion.div>
      </motion.div>
      
      {/* Text with underline animation */}
      <span className={`relative z-10 text-sm transition-colors font-light inline-block ${
        isDark 
          ? 'text-gray-400 group-hover:text-gray-200' 
          : 'text-gray-600 group-hover:text-gray-800'
      }`}>
        <span className="relative">
          {text}
          {/* Narrow obstacle that fits text exactly */}
          <div className="herb-obstacle absolute inset-0 pointer-events-none" />
        </span>
        <motion.span
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-yellow-400 to-yellow-600"
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </span>
      
      {/* Floating particles on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial="hidden"
        whileHover="visible"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: "50%",
            }}
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: {
                opacity: [0, 1, 0],
                y: -30,
                transition: {
                  duration: 1,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                },
              },
            }}
          />
        ))}
      </motion.div>
    </motion.a>
  );
};

interface AnimatedContactInfoProps {
  isDark?: boolean;
}

const AnimatedContactInfo: React.FC<AnimatedContactInfoProps> = ({ isDark = false }) => {
  const contactItems = [
    {
      icon: <MapPin className="w-4 h-4" />,
      text: "Shop T01/152-194 Allison Crescent, Menai NSW 2234",
      href: "#",
      delay: 0,
    },
    {
      icon: <Phone className="w-4 h-4" />,
      text: "0432 506 436",
      href: "tel:0432506436",
      delay: 0.1,
    },
    {
      icon: <Mail className="w-4 h-4" />,
      text: "cuisine@chunnthai.com.au",
      href: "mailto:cuisine@chunnthai.com.au",
      delay: 0.2,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
      >
        {contactItems.map((item, index) => (
          <ContactItem
            key={index}
            icon={item.icon}
            text={item.text}
            href={item.href}
            delay={item.delay}
            isDark={isDark}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedContactInfo;