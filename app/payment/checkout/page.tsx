export default function PaymentCheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-50 p-6">
          <h1 className="text-2xl font-bold text-center text-blue-600">
            Payment Checkout
          </h1>
        </div>
        <div className="pt-6 p-6">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <p className="text-center text-gray-700 mb-6">
            Your payment is being processed. Please do not close this window until the transaction is complete.
          </p>
          
          <div className="flex justify-center space-x-4">
            <a 
              href="/payment" 
              className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Return to Payment
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