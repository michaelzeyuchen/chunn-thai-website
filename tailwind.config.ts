import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      colors: {
        gold: {
          50: '#fffef5',
          100: '#fffce6',
          200: '#fef7c3',
          300: '#fdef90',
          400: '#fbe44d',
          500: '#f5d120',
          600: '#d4af37', // Main gold color from logo
          700: '#a17c1a',
          800: '#85651a',
          900: '#71541b',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'grain-fall': 'grain-fall 15s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'grain-fall': {
          '0%': { 
            transform: 'translateY(-100px) rotate(0deg)',
            opacity: '0' 
          },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.8' },
          '100%': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0' 
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' 
          },
          '50%': { 
            boxShadow: '0 0 60px rgba(212, 175, 55, 0.8)' 
          },
        },
      },
    },
  },
  plugins: [],
}
export default config