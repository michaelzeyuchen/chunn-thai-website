'use client';

import { useEffect, useState } from 'react';

export default function Diagnostic() {
  const [info, setInfo] = useState({
    mounted: false,
    localStorage: false,
    windowDefined: false,
    errors: [] as string[],
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    try {
      setInfo({
        mounted: true,
        localStorage: typeof localStorage !== 'undefined',
        windowDefined: typeof window !== 'undefined',
        errors: [],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setInfo(prev => ({
        ...prev,
        errors: [...prev.errors, String(error)],
      }));
    }
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Diagnostic Page</h1>
      <pre className="bg-white p-4 rounded shadow">
        {JSON.stringify(info, null, 2)}
      </pre>
      <div className="mt-4">
        <p>If you see this page, the Next.js app is working.</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}