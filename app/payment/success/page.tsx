export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-50 p-6">
          <h1 className="text-2xl font-bold text-center text-green-600">
            Payment Successful
          </h1>
        </div>
        <div className="pt-6 p-6">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <p className="text-center text-gray-700 mb-6">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          
          <div className="flex justify-center">
            <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 