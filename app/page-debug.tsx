'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import with error boundary
const ChunnThaiHomepage = dynamic(
  () => import('@/components/ChunnThaiHomepage').catch(err => {
    console.error('Failed to load ChunnThaiHomepage:', err);
    const ErrorComponent = () => <div className="text-red-500">Error loading component: {err.message}</div>;
    ErrorComponent.displayName = 'ErrorComponent';
    return ErrorComponent;
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-2xl">Loading component...</div>
      </div>
    )
  }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Add debug logging
      console.log('Page mounting...');
      setMounted(true);
      console.log('Page mounted successfully');
    } catch (err) {
      console.error('Mount error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  // Always show something after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!mounted) {
        setError('Component failed to mount after 3 seconds');
        setMounted(true);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [mounted]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">Error</div>
          <div className="text-white">{error}</div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-2xl">Loading...</div>
      </div>
    );
  }

  return <ChunnThaiHomepage />;
}