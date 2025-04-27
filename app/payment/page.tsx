'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, ArrowRight, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading, checkAuth } = useAuth();
  
  // console.log("User:", user);
   
  // Check if we're in a post-redirect situation by looking at the URL
  const isPostRedirect = typeof window !== 'undefined' && window.location.href.includes('PostTransaction');

  // Get parameters from the URL if any
  const planParam = searchParams?.get('plan') || null;
  const durationParam = searchParams?.get('duration') || null;
  const amountParam = searchParams?.get('amount') || null;
  const descriptionParam = searchParams?.get('description') || null;

  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    MERCHANT_ID: '26623',
    SECURED_KEY: '_kqbD5giY0EgPsq_R4JUgg',
    BASKET_ID: 'ITEM-OOFX',
    // TXNAMT: amountParam || '5',
    TXNAMT: '5',
    CURRENCY_CODE: 'PKR',
    MERCHANT_NAME: 'Payfast Merchant',
    TOKEN: '',
    ORDER_DATE: '2025-04-24 10:00:00',
    SUCCESS_URL: 'http://localhost:3000/payment/success',
    FAILURE_URL: 'http://localhost:3000/payment/failure',
    CHECKOUT_URL: 'http://localhost:3000/payment/checkout',
    CUSTOMER_EMAIL_ADDRESS: '',
    CUSTOMER_MOBILE_NO: '',
    SIGNATURE: 'SOMERANDOM-STRING',
    VERSION: 'MERCHANTCART-0.1',
    TXNDESC: descriptionParam || 'Item Purchased from Cart',
    PROCCODE: '00',
    TRAN_TYPE: 'ECOMM_PURCHASE',
    STORE_ID: '',
    RECURRING_TXN: '',
  });

  const [debugInfo, setDebugInfo] = useState({
    tokenResponse: null,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Add a ref to track if token request has been made
  const tokenRequestMade = useRef(false);

  // Update formData when user is available
  useEffect(() => {
    // Enforce auth check to ensure we have the latest user data
    const refreshAuth = async () => {
      if (!user) {
        await checkAuth();
      }
      
      setPageLoading(false);
    };
    
    refreshAuth();
  }, [user, checkAuth]);
  
  // Update email in form when user changes
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        CUSTOMER_EMAIL_ADDRESS: user.email
      }));
    }
  }, [user]);

  // Generate random string for basket ID
  const generateRandomString = (length = 4) => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Get access token
  const getAccessToken = async () => {
    try {
      // Log the request data
      console.log('Requesting token with:', {
        MERCHANT_ID: formData.MERCHANT_ID,
        SECURED_KEY: formData.SECURED_KEY,
        BASKET_ID: formData.BASKET_ID,
        // TXNAMT: formData.TXNAMT,
        TXNAMT: '5',
        CURRENCY_CODE: formData.CURRENCY_CODE
      });

      const response = await fetch('/api/payment/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MERCHANT_ID: formData.MERCHANT_ID,
          SECURED_KEY: formData.SECURED_KEY,
          BASKET_ID: formData.BASKET_ID,
          // TXNAMT: formData.TXNAMT,
          TXNAMT: '5',  
          CURRENCY_CODE: formData.CURRENCY_CODE
        }),
      });

      const data = await response.json();
      console.log('Token response:', data);
      
      // Store debug info
      setDebugInfo(prev => ({
        ...prev,
        tokenResponse: data
      }));

      return data.accessToken || '';
    } catch (error: any) {
      console.error('Error getting access token:', error);
      setDebugInfo(prev => ({
        ...prev,
        error: error.message
      }));
      return '';
    }
  };

  // Generate current date in the exact format expected by PayFast
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    // If still loading auth or if we're in a redirect, skip token request
    if (authLoading || isPostRedirect) {
      console.log('Auth still loading or redirect in progress, skipping token request');
      return;
    }

    // Skip if the token request has already been made
    if (tokenRequestMade.current) {
      console.log('Token request already made, skipping duplicate request');
      return;
    }

    // Generate basketId and set current date on component mount
    const newBasketId = 'ITEM-' + generateRandomString(4);
    const currentDate = getCurrentDate();

    // Build success and failure URLs with plan parameters
    let successUrl = 'http://localhost:3000/payment/success';
    let failureUrl = 'http://localhost:3000/payment/failure';
    
    // Add plan parameters to the URLs if they exist
    if (planParam && durationParam) {
      const planParams = new URLSearchParams({
        plan: planParam,
        duration: durationParam
      }).toString();
      
      successUrl = `${successUrl}?${planParams}`;
      failureUrl = `${failureUrl}?${planParams}`;
    }

    setFormData((prev) => ({
      ...prev,
      BASKET_ID: newBasketId,
      ORDER_DATE: currentDate,
      // Update amount from URL params if available
      // TXNAMT: amountParam || prev.TXNAMT,
      TXNAMT: '5',
      // Update description from URL params if available
      TXNDESC: descriptionParam || prev.TXNDESC,
      // Update success and failure URLs with plan parameters
      SUCCESS_URL: successUrl,
      FAILURE_URL: failureUrl,
      // Update with user email from auth context if available
      CUSTOMER_EMAIL_ADDRESS: user?.email || prev.CUSTOMER_EMAIL_ADDRESS
    }));

    // Get token when basketId is updated
    const fetchToken = async () => {
      if (newBasketId) {
        // Mark that token request has been made
        tokenRequestMade.current = true;
        const token = await getAccessToken();
        console.log('Retrieved token:', token);
        setFormData((prev) => ({ ...prev, TOKEN: token }));
      }
    };

    fetchToken();
  }, [isPostRedirect, amountParam, descriptionParam, planParam, durationParam, user, authLoading]);

  const validateMobileNumber = (number: string) => {
    // Basic mobile number validation for Pakistan
    const phoneRegex = /^(03\d{9})$/;
    return phoneRegex.test(number);
  };

  // Submit form handler
  const handlePaymentSubmit = async () => {
    // Validate mobile number
    if (!mobileNumber) {
      setMobileError('Mobile number is required');
      return;
    }
    
    if (!validateMobileNumber(mobileNumber)) {
      setMobileError('Please enter a valid Pakistani mobile number (format: 03XXXXXXXXX)');
      return;
    }
    
    setMobileError('');
    setIsLoading(true);
    
    try {
      console.log('Form submission started, refreshing token...');
      
      // Before form submission, refresh the token one more time
      const token = await getAccessToken();
      
      // Update form data with the latest token and mobile number
      const updatedFormData = {
        ...formData,
        TOKEN: token || formData.TOKEN,
        CUSTOMER_MOBILE_NO: mobileNumber
      };
      
      console.log('Submitting payment form with data:', updatedFormData);
      
      // Create a form element
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
      
      // Create hidden inputs for each form field
      Object.entries(updatedFormData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      
      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error('Payment submission error:', error);
      setIsLoading(false);
    }
  };
  
  // Define the current plan based on URL params
  const getPlanDetails = () => {
    if (!planParam) return null;
    
    const plans: Record<string, { title: string, features: string[], price: string }> = {
      basic: {
        title: 'Basic Plan',
        features: ['100 Posts per month', 'Basic analytics', 'Email support'],
        price: '₨500'
      },
      pro: {
        title: 'Pro Plan',
        features: ['Unlimited Posts', 'Advanced analytics', 'Priority support', 'Custom branding'],
        price: '₨1,000'
      },
      enterprise: {
        title: 'Enterprise Plan',
        features: ['All Pro features', 'Dedicated account manager', 'API access', '24/7 phone support'],
        price: '₨5,000'
      }
    };
    
    return plans[planParam] || null;
  };
  
  const getPlanPrice = () => {
    const planDetails = getPlanDetails();
    if (!planDetails) return 'Rs.500';
    return planDetails.price;
  };
  
  const getPlanIcon = () => {
    switch (planParam) {
      case 'basic':
        return <Shield className="h-6 w-6 text-blue-500" />;
      case 'pro':
        return <CreditCard className="h-6 w-6 text-purple-500" />;
      case 'enterprise':
        return <Lock className="h-6 w-6 text-emerald-500" />;
      default:
        return <CreditCard className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Payment Form */}
        <Card className="shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Secure Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {planParam && (
              <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-3 mb-2">
                  {getPlanIcon()}
                  <h3 className="font-semibold text-gray-900">
                    {getPlanDetails()?.title || 'Selected Plan'}
                    {durationParam && <span className="text-gray-600 font-normal ml-1">({durationParam})</span>}
                  </h3>
                </div>
                
                <ul className="ml-8 mb-3 list-disc text-gray-700 text-sm space-y-1">
                  {getPlanDetails()?.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-blue-100">
                  <span className="text-gray-600 text-sm">Total Amount:</span>
                  <span className="font-semibold text-blue-800">{getPlanPrice()}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="text"
                  placeholder="03XXXXXXXXX"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setMobileError('');
                  }}
                  className={mobileError ? 'border-red-500' : ''}
                />
                {mobileError && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {mobileError}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Enter your mobile number for payment verification.
                </p>
              </div>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handlePaymentSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Payment'}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              
              <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                <Lock className="h-3 w-3 mr-1" />
                Your payment information is secure and encrypted
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Link href="/pricing" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Plans
          </Link>
        </div>
        
        {/* Debugging section - hidden in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Debug Info</h3>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify({
                formData,
                debugInfo,
                planParam,
                durationParam,
                amountParam
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading payment form...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
} 