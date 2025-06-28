'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import Analytics from '@/components/Analytics';
import DomainTracking from '@/components/DomainTracking';

// Use the Old component which has the 9-layer background
const ChunnThaiHomepage = dynamic(() => import('@/components/ChunnThaiHomepageOld'), {
  ssr: true, // Enable SSR for better mobile support
  loading: () => <LoadingSpinner />
})

const LoadingSpinner = dynamic(() => import('@/components/LoadingSpinner'), {
  ssr: true
})

export default function Home() {
  return (
    <>
      <ServiceWorkerRegistration />
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
      <WebVitals />
      <DomainTracking />
      <ChunnThaiHomepage />
      <h1 className="sr-only">Chunn Thai Cuisine - Authentic Thai Restaurant in Menai Sydney</h1>
      <h2 className="sr-only">Opening August 1st, 2025 - Shop 21, HomeCo Menai Marketplace, 152-194 Allison Crescent, Menai NSW 2234</h2>
      <p className="sr-only">Experience authentic Thai cuisine with modern presentation. Fresh ingredients, traditional recipes, and contemporary elegance. Book your table for our grand opening.</p>
    </>
  );
}

const WebVitals = dynamic(() => import('@/components/WebVitals'), {
  ssr: false
})