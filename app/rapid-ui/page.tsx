'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

// Use the ULTRA enhanced version
const ChunnThaiUltraEnhanced = dynamic(() => import('@/components/ChunnThaiUltraEnhanced'), {
  ssr: false,  // Changed to false to avoid SSR issues with autoAnimate
  loading: () => <LoadingSpinner />
})

export default function RapidUIPage() {
  return (
    <>
      <ChunnThaiUltraEnhanced />
      {/* SEO content */}
      <h1 className="sr-only">Chunn Thai Cuisine - Premium Thai Restaurant in Menai Sydney</h1>
      <h2 className="sr-only">Opening August 1st, 2025 - Shop 21, HomeCo Menai Marketplace</h2>
      <p className="sr-only">Experience authentic Thai cuisine with modern presentation. Traditional recipes, fresh ingredients, and contemporary elegance.</p>
    </>
  );
}
