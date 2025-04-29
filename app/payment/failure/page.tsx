'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="w-full max-w-3xl mx-auto bg-white overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-red-600">
            Payment Failed
          </h1>
        </div>
        <div className="pt-6 p-6">
          <div className="flex justify-center mb-6">
            <XCircle className="h-20 w-20 text-red-500" />
          </div>
          
          <p className="text-center text-gray-700 mb-6">
            We're sorry, but your payment transaction could not be completed. Please try again or contact support.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline"
              onClick={() => router.back()}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/upgrade')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Return to Plans
            </Button>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <p className="text-center text-sm text-gray-500 mb-4">
              If you continue to experience issues with your payment, please contact our support team.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="link" 
                className="text-emerald-600 hover:text-emerald-800"
                onClick={() => router.push('/support')}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 