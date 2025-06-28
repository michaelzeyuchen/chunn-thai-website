'use client'

import { useEffect } from 'react'

export default function DomainTracking() {
  useEffect(() => {
    // Ensure GA tracks the correct domain
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const currentHost = window.location.hostname
      
      // If we're on Firebase hosting URLs, also send a pageview for the custom domain
      if (currentHost === 'chunnthai.web.app' || currentHost === 'chunnthai.firebaseapp.com') {
        // Send an event to track Firebase hosting visits
        window.gtag('event', 'firebase_hosting_visit', {
          'event_category': 'engagement',
          'event_label': currentHost,
          'value': 1
        })
        
        // Also track as if it were the custom domain
        const customUrl = window.location.href.replace(/chunnthai\.(web\.app|firebaseapp\.com)/, 'chunnthai.com.au')
        window.gtag('config', 'G-27Q5CMN11B', {
          'page_location': customUrl,
          'page_title': document.title,
          'page_path': window.location.pathname
        })
      }
    }
  }, [])
  
  return null
}