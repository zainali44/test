'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';

// API Subscription types
export interface SubscriptionTransaction {
  transaction_id: string;
  transaction_amount: string;
  order_date: string;
  payment_name: string;
}

export interface SubscriptionPlan {
  name: string;
  price: string;
  billing_cycle: string;
  description: string;
}

export interface SubscriptionUser {
  name: string;
  email: string;
  subscription_status: string;
  subscription_plan: string;
  subscription_end_date: string;
  next_billing_date: string;
}

export interface ApiSubscription {
  subscription_id: number;
  user_id: number;
  plan_id: number;
  status: string;
  duration: string;
  start_date: string;
  end_date: string;
  next_billing_date: string;
  email_address: string;
  mobile_no: string;
  created_at: string;
  Plan: SubscriptionPlan;
  Transactions: SubscriptionTransaction[];
  User: SubscriptionUser;
}

export interface SubscriptionResponse {
  success: boolean;
  data: ApiSubscription;
}

// Union type to handle both API and local subscription formats
export type SubscriptionData = ApiSubscription | any;

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  fetchSubscription: (userId: string, forceRefresh?: boolean) => Promise<any>;
  fetchActivePlan: (userId: string) => Promise<any>;
  processPayment: (paymentData: any) => Promise<any>;
  createTransaction: (transactionData: any) => Promise<any>;
  forceSubscriptionRefresh: () => void;
  resetSubscription: () => void;
  pageRefreshCount: number;
}

// Create the context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Provider component
export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [pageRefreshCount, setPageRefreshCount] = useState<number>(0);
  const FETCH_THROTTLE_MS = 15000; // 15 seconds throttle

  // Fetch subscription data
  const fetchSubscription = async (userId: string, forceRefresh: boolean = false) => {
    // Skip if already fetching to prevent parallel calls
    if (isFetching) {
      console.debug("Already fetching subscription, skipping duplicate call");
      return;
    }

    // Skip if throttled and not forcing refresh
    const now = Date.now();
    if (!forceRefresh && lastFetchTime && now - lastFetchTime < FETCH_THROTTLE_MS) {
      console.debug(`Throttling subscription fetch (last fetch: ${new Date(lastFetchTime).toISOString()}, throttle: ${FETCH_THROTTLE_MS}ms)`);
      return;
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Fetching subscription for user ${userId}${forceRefresh ? ' (forced)' : ''}`);
      }
      
      setIsFetching(true);
      setLoading(true);
      
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const url = new URL(`/api/subscriptions/user/${userId}`, window.location.origin);
      url.searchParams.append('_t', timestamp.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });

      // Handle 404 errors gracefully - endpoint might not exist
      if (response.status === 404) {
        console.debug(`Subscription endpoint not found for user ${userId} (404 response)`);
        console.debug("Attempting to use active plan endpoint instead");
        
        // Try to fetch from active plan endpoint instead
        try {
          const activePlanResult = await fetchActivePlan(userId);
          if (activePlanResult) {
            return activePlanResult;
          }
        } catch (err) {
          console.debug("Failed to fetch from active plan endpoint as fallback");
        }
        
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch subscription');
      }

      const data = await response.json();
      console.log('Subscription data fetched successfully:', data);
      
      // Only update if we actually got data
      if (data) {
        // Check if data has a success field with data property (new API structure)
        if (data.success && data.data) {
          console.log('Setting subscription data from success.data structure:', data.data);
          setSubscription(data.data);
        } else {
          // Old structure or direct data
          setSubscription(data);
        }
        
        setError(null);
        setLastFetchTime(now);
        
        // Increment the refresh counter to notify components
        setPageRefreshCount(prev => prev + 1);
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError(err.message || 'Failed to fetch subscription');
      return null;
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  // Fetch active plan directly from the API
  const fetchActivePlan = async (userId: string | number) => {
    // Ensure userId is a string
    const userIdStr = userId?.toString();
    
    if (!userIdStr) {
      console.error('User ID is required to fetch active plan');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Fetching active plan for user ${userIdStr}`);
      }
      
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const url = new URL(`/api/subscriptions/active-plan/${userIdStr}`, window.location.origin);
      url.searchParams.append('_t', timestamp.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });

      // Handle 404 gracefully - user might not have a subscription yet
      if (response.status === 404) {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`No active subscription found for user ${userIdStr} (404 response)`);
        }
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch active plan');
      }

      const result = await response.json();
      
      if (process.env.NODE_ENV === 'development') {
        console.debug('Active plan data fetched successfully');
      }
      
      // Update subscription state with the active plan data
      if (result.success && result.data) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Setting subscription data from active plan');
        }
        
        setSubscription(result.data);
        setError(null);
        setLastFetchTime(Date.now());
        setPageRefreshCount(prev => prev + 1);
        return result.data;
      }
      
      return null;
    } catch (err: any) {
      console.error('Error fetching active plan:', err);
      setError(err.message || 'Failed to fetch active plan');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Process payment data
  const processPayment = async (paymentData: any) => {
    // Validate payment data to prevent unnecessary API calls
    if (!paymentData || !paymentData.plan || !paymentData.transaction_id) {
      console.log('We are missing payment data', paymentData , paymentData.plan , paymentData.transaction_id);
      return { 
        success: false, 
        message: 'Invalid payment data. Missing required fields.' 
      };
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/subscriptions/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      // Parse the response data - handle potential JSON parsing errors
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response from payment server');
      }

      if (!response.ok) {
        throw new Error(data?.message || `Payment failed with status: ${response.status}`);
      }
      
      // If successful and we have new subscription data, update the state
      if (data?.success && data?.data) {
        // Make sure we store the actual subscription data, not the wrapper
        setSubscription(data.data);
        // Update last fetch time to prevent immediate re-fetch
        setLastFetchTime(Date.now());
        // Also trigger the page refresh counter
        setPageRefreshCount(prev => prev + 1);
      }
      
      return data || { success: false, message: 'No data returned from payment server' };
    } catch (error: any) {
      console.error('Payment processing error:', error);
      setError(error.message || 'An error occurred while processing payment');
      return { 
        success: false, 
        message: error.message || 'An error occurred while processing payment' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Create transaction data
  const createTransaction = async (transactionData: any) => {
    // Validate transaction data
    if (!transactionData || !transactionData.user_id || !transactionData.plan_id) {
      console.error('Missing required transaction data', transactionData);
      return { 
        success: false, 
        message: 'Invalid transaction data. Missing required fields.' 
      };
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      // Check the status code first
      if (response.status === 404) {
        console.error('Transaction API endpoint not found (404)');
        return {
          success: false,
          message: 'The transaction service is currently unavailable. Your payment was successful, but transaction recording failed.'
        };
      }

      // Parse the response data with error handling
      let data;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If not JSON, attempt to get text
          try {
            const textResponse = await response.text();
            console.error('Non-JSON response from transaction API:', 
              textResponse.substring(0, 200) + (textResponse.length > 200 ? '...' : ''));
            
            return {
              success: false,
              message: 'Server returned an invalid response format.',
              debug: {
                status: response.status,
                contentType,
                responsePreview: textResponse.substring(0, 100) + '...'
              }
            };
          } catch (textError) {
            console.error('Failed to read response text:', textError);
            throw new Error('Invalid response format from transaction server');
          }
        }
      } catch (e) {
        console.error('Error parsing transaction response:', e);
        throw new Error('Invalid response from transaction server');
      }

      if (!response.ok) {
        console.error('Transaction API error status:', response.status, data);
        throw new Error(data?.message || `Transaction creation failed with status: ${response.status}`);
      }
      
      console.log('Transaction created successfully:', data);
      
      // If the API returns the transaction data directly (not wrapped with success flag)
      // Transform it to include a success flag for consistent interface
      if (data && !data.hasOwnProperty('success') && data.transaction_id) {
        return {
          success: true,
          data: data
        };
      }
      
      return data || { success: false, message: 'No data returned from transaction server' };
    } catch (error: any) {
      console.error('Transaction creation error:', error);
      setError(error.message || 'An error occurred while creating transaction');
      return { 
        success: false, 
        message: error.message || 'An error occurred while creating transaction' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Force subscription refresh
  const forceSubscriptionRefresh = () => {
    if (user?.id) {
      console.log("Manually forcing subscription refresh");
      fetchSubscription(user.id, true);
    }
  };

  // Reset subscription state
  const resetSubscription = () => {
    console.log("Resetting subscription state");
    setSubscription(null);
    setLoading(false);
    setError(null);
    setLastFetchTime(0);
    setIsFetching(false);
    setPageRefreshCount(prev => prev + 1);
  };

  // Initial fetch when user changes - completely disabled
  useEffect(() => {
    // Intentionally empty to prevent automatic fetching
    // If subscription data is needed, components should explicitly call fetchActivePlan
  }, []);

  const value = {
    subscription,
    loading,
    error,
    fetchSubscription,
    fetchActivePlan,
    processPayment,
    createTransaction,
    forceSubscriptionRefresh,
    resetSubscription,
    pageRefreshCount
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Hook for using the subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 