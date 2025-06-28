'use client';

import dynamic from 'next/dynamic';

const ChunnThaiModern = dynamic(() => import('@/components/ChunnThaiModern'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
});

export default function ModernPage() {
  return <ChunnThaiModern />;
}