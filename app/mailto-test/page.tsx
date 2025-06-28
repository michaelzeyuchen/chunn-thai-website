'use client'

import { useState } from 'react'

export default function MailtoTest() {
  const [clicks, setClicks] = useState<string[]>([])

  const logClick = (method: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setClicks(prev => [...prev, `${timestamp} - ${method}`])
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold">Mailto Link Debug Test</h1>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        {/* Test 1: Simplest possible mailto */}
        <a 
          href="mailto:cuisine@chunnthai.com.au"
          className="text-blue-600 underline"
          onClick={() => logClick('Simple mailto clicked')}
        >
          Test 1: Simple mailto link
        </a>

        {/* Test 2: Button with mailto */}
        <a 
          href="mailto:cuisine@chunnthai.com.au"
          className="px-4 py-2 bg-blue-600 text-white rounded inline-block text-center"
          onClick={() => logClick('Button mailto clicked')}
        >
          Test 2: Button mailto
        </a>

        {/* Test 3: JavaScript window.location */}
        <button
          onClick={() => {
            logClick('JavaScript window.location')
            window.location.href = 'mailto:cuisine@chunnthai.com.au'
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Test 3: JS window.location
        </button>

        {/* Test 4: JavaScript window.open */}
        <button
          onClick={() => {
            logClick('JavaScript window.open')
            window.open('mailto:cuisine@chunnthai.com.au', '_self')
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Test 4: JS window.open
        </button>

        {/* Test 5: Create and click link dynamically */}
        <button
          onClick={() => {
            logClick('Dynamic link creation')
            const link = document.createElement('a')
            link.href = 'mailto:cuisine@chunnthai.com.au'
            link.click()
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded"
        >
          Test 5: Dynamic link
        </button>

        {/* Test 6: Different email */}
        <a 
          href="mailto:test@example.com"
          className="text-red-600 underline"
          onClick={() => logClick('Different email clicked')}
        >
          Test 6: Different email (test@example.com)
        </a>

        {/* Test 7: Email with subject */}
        <a 
          href="mailto:cuisine@chunnthai.com.au?subject=Test%20Subject"
          className="text-green-600 underline"
          onClick={() => logClick('Email with subject clicked')}
        >
          Test 7: Email with subject
        </a>
      </div>

      {/* Click log */}
      <div className="mt-8 p-4 bg-gray-100 rounded w-full max-w-md">
        <h2 className="font-bold mb-2">Click Log:</h2>
        {clicks.length === 0 ? (
          <p className="text-gray-500">No clicks yet</p>
        ) : (
          <ul className="text-sm">
            {clicks.map((click, i) => (
              <li key={i}>{click}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 p-4 bg-yellow-100 rounded w-full max-w-md">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <p className="text-sm">User Agent: {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
        <p className="text-sm">Protocol Handlers: {typeof window !== 'undefined' && 'registerProtocolHandler' in navigator ? 'Supported' : 'Not supported'}</p>
      </div>
    </div>
  )
}