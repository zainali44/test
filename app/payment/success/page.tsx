'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useSubscription } from '@/app/contexts/subscription-context';
import { useAuth } from '@/app/contexts/auth-context';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetSubscription, createTransaction, fetchActivePlan } = useSubscription();
  const { user } = useAuth();
  
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [hasAttemptedProcessing, setHasAttemptedProcessing] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);
  
  // Helper functions for formatting plan data - handles different API response formats
  const getPlanName = (plan: any) => {
    if (!plan) return 'Subscription';
    // Handle different response formats
    return plan.plan?.name || plan.Plan?.name || 'Subscription';
  };
  
  const getPlanDuration = (plan: any) => {
    if (!plan) return 'monthly';
    return plan.duration || plan.billing_cycle || 'monthly';
  };
  
  const getPlanDescription = (plan: any) => {
    if (!plan) return 'You now have access to all the premium features included in this plan.';
    return plan.plan?.description || 
           plan.Plan?.description || 
           'You now have access to all the premium features included in this plan.';
  };
  
  const getStartDate = (plan: any) => {
    if (!plan) return new Date();
    return plan.start_date || plan.createdAt || new Date();
  };
  
  const getNextBillingDate = (plan: any) => {
    if (!plan) return new Date();
    return plan.next_billing_date || plan.end_date || new Date();
  };
  
  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };
  
  // Get all parameters from the URL - memoized to prevent recalculation
  const paymentParams = useCallback(() => {
    if (!searchParams) return null;
    
    const params: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  }, [searchParams]);
  
  // Process payment once on component mount
  useEffect(() => {
    const params = paymentParams();
    
    // Only process if we haven't attempted yet
    if (!hasAttemptedProcessing && params && user && !processingPayment && !paymentProcessed) {
      const processPaymentData = async () => {
        try {
          // Set processing state first to prevent duplicate attempts
          setProcessingPayment(true);
          setHasAttemptedProcessing(true);
          
          // Reset subscription state to clear any stale data
          console.log("Resetting subscription state");
          resetSubscription();
          
          // Get session stored plan info if available
          let sessionPlan = null;
          let sessionDuration = null;
          
          try {
            if (typeof window !== 'undefined') {
              sessionPlan = sessionStorage.getItem('payment_plan');
              sessionDuration = sessionStorage.getItem('payment_duration');
              console.log("Retrieved plan info from sessionStorage:", { sessionPlan, sessionDuration });
            }
          } catch (e) {
            console.error("Error accessing sessionStorage:", e);
          }
          
          // Prepare payment data from URL params and session storage
          const paymentData = {
            ...params,
            email_address: params.email_address || user.email,
            // Use plan and duration from: 1) params, 2) sessionStorage, 3) default values
            plan: params.plan || sessionPlan || 'standard',
            duration: params.duration || sessionDuration || 'monthly',
            transaction_id: params.transaction_id
          };
          
          console.log("Creating transaction from payment data:", paymentData);
          
          try {
            // Map plan name to ID if not available directly
            const planMap: Record<string, number> = {
              'standard': 1,
              'basic': 2,
              'premium': 3
            };
            const planId = planMap[paymentData.plan] || 1;
            
            // Get user ID - ensure it's a number and fall back to 1 if not available
            let userId = 1; // Default fallback
            try {
              if (user && user.id) {
                // Try to parse as number, fall back to 1 if it fails
                userId = parseInt(user.id) || 1;
                console.log("Using user ID from auth:", userId);
              } else {
                console.log("No user ID available, using default ID:", userId);
              }
            } catch (err) {
              console.error("Error parsing user ID:", err);
              console.log("Using fallback user ID:", userId);
            }
            
            // Create the transaction data directly without calling payment process API
            const transactionData = {
              user_id: userId,
              plan_id: planId,
              metadata: {
                ...params,
                payment_success: true,
                plan: paymentData.plan,
                duration: paymentData.duration,
                transaction_id: paymentData.transaction_id
              }
            };
            
            console.log("Sending transaction data:", JSON.stringify(transactionData));
            
            // Create transaction first
            const transactionResult = await createTransaction(transactionData);
            console.log("Transaction creation result:", transactionResult);
            
            // Check if transaction creation was successful
            // The API actually returns the transaction data directly without a 'success' flag
            // So check if we have a transaction_id which indicates success
            const isTransactionSuccessful = transactionResult && 
              (transactionResult.success || transactionResult.transaction_id);
            
            if (isTransactionSuccessful) {
              console.log("Transaction was successful, fetching user's active plan");
              
              // Fetch active plan only once to update the subscription context
              try {
                console.log("Fetching user's active plan for user ID:", userId);
                const activePlanResult = await fetchActivePlan(userId.toString());
                
                if (activePlanResult) {
                  console.log("Active plan fetched successfully");
                  setActivePlan(activePlanResult);
                } else {
                  console.warn("No active plan found for the user");
                  
                  // Only try fallback if we're not already using ID 1
                  if (userId !== 1) {
                    console.log("Trying fallback user ID 1");
                    const fallbackResult = await fetchActivePlan('1');
                    if (fallbackResult) {
                      console.log("Active plan fetched with fallback ID");
                      setActivePlan(fallbackResult);
                    }
                  }
                }
              } catch (planError: any) {
                console.error("Error fetching active plan:", planError);
              }
              
              // Clean up session storage
              try {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('payment_plan');
                  sessionStorage.removeItem('payment_duration');
                }
              } catch (e) {
                console.error("Error cleaning up sessionStorage:", e);
              }
              
              setPaymentProcessed(true);
            } else {
              // Show specific error from transaction creation
              const errorMessage = transactionResult?.message || 
                "Failed to record your transaction. Please contact support.";
                
              console.error("Transaction creation failed:", errorMessage);
              setPaymentError(errorMessage);
            }
          } catch (transactionError: any) {
            console.error("Error creating transaction record:", transactionError);
            
            // Provide more details about the error if available
            let errorMessage = "There was an issue recording your transaction. Please contact support.";
            
            if (transactionError.message) {
              // Check for common API errors
              if (transactionError.message.includes('NetworkError') || 
                  transactionError.message.includes('Failed to fetch')) {
                errorMessage = "Network error connecting to our servers. Please check your connection and try again.";
              } else if (transactionError.message.includes('timeout')) {
                errorMessage = "The request to our server timed out. Please try again in a moment.";
              } else {
                errorMessage = transactionError.message;
              }
            }
            
            setPaymentError(errorMessage);
          }
        } catch (error: any) {
          console.error("Payment processing error:", error);
          setPaymentError(error.message || 'An error occurred while processing your transaction');
        } finally {
          setProcessingPayment(false);
        }
      };
      
      processPaymentData();
    }
  }, [
    user, 
    resetSubscription, 
    createTransaction, 
    fetchActivePlan,
    hasAttemptedProcessing, 
    paymentParams, 
    processingPayment, 
    paymentProcessed
  ]);
  
  // Function to handle redirection with a refresh of subscription data
  const handleRedirectToDashboard = () => {
    setRedirecting(true);
    
    // Simply redirect to dashboard without fetching subscription
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };
  
  // Auto-redirect to dashboard after successful payment
  useEffect(() => {
    if (paymentProcessed && !redirecting) {
      const timer = setTimeout(() => {
        handleRedirectToDashboard();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [router, paymentProcessed, redirecting]);

  const planParam = searchParams?.get('plan') || null;
  const durationParam = searchParams?.get('duration') || null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-50 p-6">
          <h1 className="text-2xl font-bold text-center text-green-600">
            Payment Successful
          </h1>
        </div>
        <div className="pt-6 p-6">
          {processingPayment ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
              <p className="text-center text-gray-700">
                Processing your payment, please wait...
              </p>
            </div>
          ) : paymentError ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
              <p className="text-center text-gray-700 mb-3">
                There was an issue activating your subscription.
              </p>
              <p className="text-center text-amber-700 text-sm mb-6 max-w-md">
                {paymentError}. Don't worry, your payment was successful. Your account will be updated soon.
              </p>
              <div className="text-center text-gray-600 text-xs mb-4">
                <p>If your subscription doesn't appear in your dashboard, please contact support with these details:</p>
                <p className="mt-1">Transaction ID: {searchParams?.get('transaction_id') || 'N/A'}</p>
                <p>Order Date: {searchParams?.get('order_date') || 'N/A'}</p>
              </div>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleRedirectToDashboard}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : redirecting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
              <p className="text-center text-gray-700">
                Preparing your dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>
              
              <p className="text-center text-gray-700 mb-4">
                Thank you for your payment. Your transaction has been completed successfully.
              </p>
              
              {activePlan ? (
                <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 text-center">
                  <p className="text-green-800 font-medium mb-1">
                    Your {getPlanName(activePlan)} Plan ({getPlanDuration(activePlan)}) has been activated!
                  </p>
                  <p className="text-sm text-green-700 mb-2">
                    {getPlanDescription(activePlan)}
                  </p>
                  <div className="text-xs text-green-600 mt-2">
                    <p>Start Date: {formatDate(getStartDate(activePlan))}</p>
                    <p>Next Billing: {formatDate(getNextBillingDate(activePlan))}</p>
                  </div>
                </div>
              ) : planParam && durationParam ? (
                <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 text-center">
                  <p className="text-green-800 font-medium mb-1">
                    Your {planParam.charAt(0).toUpperCase() + planParam.slice(1)} Plan ({durationParam}) has been activated!
                  </p>
                  <p className="text-sm text-green-700">
                    You now have access to all the premium features included in this plan.
                  </p>
                </div>
              ) : null}
              
              <p className="text-center text-gray-500 text-sm mb-6">
                You will be redirected to your dashboard in 3 seconds...
              </p>
              
              <div className="flex justify-center">
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleRedirectToDashboard}
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading payment confirmation...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 