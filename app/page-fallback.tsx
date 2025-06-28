'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Load the homepage with no SSR to avoid hydration issues
const ChunnThaiHomepage = dynamic(
  () => import('@/components/ChunnThaiHomepage'),
  { 
    ssr: false,
    loading: () => null // No loading state
  }
);

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted immediately
    setMounted(true);
    
    // Add error boundary
    window.addEventListener('error', (e) => {
      console.error('Global error:', e);
      setError(e.message);
    });

    // Fallback timeout - if nothing loads in 5 seconds, show error
    const timeout = setTimeout(() => {
      if (!mounted) {
        setError('Failed to load. Please refresh the page.');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">Error Loading Page</div>
          <div className="text-white">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Return the component immediately without waiting
  return <ChunnThaiHomepage />;
}