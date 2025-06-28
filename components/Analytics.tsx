'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Log page views
    const url = pathname + (searchParams?.toString() || '')
    
    // Google Analytics 4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag('config', 'G-27Q5CMN11B', {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title
      })
    }

    // Performance monitoring
    if ('performance' in window && 'measure' in window.performance) {
      // Measure page load time
      const measurePageLoad = () => {
        const perfData = window.performance.timing
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
        console.log('Page Load Time:', pageLoadTime, 'ms')
        
        // Report Core Web Vitals
        try {
          // First Contentful Paint
          const fcp = performance.getEntriesByName('first-contentful-paint')[0]
          if (fcp) {
            console.log('FCP:', fcp.startTime, 'ms')
          }
          
          // Largest Contentful Paint
          if ('PerformanceObserver' in window) {
            const lcp = new PerformanceObserver((list) => {
              const entries = list.getEntries()
              const lastEntry = entries[entries.length - 1]
              console.log('LCP:', lastEntry.startTime, 'ms')
            })
            lcp.observe({ type: 'largest-contentful-paint', buffered: true })
          }
        } catch (e) {
          // Fail silently
        }
      }
      
      if (document.readyState === 'complete') {
        measurePageLoad()
      } else {
        window.addEventListener('load', measurePageLoad)
      }
    }
  }, [pathname, searchParams])

  return null
}