export default function MobileFallback() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold text-orange-800 mb-4">
        Chunn Thai Cuisine
      </h1>
      <p className="text-gray-700 mb-6">
        Opening August 1st, 2025
      </p>
      <div className="space-y-4 text-gray-600">
        <p>📍 Shop 21, HomeCo Menai Marketplace</p>
        <p>152-194 Allison Crescent, Menai NSW 2234</p>
        <p>📞 0432 506 436</p>
        <p>✉️ cuisine@chunnthai.com.au</p>
      </div>
      <div className="mt-8">
        <a 
          href="tel:0432506436" 
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium"
        >
          Call Us
        </a>
      </div>
    </div>
  );
}