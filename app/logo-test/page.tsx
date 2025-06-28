'use client';

import ChunnThaiHomepage from '@/components/ChunnThaiHomepage';

export default function LogoTestPage() {
  // Extract just the ChunnLogo component from ChunnThaiHomepage
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-center mb-8">Logo Test Page</h1>
      
      <div className="max-w-6xl mx-auto">
        <p className="text-center mb-4 text-red-600 font-semibold">
          Note: Please ensure /public/chunn-lotus-logo.png exists
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Small (80x80)</h2>
            <div className="flex justify-center">
              {/* We'll need to extract ChunnLogo to use it here */}
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">Logo SM</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Medium (128x128)</h2>
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">Logo MD</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Large (192x192)</h2>
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">Logo LG</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4 text-center">Hero (Responsive)</h2>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">Logo HERO</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 p-8 rounded-lg">
          <h2 className="text-white text-lg font-semibold mb-4 text-center">Dark Mode Test</h2>
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Logo Dark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}