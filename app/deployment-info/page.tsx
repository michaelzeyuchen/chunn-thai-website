'use client';

import { useState, useEffect } from 'react';

export default function DeploymentInfo() {
  const [buildId, setBuildId] = useState('');
  const [buildTime, setBuildTime] = useState('');
  
  useEffect(() => {
    // Get build info
    fetch('/_next/BUILD_ID')
      .then(res => res.text())
      .then(id => setBuildId(id))
      .catch(() => setBuildId('Unable to fetch'));
      
    setBuildTime(new Date().toISOString());
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Deployment Info</h1>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Build ID:</strong> {buildId || 'Loading...'}</p>
        <p><strong>Page Generated:</strong> {buildTime}</p>
        <p><strong>Process CWD:</strong> {process.cwd()}</p>
        <p><strong>Node Version:</strong> {process.version}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Expected Build ID:</strong> v1oiam7MFmlw2T6Dyt0d3</p>
        <p><strong>Logo Implementation:</strong> SVG Path Elements (Mobile Fix)</p>
      </div>
    </div>
  );
}