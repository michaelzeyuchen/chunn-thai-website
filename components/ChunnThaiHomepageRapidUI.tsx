'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook, FaClock, FaUtensils, FaStar, FaQuoteLeft } from 'react-icons/fa'
import { BiChevronDown } from 'react-icons/bi'
import Image from 'next/image'

export default function ChunnThaiHomepageRapidUI() {
  const [activeTab, setActiveTab] = useState('appetizers')
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1])

  // Track scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Menu categories
  const menuCategories = {
    appetizers: [
      { name: 'Spring Rolls', price: '$8.90', description: 'Crispy vegetable spring rolls with sweet chili sauce' },
      { name: 'Satay Chicken', price: '$10.90', description: 'Grilled marinated chicken skewers with peanut sauce' },
      { name: 'Tom Yum Soup', price: '$12.90', description: 'Spicy and sour soup with prawns and mushrooms' },
    ],
    mains: [
      { name: 'Pad Thai', price: '$16.90', description: 'Stir-fried rice noodles with prawns, tofu, and tamarind sauce' },
      { name: 'Green Curry', price: '$18.90', description: 'Traditional Thai green curry with vegetables and your choice of protein' },
      { name: 'Massaman Beef', price: '$22.90', description: 'Slow-cooked beef in rich massaman curry with potatoes' },
    ],
    desserts: [
      { name: 'Mango Sticky Rice', price: '$9.90', description: 'Sweet sticky rice with fresh mango and coconut cream' },
      { name: 'Thai Tea Panna Cotta', price: '$8.90', description: 'Silky smooth panna cotta infused with Thai tea' },
      { name: 'Coconut Ice Cream', price: '$7.90', description: 'House-made coconut ice cream with toasted peanuts' },
    ]
  }

  const testimonials = [
    { name: 'Sarah L.', text: 'Authentic flavors that transport you straight to Thailand. Can\'t wait for the opening!' },
    { name: 'Michael C.', text: 'The attention to detail in every dish is remarkable. This will be Menai\'s gem!' },
    { name: 'Lisa W.', text: 'Finally, a Thai restaurant that understands both tradition and innovation.' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Enhanced Navigation Bar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-4' 
            : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/chunn-thai-logo.svg"
                alt="Chunn Thai Cuisine"
                width={150}
                height={50}
                className={`transition-all duration-300 ${
                  isScrolled ? 'h-12' : 'h-16'
                } w-auto`}
              />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Menu', 'About', 'Gallery', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400' 
                      : 'text-white hover:text-orange-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="tel:0432506436"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isScrolled
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-white text-orange-600 hover:bg-orange-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reserve Now
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-gray-700 dark:text-gray-300"
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-red-900/90 to-amber-900/90" />
          <Image
            src="/chunn-lotus-logo.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="block">Authentic Thai</span>
              <span className="block text-orange-400">Reimagined</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the perfect harmony of traditional Thai flavors and modern culinary artistry
            </p>
            
            {/* Opening Date Badge */}
            <motion.div
              className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <FaClock className="text-orange-400 mr-2" />
              <span className="text-white font-medium">Opening August 1st, 2025</span>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="tel:0432506436"
                className="px-8 py-4 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-colors inline-flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhone className="mr-2" />
                Book Your Table
              </motion.a>
              <motion.a
                href="#menu"
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white/30 rounded-full font-semibold hover:bg-white/30 transition-colors inline-flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUtensils className="mr-2" />
                Explore Menu
              </motion.a>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <BiChevronDown className="text-white text-3xl" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Chunn Thai Cuisine brings the authentic taste of Thailand to Menai. Our chefs combine traditional recipes 
              passed down through generations with modern presentation techniques to create an unforgettable dining experience.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Fresh Ingredients',
                description: 'We source the finest herbs and spices directly from Thailand'
              },
              {
                icon: '👨‍🍳',
                title: 'Expert Chefs',
                description: 'Our team brings decades of experience from Bangkok\'s finest restaurants'
              },
              {
                icon: '🎨',
                title: 'Modern Elegance',
                description: 'Contemporary presentation meets traditional Thai hospitality'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section id="menu" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Signature Dishes
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A preview of our carefully curated menu featuring authentic Thai favorites
            </p>
          </motion.div>

          {/* Menu Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              {Object.keys(menuCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-6 py-2 rounded-full capitalize transition-all ${
                    activeTab === category
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {menuCategories[activeTab].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <span className="text-orange-600 font-bold">{item.price}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-orange-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What People Say
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg"
              >
                <FaQuoteLeft className="text-orange-600 text-3xl mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  &ldquo;{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-8">Visit Us</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-orange-400 text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-gray-300">
                      Shop 21, HomeCo Menai Marketplace<br />
                      152-194 Allison Crescent<br />
                      Menai NSW 2234
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaPhone className="text-orange-400 text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:0432506436" className="text-gray-300 hover:text-orange-400 transition-colors">
                      0432 506 436
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaClock className="text-orange-400 text-xl mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold mb-1">Opening Hours</h3>
                    <p className="text-gray-300">
                      Monday - Thursday: 11:30am - 9:30pm<br />
                      Friday - Saturday: 11:30am - 10:00pm<br />
                      Sunday: 12:00pm - 9:30pm
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-8">
                <motion.a
                  href="https://facebook.com/chunnthai"
                  className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaFacebook className="text-xl" />
                </motion.a>
                <motion.a
                  href="https://instagram.com/chunnthai"
                  className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaInstagram className="text-xl" />
                </motion.a>
              </div>
            </motion.div>

            {/* Map or Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl overflow-hidden h-96"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.0309735857!2d151.01199731520935!3d-34.01370998061011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c77f7f7f7f7f%3A0x7f7f7f7f7f7f7f7f!2sHomeCo%20Menai%20Marketplace!5e0!3m2!1sen!2sau!4v1639000000000!5m2!1sen!2sau"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Chunn Thai Cuisine. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}