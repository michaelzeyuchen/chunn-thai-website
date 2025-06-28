import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-amber-400/20 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  )
}