'use client'

export default function TestEmail() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold">Email Link Test</h1>
      
      <div className="flex flex-col gap-4">
        {/* Test 1: Basic email link */}
        <a 
          href="mailto:cuisine@chunnthai.com.au" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Test 1: Basic Email Link
        </a>
        
        {/* Test 2: Email link with subject */}
        <a 
          href="mailto:cuisine@chunnthai.com.au?subject=Restaurant%20Inquiry" 
          className="text-green-600 hover:text-green-800 underline"
        >
          Test 2: Email with Subject
        </a>
        
        {/* Test 3: Button style email link */}
        <a 
          href="mailto:cuisine@chunnthai.com.au" 
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 inline-block"
        >
          Test 3: Button Style Email
        </a>
        
        {/* Test 4: Icon email link (same as homepage) */}
        <a 
          href="mailto:cuisine@chunnthai.com.au" 
          className="text-amber-600 hover:text-amber-700"
          aria-label="Email"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </a>
        
        {/* Test 5: Different email protocols */}
        <a 
          href="mailto:cuisine@chunnthai.com.au?subject=Reservation&body=I%20would%20like%20to%20make%20a%20reservation"
          className="text-purple-600 hover:text-purple-800 underline"
        >
          Test 5: Email with Subject and Body
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          Click any link above to test email functionality.
          <br />
          Email: cuisine@chunnthai.com.au
        </p>
      </div>
    </div>
  )
}