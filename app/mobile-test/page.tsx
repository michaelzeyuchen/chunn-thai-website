export default function MobileTest() {
  return (
    <div className="min-h-screen bg-orange-50 p-4">
      <h1 className="text-2xl font-bold text-orange-800 mb-4">
        Mobile Test Page
      </h1>
      <div className="space-y-2 text-gray-700">
        <p>If you can see this, the site is loading.</p>
        <p>JavaScript Status: <span className="text-green-600">Working</span></p>
        <p>User Agent: <span className="text-xs">{typeof window !== 'undefined' ? navigator.userAgent : 'Server'}</span></p>
      </div>
      <div className="mt-4">
        <a href="/" className="text-blue-600 underline">Go to Homepage</a>
      </div>
    </div>
  );
}