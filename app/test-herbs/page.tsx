'use client';

import React, { useState } from 'react';
import FloatingLeaf from '@/components/FloatingLeaf';
import LazyFloatingLeaves from '@/components/LazyFloatingLeaves';

export default function TestHerbs() {
  const [showHerbs, setShowHerbs] = useState(true);
  const [showSingleLeaf, setShowSingleLeaf] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Herb Testing Page</h1>
      
      <div className="mb-4 space-x-4">
        <button 
          onClick={() => setShowHerbs(!showHerbs)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Toggle All Herbs ({showHerbs ? 'ON' : 'OFF'})
        </button>
        <button 
          onClick={() => setShowSingleLeaf(!showSingleLeaf)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Toggle Single Leaf ({showSingleLeaf ? 'ON' : 'OFF'})
        </button>
      </div>
      
      {/* Test single leaf with forced visible styling */}
      {showSingleLeaf && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Single Leaf Test (Forced Visible)</h2>
          <div className="relative h-32 bg-white rounded border-2 border-gray-300">
            <div 
              className="absolute left-20 top-10"
              style={{
                opacity: 1,
                zIndex: 999,
                transform: 'scale(2)'
              }}
            >
              <FloatingLeaf delay={0} index={0} obstacles={[]} />
            </div>
          </div>
        </div>
      )}
      
      {/* Test full LazyFloatingLeaves component */}
      {showHerbs && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Full Herbs Component</h2>
          <div className="relative h-96 bg-white rounded border-2 border-gray-300 overflow-hidden">
            <LazyFloatingLeaves obstacles={[]} />
          </div>
        </div>
      )}
      
      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-200 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <ul className="text-sm space-y-1">
          <li>Window width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}</li>
          <li>Window height: {typeof window !== 'undefined' ? window.innerHeight : 'N/A'}</li>
          <li>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</li>
          <li>Is Mobile: {typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window) ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    </div>
  );
}