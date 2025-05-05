'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { toast } from 'react-hot-toast';

// Define plan types based on the provided plan data
export interface PlanData {
  plan_id: number;
  name: string;
  description: string;
  price: string;
  billing_cycle: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Subscription types
export interface SubscriptionTransaction {
  transaction_id: string;
  transaction_amount: string;
  order_date: string;
  payment_name: string;
}

export interface SubscriptionUser {
  name: string;
  email: string;
  subscription_status: string;
  subscription_plan?: string;
  subscription_end_date?: string;
  next_billing_date?: string;
}

export interface ApiSubscription {
  subscription_id: number;
  user_id: number;
  plan_id: number;
  status: string;
  start_date: string;
  end_date: string;
  next_billing_date: string;
  createdAt?: string;
  updatedAt?: string;
  plan?: PlanData;
  Transactions?: SubscriptionTransaction[];
  User?: SubscriptionUser;
}

export interface SubscriptionResponse {
  success: boolean;
  data: ApiSubscription;
}

// Define all available plans based on the provided data
const AVAILABLE_PLANS: PlanData[] = [
  {
    plan_id: 1,
    name: "Free",
    description: "Free",
    price: "0.00",
    billing_cycle: "monthly"
  },
  {
    plan_id: 2,
    name: "Individual",
    description: "Individual",
    price: "500.00",
    billing_cycle: "monthly"
  },
  {
    plan_id: 3,
    name: "Basic",
    description: "Basic",
    price: "800.00",
    billing_cycle: "monthly"
  },
  {
    plan_id: 4,
    name: "Premium",
    description: "Premium",
    price: "2000.00",
    billing_cycle: "monthly"
  },
  {
    plan_id: 5,
    name: "Individual",
    description: "Individual",
    price: "4800.00",
    billing_cycle: "yearly"
  },
  {
    plan_id: 6,
    name: "Basic",
    description: "Basic",
    price: "7200.00",
    billing_cycle: "yearly"
  },
  {
    plan_id: 7,
    name: "Premium",
    description: "Premium",
    price: "21600.00",
    billing_cycle: "yearly"
  }
];

// This function gets the correct plan details based on the plan_id
const getPlanById = (planId: number): PlanData => {
  const plan = AVAILABLE_PLANS.find(plan => plan.plan_id === planId);
  return plan || AVAILABLE_PLANS[0]; // Default to Free plan if not found
};

// Union type to handle both API and local subscription formats
export type SubscriptionData = ApiSubscription | any;

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  fetchSubscription: (userId: string, forceRefresh?: boolean) => Promise<any>;
  fetchActivePlan: (userId: string) => Promise<any>;
  getPlanDetails: () => {
    name: string;
    type: string;
    cycle: string;
    planId: number;
  };
  isActivePlan: (planId: number) => boolean;
  refreshSubscription: () => Promise<void>;
  resetSubscription: () => void;
  createTransaction?: (transactionData: any) => Promise<any>;
}

// Create the context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Provider component
export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  
  // Throttle time for API calls (10 seconds)
  const FETCH_THROTTLE_MS = 10000;

  // Initialize subscription when user changes
  useEffect(() => {
    if (user?.id) {
      fetchSubscription(user.id.toString());
    }
  }, [user?.id]);

  // Get the user's active plan
  const fetchActivePlan = async (userId: string) => {
    if (!token) {
      console.error("No auth token available for subscription fetch");
      return null;
    }

    try {
      const activePlanUrl = `/api/subscriptions/active-plan/${userId}`;
      const response = await fetch(activePlanUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status !== 404) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch active plan");
        }
        return null;
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Process the plan data
        processSubscriptionResponse(data);
        return data.data;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching active plan:", error);
      return null;
    }
  };

  // Process the subscription response
  const processSubscriptionResponse = (response: any) => {
    if (!response || !response.data) return;
    
    try {
      const subscriptionData = response.data;
      
      // Better logging of the response data
      console.log("Processing subscription response:", JSON.stringify(subscriptionData, null, 2));
      
      // Extract plan_id from the response
      let planId = 1; // Default to Free plan
      
      if (subscriptionData.plan_id !== undefined) {
        planId = Number(subscriptionData.plan_id);
        console.log("Found plan_id directly:", planId);
      } else if (subscriptionData.plan && subscriptionData.plan.plan_id !== undefined) {
        planId = Number(subscriptionData.plan.plan_id);
        console.log("Found plan_id in plan object:", planId);
      } else if (subscriptionData.data && subscriptionData.data.plan_id !== undefined) {
        planId = Number(subscriptionData.data.plan_id);
        console.log("Found plan_id in nested data:", planId);
      } else if (subscriptionData.subscription_id && subscriptionData.user_id) {
        // This is a subscription record from the database
        // Check if it has a plan_id property
        if ('plan_id' in subscriptionData) {
          planId = Number(subscriptionData.plan_id);
          console.log("Found plan_id in subscription record:", planId);
        }
      }
      
      // Get complete plan details from our predefined plans
      const planDetails = getPlanById(planId);
      console.log("Using plan details:", planDetails);
      
      // Ensure the subscription has a plan object with full details
      const processedSubscription = {
        ...subscriptionData,
        plan_id: planId,
        plan: planDetails
      };
      
      // Update the state with processed subscription
      setSubscription(processedSubscription);
      setError(null);
      
      return processedSubscription;
    } catch (err) {
      console.error("Error processing subscription response:", err);
      setError("Failed to process subscription data");
    }
  };

  // Fetch subscription data with throttling
  const fetchSubscription = async (userId: string, forceRefresh: boolean = false) => {
    // Skip if already fetching
    if (isFetching) {
      return subscription;
    }
    
    // Skip if within throttle time unless forced
    const now = Date.now();
    if (!forceRefresh && lastFetchTime && now - lastFetchTime < FETCH_THROTTLE_MS) {
      return subscription;
    }
    
    try {
      setIsFetching(true);
      setLoading(true);
      
      // First try to get the active plan
      const activePlan = await fetchActivePlan(userId);
      
      if (activePlan) {
        // Already processed in fetchActivePlan
        setLastFetchTime(Date.now());
        return subscription;
      }
      
      // Fallback to generic subscription endpoint
      const response = await fetch(`/api/subscriptions/user/${userId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // If no subscription found, set to Free plan
          const freePlan = {
            plan_id: 1,
            status: 'active',
            plan: getPlanById(1)
          };
          setSubscription(freePlan);
          return freePlan;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch subscription');
      }
      
      const data = await response.json();
      processSubscriptionResponse(data);
      
      setLastFetchTime(Date.now());
      return subscription;
    } catch (err: any) {
      console.error("Subscription fetch error:", err);
      setError(err.message || "Failed to fetch subscription data");
      
      // Set to Free plan on error
      const freePlan = {
        plan_id: 1,
        status: 'active',
        plan: getPlanById(1)
      };
      setSubscription(freePlan);
      return freePlan;
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  // Force refresh the subscription data
  const refreshSubscription = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      await fetchSubscription(user.id.toString(), true);
      toast.success("Subscription refreshed");
    } catch (err) {
      console.error("Failed to refresh subscription:", err);
      toast.error("Failed to refresh subscription");
    } finally {
      setLoading(false);
    }
  };

  // Get formatted plan details for UI display
  const getPlanDetails = () => {
    if (!subscription) {
      console.log("No subscription data available, returning Free plan");
      return {
        name: 'Free Plan',
        type: 'Free',
        cycle: 'monthly',
        planId: 1
      };
    }
    
    // Log the full subscription object for debugging
    console.log("Subscription data for getPlanDetails:", JSON.stringify(subscription, null, 2));
    
    // Get plan ID from subscription object
    let planId = 1;
    
    if (subscription.plan_id !== undefined) {
      planId = Number(subscription.plan_id);
      console.log("Using plan_id directly from subscription:", planId);
    } else if (subscription.plan && subscription.plan.plan_id !== undefined) {
      planId = Number(subscription.plan.plan_id);
      console.log("Using plan_id from subscription.plan:", planId);
    } else if ((subscription as any).data && (subscription as any).data.plan_id !== undefined) {
      planId = Number((subscription as any).data.plan_id);
      console.log("Using plan_id from subscription.data:", planId);
    }
    
    // Special case for Premium yearly plan (plan_id = 7)
    if (planId === 7) {
      console.log("Detected Premium yearly plan (ID 7), returning Premium plan details");
      return {
        name: 'Premium Plan (Yearly)',
        type: 'Premium',
        cycle: 'yearly',
        planId: 7
      };
    }
    
    // Get full plan details
    const plan = getPlanById(planId);
    console.log("Plan details from getPlanById:", plan);
    
    // Format plan data for UI
    const formattedPlan = {
      name: `${plan.name} Plan${plan.billing_cycle === 'yearly' ? ' (Yearly)' : ''}`,
      type: plan.name,
      cycle: plan.billing_cycle,
      planId: plan.plan_id
    };
    
    console.log("Returning formatted plan details:", formattedPlan);
    return formattedPlan;
  };

  // Check if a specific plan is the active plan
  const isActivePlan = (planId: number) => {
    if (!subscription) return planId === 1; // Default to Free plan
    
    let activePlanId = 1;
    
    if (subscription.plan_id) {
      activePlanId = Number(subscription.plan_id);
    } else if (subscription.plan && subscription.plan.plan_id) {
      activePlanId = Number(subscription.plan.plan_id);
    }
    
    return activePlanId === planId;
  };

  // Reset subscription state (used for payment processing)
  const resetSubscription = () => {
    // Clear the subscription state
    setSubscription(null);
    setError(null);
    setLastFetchTime(0);
    console.log("Subscription state has been reset");
  };

  // Mock implementation for transaction creation
  const createTransaction = async (transactionData: any) => {
    try {
      // If token is not available, return error
      if (!token) {
        console.error("No auth token available for transaction creation");
        return { success: false, message: "Authentication required" };
      }

      // Call the existing transaction API endpoint
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create transaction");
      }

      const data = await response.json();
      
      // If transaction was successful, refresh subscription data
      if (data.success) {
        // Force refresh subscription after successful transaction
        if (user?.id) {
          await fetchSubscription(user.id.toString(), true);
        }
      }
      
      return data;
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      return { 
        success: false, 
        message: error.message || "Failed to create transaction record"
      };
    }
  };

  const contextValue: SubscriptionContextType = {
    subscription,
    loading,
    error,
    fetchSubscription,
    fetchActivePlan,
    getPlanDetails,
    isActivePlan,
    refreshSubscription,
    resetSubscription,
    createTransaction
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Hook to use the subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 