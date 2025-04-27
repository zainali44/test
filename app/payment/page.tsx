'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, ArrowRight, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';

export default function PaymentPage() {
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
      
      if (!token) {
        alert('Unable to get authorization token. Please try again.');
        setIsLoading(false);
        return;
      }
      
      console.log('New token received, updating form and submitting...');
      
      // Update state with token and mobile number
      setFormData(prev => ({ 
        ...prev, 
        TOKEN: token,
        CUSTOMER_MOBILE_NO: mobileNumber 
      }));
      
      // Create form and submit
      const form = document.createElement('form');
      form.method = 'post';
      form.action = 'https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
      form.style.display = 'none';
      
      // Add all form fields
      Object.entries({
        ...formData,
        TOKEN: token,
        CUSTOMER_MOBILE_NO: mobileNumber
      }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      });
      
      // Add hidden values
      const hiddenValues = {
        'MERCHANT_USERAGENT': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        'ITEMS[0][SKU]': 'SAMPLE-SKU-01',
        'ITEMS[0][NAME]': 'An Awesome Dress',
        'ITEMS[0][PRICE]': '150',
        'ITEMS[0][QTY]': '2',
        'ITEMS[1][SKU]': 'SAMPLE-SKU-02',
        'ITEMS[1][NAME]': 'Ice Cream',
        'ITEMS[1][PRICE]': '45',
        'ITEMS[1][QTY]': '5'
      };
      
      Object.entries(hiddenValues).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
      
    } catch (error: any) {
      console.error('Error during form submission:', error);
      alert(`Error submitting form: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Extract plan name and period for display
  const planName = descriptionParam ? descriptionParam.split(' - ')[0] : '';
  const planPeriod = durationParam === 'yearly' ? 'Annual' : 'Monthly';
  
  // Get icon based on plan type
  const getPlanIcon = () => {
    if (planParam === 'premium') return 'premium';
    if (planParam === 'basic') return 'basic';
    return 'individual';
  };
  
  const planIcon = getPlanIcon();

  // Show loading state while auth is being checked
  if (pageLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Complete Your Payment
        </h2>
        
        {debugInfo.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error:</p>
            <p>{debugInfo.error}</p>
          </div>
        )}
        
        <Card className="overflow-hidden border border-gray-200 shadow-md">
          <CardHeader className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800">Secure Checkout</CardTitle>
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* User Info */}
            {user && (
              <div className="mb-5 pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-500">Logged in as: <span className="font-medium text-gray-800">{user.email}</span></p>
              </div>
            )}
          
            {/* Plan Info Card */}
            <div className="bg-white border border-gray-200 rounded-md p-5 mb-6">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 
                  ${planIcon === 'premium' 
                    ? 'bg-gray-100' 
                    : planIcon === 'basic'
                      ? 'bg-gray-100'
                      : 'bg-gray-100'
                  }`}>
                  <Shield className="h-6 w-6 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{planName}</h3>
                  <p className="text-sm text-gray-500">{planPeriod} Subscription</p>
                  
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-gray-800">PKR {amountParam}</div>
                    {durationParam === 'yearly' && (
                      <span className="text-xs text-gray-600">
                        Annual billing - save with yearly plan
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Number Input */}
            <div className="mb-6">
              <Label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </Label>
              <div className="mt-1">
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  placeholder="03XXXXXXXXX"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    if (mobileError) setMobileError('');
                  }}
                  className={`block w-full rounded-md ${mobileError ? 'border-red-300' : 'border-gray-300'}`}
                />
              </div>
              {mobileError && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {mobileError}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your mobile number is required for payment verification
              </p>
            </div>
            
            {/* Payment Steps */}
            <div className="mt-8 mb-6">
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <div className="mx-4 text-sm text-gray-500">PAYMENT SUMMARY</div>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{planName} ({planPeriod})</span>
                  <span className="font-medium text-gray-800">PKR {amountParam}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-medium text-gray-700">Total Payment</span>
                  <span className="font-bold text-gray-900">PKR {amountParam}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Button */}
            <div className="mt-8">
              <Button 
                onClick={handlePaymentSubmit}
                disabled={isLoading || !formData.TOKEN}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-5 rounded-md flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Complete Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By clicking "Complete Payment", you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
              
              <div className="flex items-center justify-center mt-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/dashboard/upgrade')}
                  className="text-xs text-gray-700 border-gray-300"
                >
                  Return to Plans
                </Button>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center text-gray-500 text-xs">
              <Lock className="h-3 w-3 mr-1" />
              <span>All payments are secure and encrypted</span>
            </div>
            
            {/* Hidden Form */}
            <div style={{ display: 'none' }}>
              <form
                id="PayFast_payment_form"
                name="PayFast-payment-form"
                method="post"
                action="https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction"
              >
                {Object.entries(formData).map(([key, value]) => (
                  <input
                    key={key}
                    type="hidden"
                    id={key}
                    name={key}
                    value={value?.toString() || ''}
                    readOnly
                  />
                ))}
                
                {/* Hidden Values */}
                <input type="hidden" name="MERCHANT_USERAGENT" value="Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0" />
                <input type="hidden" name="ITEMS[0][SKU]" value="SAMPLE-SKU-01" />
                <input type="hidden" name="ITEMS[0][NAME]" value="An Awesome Dress" />
                <input type="hidden" name="ITEMS[0][PRICE]" value="150" />
                <input type="hidden" name="ITEMS[0][QTY]" value="2" />
                <input type="hidden" name="ITEMS[1][SKU]" value="SAMPLE-SKU-02" />
                <input type="hidden" name="ITEMS[1][NAME]" value="Ice Cream" />
                <input type="hidden" name="ITEMS[1][PRICE]" value="45" />
                <input type="hidden" name="ITEMS[1][QTY]" value="5" />
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 