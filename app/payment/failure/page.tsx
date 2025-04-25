export default function PaymentFailurePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-50 p-6">
          <h1 className="text-2xl font-bold text-center text-red-600">
            Payment Failed
          </h1>
        </div>
        <div className="pt-6 p-6">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          
          <p className="text-center text-gray-700 mb-6">
            We're sorry, but your payment transaction could not be completed. Please try again or contact support.
          </p>
          
          <div className="flex justify-center space-x-4">
            <a 
              href="/payment" 
              className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Try Again
            </a>
            <a 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 