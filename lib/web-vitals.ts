import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

export interface Metric {
  id: string
  name: string
  value: number
  rating?: 'good' | 'needs-improvement' | 'poor'
  navigationType?: string
}

function getConnectionSpeed() {
  const nav = navigator as any
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection
  
  if (connection?.effectiveType) {
    return connection.effectiveType
  }
  
  return 'unknown'
}

function sendToAnalytics(metric: Metric) {
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_rating: metric.rating,
    })
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, metric.value, metric.rating)
  }
}

export function reportWebVitals() {
  try {
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onCLS(sendToAnalytics)
    onTTFB(sendToAnalytics)
    onINP(sendToAnalytics)
  } catch (err) {
    console.error('[Web Vitals] Failed to track metrics', err)
  }
}