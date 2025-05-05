"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Calendar,
  CreditCard,
  User,
  CheckCircle,
  Lock,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  RefreshCw,
  Settings,
  Shield,
  Server,
  Network,
  Users,
  Layers,
  ChevronRight,
  Info,
  Clock,
  Receipt,
  Loader2,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/app/contexts/auth-context"
import { useSubscription } from "@/app/contexts/subscription-context"
import { ApiSubscription, SubscriptionData } from "@/app/contexts/subscription-context"
import Link from "next/link"
import Image from "next/image"
import { toast } from "react-hot-toast"

export default function SubscriptionsPage() {
  const { user, token } = useAuth()
  const { subscription, loading, error, fetchSubscription } = useSubscription()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [usernameCopied, setUsernameCopied] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const hasInitiallyFetched = useRef(false)

  // Refresh subscription data when component mounts
  useEffect(() => {
    let isActive = true;
    let didAttempt = false;
    
    const loadSubscription = async () => {
      if (user?.id && isActive && !didAttempt) {
        didAttempt = true;
        try {
          // setApiStatus({message: "Loading subscription data...", type: "loading"});
          // Use our dedicated API route for active plan data
          const activePlanUrl = `/api/subscriptions/active-plan/${user.id}`;
          const result = await fetch(activePlanUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (result.ok) {
            const data = await result.json();
            console.log("Active plan data:", data);
            if (data.success) {
              // Update subscription data from active-plan endpoint
              hasInitiallyFetched.current = true;
              await fetchSubscription(user.id.toString(), true); // Force refresh with the new data
            }
          } else if (result.status !== 404) {
            const errorData = await result.json();
            console.error(`Error fetching active plan: ${result.status}`);
            const errorMessage = errorData.message || "Failed to load subscription data";
            toast.error(`Error: ${errorMessage}`);
          }
          
          // Only try the regular fetchSubscription if active-plan failed
          if (!hasInitiallyFetched.current) {
            await fetchSubscription(user.id, false);
          }
        } catch (err) {
          console.error("Error fetching subscription:", err);
          const errorMessage = err instanceof Error ? err.message : "Failed to load subscription data";
          toast.error(`Error: ${errorMessage}`);
        }
      }
    };
    
    loadSubscription();
    
    return () => {
      isActive = false;
    };
  }, [user?.id, token]);

  // Function to manually refresh subscription data
  const refreshSubscriptionData = async () => {
    if (user?.id) {
      console.log("Manual refresh of subscription data");
      // Reset the hasInitiallyFetched flag to allow a new fetch
      hasInitiallyFetched.current = false;
      await fetchSubscription(user.id, true); // Force refresh regardless of throttle
    }
  }

  // Check if subscription is from API
  const isApiSubscription = (sub: any): sub is ApiSubscription => {
    // Check if subscription is wrapped in a data property
    if (sub && sub.data) {
      return true;
    }
    
    // Old way of checking
    return sub && ('Plan' in sub || 'plan_id' in sub || (sub.User && sub.User.subscription_plan));
  }

  // Get active subscription from user data or API response
  const getActiveSubscription = () => {
    if (subscription) {
      console.log("Raw subscription from API:", subscription);
      
      // Handle the case where subscription is wrapped in data property
      if ((subscription as any).data) {
        console.log("Found data wrapper, using subscription.data");
        return (subscription as any).data;
      }
      
      return subscription;
    }
    
    if (!user || !user.subscriptions || !Array.isArray(user.subscriptions)) {
      return null
    }
    
    return user.subscriptions.find(sub => sub.status === 'active') || null
  }

  const activeSubscription = getActiveSubscription()

  console.log("activeSubscription", activeSubscription)
  
  // Get plan details
  const getPlanDetails = () => {
    if (!activeSubscription) {
      return {
        name: 'Free Plan',
        type: 'Free',
        accountType: 'Individual',
        multiLoginLimit: 1
      };
    }
    
    // Get plan_id from the subscription
    const planId = activeSubscription.plan_id || 
                  (activeSubscription.plan && activeSubscription.plan.plan_id) || 
                  ((activeSubscription as any).Plan && (activeSubscription as any).Plan.plan_id) || 1;
    
    // Determine plan details based on plan_id
    if (planId === 1) {
      return {
        name: 'Free Plan',
        type: 'Free',
        accountType: 'Individual',
        multiLoginLimit: 1
      };
    } else if (planId === 2) {
      return {
        name: 'Individual Plan',
        type: 'Individual',
        accountType: 'Individual',
        multiLoginLimit: 2
      };
    } else if (planId === 3) {
      return {
        name: 'Basic Plan',
        type: 'Basic',
        accountType: 'Individual',
        multiLoginLimit: 2
      };
    } else if (planId === 4) {
      return {
        name: 'Premium Plan',
        type: 'Premium',
        accountType: 'Individual',
        multiLoginLimit: 5
      };
    } else if (planId === 5) {
      return {
        name: 'Individual Plan (Yearly)',
        type: 'Individual',
        accountType: 'Individual',
        multiLoginLimit: 2
      };
    } else if (planId === 6) {
      return {
        name: 'Basic Plan (Yearly)',
        type: 'Basic',
        accountType: 'Individual',
        multiLoginLimit: 2
      };
    } else if (planId === 7) {
      return {
        name: 'Premium Plan (Yearly)',
        type: 'Premium',
        accountType: 'Individual',
        multiLoginLimit: 5
      };
    }
    
    // Default if we can't determine
    return {
      name: 'Free Plan',
      type: 'Free',
      accountType: 'Individual',
      multiLoginLimit: 1
    };
  }
  
  const planDetails = getPlanDetails()
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!activeSubscription) {
      return 0;
    }
    
    // Use end_date or next_billing_date from the subscription data
    const endDateStr = activeSubscription.end_date || 
      (activeSubscription as any).next_billing_date || 
      (activeSubscription as any).Plan?.next_billing_date;
    
    if (!endDateStr) {
      // If we can't find the date directly, check in nested properties
      if ('data' in activeSubscription && (activeSubscription as any).data) {
        const endDateFromData = (activeSubscription as any).data.end_date ||
          (activeSubscription as any).data.next_billing_date;
        if (endDateFromData) {
          const endDate = new Date(endDateFromData);
          const today = new Date();
          const diffTime = endDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 ? diffDays : 0;
        }
      }
      return 30; // Fallback to default 30 days
    }
    
    const endDate = new Date(endDateStr);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }
  
  const daysRemaining = getDaysRemaining()

  // Get subscription end date
  const getSubscriptionEndDate = () => {
    if (!activeSubscription) {
      return 'N/A';
    }
    
    // Check all possible property names for end date
    const endDate = 
      activeSubscription.end_date || 
      (activeSubscription as any).next_billing_date ||
      activeSubscription.Plan?.next_billing_date;
    
    if (!endDate) {
      // Check nested data property if available
      if ('data' in activeSubscription && (activeSubscription as any).data) {
        const endDateFromData = (activeSubscription as any).data.end_date ||
          (activeSubscription as any).data.next_billing_date;
        if (endDateFromData) {
          return formatDate(endDateFromData);
        }
      }
      
      // Check User object if available
      if ('User' in activeSubscription && activeSubscription.User) {
        const userEndDate = 
          activeSubscription.User.subscription_end_date || 
          activeSubscription.User.next_billing_date;
        
        if (userEndDate) {
          return formatDate(userEndDate);
        }
      }
      
      return formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Fallback
    }
    
    return formatDate(endDate);
  }

  // Format date for display
  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Get billing cycle
  const getBillingCycle = () => {
    if (!activeSubscription) return "Free";
    
    // Check if subscription has 'plan' property with 'billing_cycle' directly
    if (activeSubscription.plan && typeof activeSubscription.plan === 'object') {
      const billingCycle = activeSubscription.plan.billing_cycle;
      return billingCycle === "yearly" ? "12 Months" : 
             billingCycle === "monthly" ? "Monthly" : "Free";
    }
    
    // Check if subscription has plan_id
    if ('plan_id' in activeSubscription) {
      const planId = activeSubscription.plan_id;
      // Use duration property if available
      if ('duration' in activeSubscription) {
        return (activeSubscription as any).duration === "yearly" ? "12 Months" : "Monthly";
      }
      // Fallback to defaults based on plan
      return planId === 1 ? "Free" : "Monthly";
    }
    
    // Check User object
    if ('User' in activeSubscription && (activeSubscription as any).User) {
      return (activeSubscription as any).User.subscription_plan === 'basic' ? "Monthly" : "Free";
    }
    
    // Check Plan object (original API format)
    if (isApiSubscription(activeSubscription) && 'Plan' in activeSubscription) {
      return (activeSubscription as any).Plan.billing_cycle === "monthly" ? "Monthly" :
             (activeSubscription as any).Plan.billing_cycle === "yearly" ? "12 Months" : "Free";
    }
    
    // Fallback to plan property
    return activeSubscription.plan?.billing_cycle === "0" ? "Free" :
           activeSubscription.plan?.billing_cycle === "12" ? "12 Months" : "Monthly";
  }

  // Get subscription status
  const getSubscriptionStatus = () => {
    return activeSubscription?.status || "Inactive";
  }

  // Check if subscription is free
  const isFreePlan = () => {
    if (!subscription && !activeSubscription) {
      return true;
    }
    
    // Get plan_id from the subscription
    const planId = activeSubscription?.plan_id ||
                  (activeSubscription?.plan && activeSubscription.plan.plan_id) ||
                  (activeSubscription?.Plan && activeSubscription.Plan.plan_id);
                  
    // Plan ID 1 is the free plan
    return planId === 1;
  }

  // Get plan price
  const getPlanPrice = () => {
    // Return Premium plan price
    return "PKR 2000.00";
  }

  // Get username/email
  const getUsername = () => {
    if (isApiSubscription(activeSubscription)) {
      return (activeSubscription as any).email_address || user?.email || "user@example.com";
    } else {
      return user?.email || "user@example.com";
    }
  }

  // Define billing history item type outside the function
  interface BillingHistoryItem {
    date: string;
    description: string;
    amount: string;
    status: string;
    paymentType?: string;
  }

  // Define transaction interface
  interface Transaction {
    transaction_id: number;
    status: string;
    processed_at: string;
    currency: string;
    payment_method: {
      payment_method_id: number;
      type: string;
      details: string;
    };
    amount: string | number;
    bank_detail: {
      id: number;
      transaction_id: number;
      payment_reference: string;
      email_address: string;
      mobile_no: string;
      order_date: string;
      [key: string]: any;
    };
  }

  const [billingHistoryData, setBillingHistoryData] = useState<BillingHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Get payment method information from transactions
  const getPaymentMethodInfo = () => {
    // Default payment info
    let paymentInfo = {
      type: 'card',
      details: 'Credit Card',
      lastDigits: '****'
    };

    console.log("Billing History Data:", billingHistoryData);
    
    // If we have billing history data, use the most recent transaction
    if (billingHistoryData.length > 0) {
      // Sort by date (most recent first)
      const sortedTransactions = [...billingHistoryData].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      const latestTransaction = sortedTransactions[0];
      
      // Use paymentType directly if available, otherwise extract from description
      if (latestTransaction.paymentType) {
        paymentInfo.type = latestTransaction.paymentType.toLowerCase();
        
        // If the payment type is 'card', update the details to 'Card'
        if (paymentInfo.type === 'card') {
          paymentInfo.details = 'Card';
        } else {
          // Extract payment method from description if needed
          const description = latestTransaction.description || '';
          const parts = description.split(' - ');
          if (parts.length > 0) {
            paymentInfo.details = parts[0];
          }
        }
      } else {
        // Fallback to parsing from description
        const description = latestTransaction.description || '';
        const parts = description.split(' - ');
        if (parts.length > 0) {
          paymentInfo.details = parts[0];
        }
      }
    }
    
    return paymentInfo;
  };

  // Get subscription data
  const subscriptionData = {
    billingCycle: getBillingCycle(),
    planType: planDetails.type,
    accountType: planDetails.accountType,
    subscriptionType: isFreePlan() ? "FREE" : "PAID",
    status: getSubscriptionStatus(),
    multiLoginLimit: planDetails.multiLoginLimit,
    expiryDate: getSubscriptionEndDate(),
    daysRemaining: daysRemaining,
    paymentMethod: getPaymentMethodInfo().details,
    paymentType: getPaymentMethodInfo().type,
    username: getUsername(),
    password: "**************",
  }

  // Define the fetch function with useCallback to prevent recreation on every render
  const fetchBillingHistory = useCallback(async () => {
    if (isFreePlan()) return;
    
    // Prevent multiple calls if already loading
    if (loadingHistory) return;
    
    try {
      setLoadingHistory(true);
      
      // Get user ID from auth context, fallback to 3 if not available
      const userId = user?.id || '3'; 
      
      // Use the direct endpoint that's returning the correct data with multiple transactions
      const url = `/api/transactions/${userId}`;
      console.log("Fetching billing history from:", url);
      console.log("User ID being used:", userId);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to fetch transaction data: ${response.status}`);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch transaction data: ${response.status}`);
      }
      
      // Parse the response directly as JSON
      const data = await response.json();
      
      if (data && Array.isArray(data.transactions) && data.transactions.length > 0) {
        console.log(`Successfully loaded ${data.transactions.length} completed transactions`);
        
        // Map the transactions to billing history format
        const history = data.transactions.map((transaction: Transaction) => {
          // Get payment method details
          const paymentMethod = transaction.payment_method?.details || 'Unknown';
          const paymentType = transaction.payment_method?.type || '';
          
          // Format payment reference
          const reference = transaction.bank_detail?.payment_reference || '';
          const shortRef = reference.length > 10 ? `${reference.slice(0, 10)}...` : reference;
          
          // Display 'Card' if the payment type is 'card', otherwise use the details from the API
          const displayMethod = paymentType.toLowerCase() === 'card' ? 'Card' : paymentMethod;
          
          return {
            date: formatDate(transaction.processed_at),
            description: `${displayMethod} - ${shortRef}`,
            amount: `${transaction.currency} ${transaction.amount}`,
            status: 'Completed',
            paymentType: paymentType // Store payment type for icon display
          };
        });
        
        console.log("Processed history items:", history.length, history);
        setBillingHistoryData(history);
      } else {
        console.log("No transaction data found or data in unexpected format:", data);
        
        // Use fallback sample data when API returns empty data
        const sampleData = [
          {
            date: "Apr 29, 2025",
            description: "Premium Plan - Monthly",
            amount: "PKR 2000",
            status: "Completed",
            paymentType: "card"
          }
        ];
        
        setBillingHistoryData(sampleData);
      }
    } catch (err: any) {
      console.error("Error fetching billing history:", err);
      
      // Use fallback sample data when there's an error
      const sampleData = [
        {
          date: "Apr 29, 2025",
          description: "Premium Plan - Monthly",
          amount: "PKR 2000",
          status: "Completed",
          paymentType: "card"
        }
      ];
      
      setBillingHistoryData(sampleData);
    } finally {
      setLoadingHistory(false);
    }
  }, [user?.id, formatDate, isFreePlan, loadingHistory]);

  // Fetch billing history data from API
  useEffect(() => {
    // Create a flag to track if this component is mounted
    let isMounted = true;
    
    // Only fetch if we haven't loaded data yet
    if (billingHistoryData.length === 0 && !loadingHistory && isMounted) {
      fetchBillingHistory();
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [fetchBillingHistory, billingHistoryData.length, loadingHistory]);
  
  // Log billing history for debugging
  useEffect(() => {
    console.log("Billing history count:", billingHistoryData.length);
    console.log("Billing history data:", billingHistoryData);
  }, [billingHistoryData]);

  // Get billing history
  const getBillingHistory = (): BillingHistoryItem[] => {
    // Return the API data if available
    if (billingHistoryData.length > 0) {
      return billingHistoryData;
    }
    
    if (!activeSubscription || isFreePlan()) return [];
    
    const history: BillingHistoryItem[] = [];
    
    // Add current subscription
    history.push({
      date: formatDate(activeSubscription.start_date),
      description: `${planDetails.name} - ${subscriptionData.billingCycle}`,
      amount: getPlanPrice(),
      status: "Paid"
    });
    
    // Add transaction history if available from API
    if (isApiSubscription(activeSubscription) && activeSubscription.Transactions) {
      activeSubscription.Transactions.forEach(transaction => {
        if (!history.some(item => item.date === formatDate(transaction.order_date))) {
          history.push({
            date: formatDate(transaction.order_date),
            description: `${planDetails.name} - ${subscriptionData.billingCycle}`,
            amount: `$${transaction.transaction_amount}`,
            status: "Paid"
          });
        }
      });
    }
    
    return history;
  }

  // Billing history data
  const billingHistory = getBillingHistory();


  // Function to get payment method icon
  const getPaymentMethodIcon = (paymentType: string) => {
    if (paymentType.toLowerCase() === 'wallet') {
      return <Wallet className="h-3.5 w-3.5 text-green-600 mr-2" />;
    } else if (paymentType.toLowerCase() === 'card') {
      return <CreditCard className="h-3.5 w-3.5 text-blue-600 mr-2" />;
    } else {
      return <CreditCard className="h-3.5 w-3.5 text-gray-600 mr-2" />;
    }
  };

  // Function to determine payment method display
  const getPaymentMethodDisplay = (transaction: BillingHistoryItem) => {
    return (
      <div className="flex items-center">
        {getPaymentMethodIcon(transaction.paymentType || 'card')}
        <span>{transaction.description}</span>
      </div>
    );
  };

  // Get subscription start date
  const getSubscriptionStartDate = () => {
    if (!activeSubscription) {
      return 'N/A';
    }
    
    // Check all possible property names for start date
    const startDate = 
      activeSubscription.start_date || 
      (activeSubscription as any).created_at ||
      (activeSubscription as any).Plan?.start_date;
    
    if (!startDate) {
      // Check nested data property if available
      if ('data' in activeSubscription && (activeSubscription as any).data) {
        const startDateFromData = (activeSubscription as any).data.start_date ||
          (activeSubscription as any).data.created_at;
        if (startDateFromData) {
          return formatDate(startDateFromData);
        }
      }
      
      // Check User object if available
      if ('User' in activeSubscription && activeSubscription.User) {
        const userStartDate = 
          activeSubscription.User.created_at || 
          activeSubscription.User.subscription_start_date;
        
        if (userStartDate) {
          return formatDate(userStartDate);
        }
      }
      
      return formatDate(new Date()); // Fallback to today
    }
    
    return formatDate(startDate);
  }

  // Calculate subscription progress percentage
  const getSubscriptionProgress = () => {
    if (!activeSubscription) {
      return 0;
    }
    
    // Get start and end dates
    let startDateStr = activeSubscription.start_date || 
      (activeSubscription as any).created_at ||
      activeSubscription.Plan?.start_date;
      
    let endDateStr = activeSubscription.end_date || 
      (activeSubscription as any).next_billing_date || 
      activeSubscription.Plan?.next_billing_date;
    
    // If dates aren't in the main object, try to find them in nested objects
    if (!startDateStr || !endDateStr) {
      if ('data' in activeSubscription && (activeSubscription as any).data) {
        startDateStr = startDateStr || (activeSubscription as any).data.start_date || (activeSubscription as any).data.created_at;
        endDateStr = endDateStr || (activeSubscription as any).data.end_date || (activeSubscription as any).data.next_billing_date;
      }
      
      if (!startDateStr || !endDateStr) {
        return 50; // Default to 50% if we can't determine
      }
    }
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const today = new Date();
    
    // Calculate total duration and elapsed time
    const totalDuration = endDate.getTime() - startDate.getTime();
    if (totalDuration <= 0) return 0;
    
    const elapsedTime = today.getTime() - startDate.getTime();
    
    // Calculate percentage (ensure it's between 0-100)
    const percentage = Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100));
    
    return Math.round(percentage);
  }

  return (
    <div className="max-w-[1000px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 animate-spin" />
          <span className="ml-3 text-sm text-gray-500">Loading subscription data...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-red-800">Error Loading Subscription</h3>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button
              size="sm"
              onClick={() => {
                if (user?.id) {
                  hasInitiallyFetched.current = false;
                  fetchSubscription(user.id, true);
                }
              }}
              className="bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded-sm h-7"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Header */}
          <div className="mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <h1 className="text-lg sm:text-xl font-medium text-gray-900">Subscriptions</h1>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={refreshSubscriptionData}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs h-8 px-3 rounded-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs h-8 px-3 rounded-sm"
                  asChild
                >
                  <Link href="/dashboard/upgrade">Upgrade Plan</Link>
                </Button>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Manage your payment details, plan upgrades, renewals, and VPN passwords.
            </p>
          </div>

          {/* Subscription Overview */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-4 sm:mb-6">
            {isFreePlan() ? (
              <div className="p-3 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center mr-3 bg-gradient-to-r from-gray-400 to-gray-500">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-sm font-medium text-gray-900">Free Plan</h2>
                        <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-700 border-0 text-[9px] px-1.5 py-0">
                          ACTIVE
                        </Badge>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        No active subscription
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded-sm border border-gray-100">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-600">You are currently on the Free Plan with limited features. Upgrade to a paid plan to access premium features.</p>
                  </div>
                  
                  <Button
                    size="sm"
                    className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs h-8 px-3 rounded-sm"
                    asChild
                  >
                    <Link href="/dashboard/upgrade">Upgrade Now</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 p-3 sm:p-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center mr-3 ${
                      subscriptionData.planType === 'Premium' 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                        : subscriptionData.planType === 'Free' 
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                    }`}>
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-sm font-medium text-gray-900">{planDetails.name}</h2>
                        <Badge variant="outline" className={`ml-2 ${
                          subscriptionData.status.toLowerCase() === 'active' 
                            ? 'bg-green-50 text-emerald-700' 
                            : 'bg-gray-50 text-gray-700'
                        } border-0 text-[9px] px-1.5 py-0`}>
                          {subscriptionData.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {subscriptionData.status.toLowerCase() === 'active' 
                          ? `Expires on ${subscriptionData.expiryDate}` 
                          : 'Limited features available'}
                      </p>
                    </div>
                  </div>
                </div>

                {!isFreePlan() && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="mb-4 sm:mb-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-gray-500">Started on {getSubscriptionStartDate()}</span>
                        <span className="text-[11px] text-gray-500">Renews on {getSubscriptionEndDate()}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-gray-500">{daysRemaining} days remaining</span>
                        <span className="text-[11px] text-gray-500">
                          {getSubscriptionProgress()}% complete
                        </span>
                      </div>
                      <Progress value={getSubscriptionProgress()} className="h-1 bg-gray-100">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-none" />
                      </Progress>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-gray-100 p-3 sm:p-4">
              {/* Billing Cycle */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Billing Cycle</div>
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span className="text-xs font-medium">{subscriptionData.billingCycle}</span>
                </div>
              </div>

              {/* Plan Type */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Plan Type</div>
                <div className="flex items-center">
                  <Shield className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span className="text-xs font-medium">{subscriptionData.planType}</span>
                </div>
              </div>

              {/* Account Type */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Account Type</div>
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span className="text-xs font-medium">{subscriptionData.accountType}</span>
                </div>
              </div>

              {/* Multi-login Limit */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Multi-login Limit</div>
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span className="text-xs font-medium">{subscriptionData.multiLoginLimit} Sessions</span>
                </div>
              </div>
            </div>

            {/* Payment Method - Only show for paid plans */}
            {subscriptionData.subscriptionType !== 'FREE' && (
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-sm mx-3 sm:mx-4 mb-3 sm:mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-3.5 w-3.5 text-gray-500 mr-2" />
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Payment Method</span>
                  </div>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] h-6 px-2 text-gray-900 hover:bg-gray-100 rounded-sm"
                  >
                    Change
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button> */}
                </div>
                <div className="mt-2 flex items-center">
                  {getPaymentMethodIcon(subscriptionData.paymentType)}
                  <span className="text-xs font-medium">{subscriptionData.paymentMethod}</span>
                </div>
              </div>
            )}
          </div>

          {/* Billing History Section */}
          <div className="mt-6 sm:mt-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-sm font-medium text-gray-900">Billing History</h2>
              {billingHistory.length > 0 && (
                <Link href="/dashboard/billing-history">
                  <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-gray-900 hover:bg-gray-100 rounded-sm">
                    View all
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              )}
            </div>

            {loadingHistory ? (
              <div className="border border-gray-200 rounded-sm p-6 sm:p-8 text-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 animate-spin mx-auto mb-3 sm:mb-4" />
                <p className="text-sm text-gray-500">Loading transaction history...</p>
              </div>
            ) : billingHistory.length > 0 ? (
              <div className="border border-gray-200 rounded-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-2 sm:px-3 py-2">Date</th>
                        <th className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-2 sm:px-3 py-2">
                          Description
                        </th>
                        <th className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-2 sm:px-3 py-2">Amount</th>
                        <th className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-2 sm:px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingHistory.map((item, index) => (
                        <tr key={index}>
                          <td className="text-xs px-2 sm:px-3 py-2">{item.date}</td>
                          <td className="text-xs px-2 sm:px-3 py-2">
                            {getPaymentMethodDisplay(item)}
                          </td>
                          <td className="text-xs px-2 sm:px-3 py-2">{item.amount}</td>
                          <td className="text-xs px-2 sm:px-3 py-2">
                            <Badge variant="outline" className={`${
                              item.status.toLowerCase() === 'completed' || item.status.toLowerCase() === 'paid'
                                ? 'bg-green-50 text-emerald-700'
                                : item.status.toLowerCase() === 'pending'
                                ? 'bg-yellow-50 text-yellow-700'
                                : 'bg-gray-50 text-gray-700'
                            } border-0 text-[9px] px-1.5 py-0`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-sm p-4 sm:p-8 text-center">
                <div className="max-w-[160px] sm:max-w-[200px] h-[120px] sm:h-[140px] mx-auto mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Receipt className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">No Billing History Yet</h3>
                <p className="text-xs text-gray-500 max-w-[300px] mx-auto mb-4">
                  Your billing history will appear here once you upgrade to a paid plan or make any purchases.
                </p>
                <Button 
                  size="sm" 
                  asChild
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs rounded-sm"
                >
                  <Link href="/dashboard/upgrade">Upgrade Plan</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Special Offer - Only show for free plans */}
          {subscriptionData.subscriptionType === 'FREE' && (
            <div className="my-4 sm:mb-8 border border-gray-200 rounded-sm overflow-hidden">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-amber-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-amber-900">Special Upgrade Offer</h3>
                      <p className="text-xs text-amber-700 mt-0.5">Upgrade now and save up to 50% on yearly plans</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-full h-7 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/dashboard/upgrade">
                      Upgrade Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Subscription Dialog */}
          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogContent className="max-w-md mx-2">
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Your Subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will cancel your subscription at the end of your current billing cycle. You will still have access
                  until October 28, 2025.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="text-xs mt-0">Keep Subscription</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-xs">Confirm Cancellation</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
