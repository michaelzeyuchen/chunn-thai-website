// Performance monitoring utilities

export const measurePerformance = () => {
  if (typeof window === 'undefined') return

  // Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime)
          }
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', (entry as any).processingStart - entry.startTime)
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      let clsValue = 0
      let clsEntries: PerformanceEntry[] = []
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsEntries.push(entry)
            clsValue += (entry as any).value
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Log CLS on page unload
      window.addEventListener('beforeunload', () => {
        console.log('CLS:', clsValue)
      })
    } catch (e) {
      console.log('Performance monitoring not supported')
    }
  }

  // Memory usage
  if ('memory' in performance) {
    setInterval(() => {
      const memoryInfo = (performance as any).memory
      console.log('Memory usage:', {
        usedJSHeapSize: (memoryInfo.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (memoryInfo.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        limit: (memoryInfo.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      })
    }, 10000)
  }
}

// Lazy load images with Intersection Observer
export const lazyLoadImages = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

  const images = document.querySelectorAll('img[data-lazy]')
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.getAttribute('data-lazy')
        if (src) {
          img.src = src
          img.removeAttribute('data-lazy')
          observer.unobserve(img)
        }
      }
    })
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  })

  images.forEach(img => imageObserver.observe(img))
}

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return

  // Preload fonts
  const fontPreloads = [
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' },
    { href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap', as: 'style' }
  ]

  fontPreloads.forEach(({ href, as }) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}