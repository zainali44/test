'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get any parameters from the URL
  const planParam = searchParams?.get('plan') || null;
  const durationParam = searchParams?.get('duration') || null;
  
  // Auto-redirect to dashboard after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);

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
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          
          <p className="text-center text-gray-700 mb-4">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          
          {planParam && durationParam && (
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 text-center">
              <p className="text-green-800 font-medium mb-1">
                Your {planParam.charAt(0).toUpperCase() + planParam.slice(1)} Plan ({durationParam}) has been activated!
              </p>
              <p className="text-sm text-green-700">
                You now have access to all the premium features included in this plan.
              </p>
            </div>
          )}
          
          <p className="text-center text-gray-500 text-sm mb-6">
            You will be redirected to your dashboard in 5 seconds...
          </p>
          
          <div className="flex justify-center">
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 