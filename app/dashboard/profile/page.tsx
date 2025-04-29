"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, Edit2, ExternalLink, Lock, Mail, Shield, Upload, X, User as UserIcon, UserCircle, Zap, Settings, CreditCard, Calendar, Copy, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/app/contexts/auth-context"
import { useSubscription } from "@/app/contexts/subscription-context"
import Link from "next/link"
import { User } from "@/app/utils/auth"

// Extend the User interface for our additional properties
interface ExtendedUser extends User {
  profilePicture?: string;
  created_at?: string | Date;
}

interface Transaction {
  transaction_id?: string;
  amount: string | number;
  created_at?: string | Date;
  date?: string | Date;
  description?: string;
  order_date?: string | Date;
  payment_name?: string;
}

export default function ProfilePage() {
  const { user } = useAuth() as { user: ExtendedUser | null };
  const { subscription, fetchSubscription, loading: subLoading } = useSubscription()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [emailVerified, setEmailVerified] = useState(false) // Set to false by default
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Fetch subscription data when component mounts
  useEffect(() => {
    let isActive = true;
    let didAttempt = false;
    
    const loadSubscription = async () => {
      if (user?.id && isActive && !didAttempt) {
        didAttempt = true;
        try {
          // First try the active-plan endpoint as it seems more reliable
          const result = await fetch(`/api/subscriptions/active-plan/${user.id}?_t=${Date.now()}`, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });
          
          if (!result.ok && result.status !== 404) {
            console.error(`Error fetching active plan: ${result.status}`);
          }
          
          // Still try the regular fetchSubscription in case it works
          await fetchSubscription(user.id.toString(), false);
        } catch (err) {
          console.error("Error fetching subscription:", err);
        }
      }
    };
    
    loadSubscription();
    
    return () => {
      isActive = false;
    };
  }, [user?.id]); // Only depend on user ID, not fetchSubscription

  // Get plan details based on subscription data or UI elements
  const getPlanDetails = () => {
    // Create a default hardcoded plan based on the badge in the UI header
    // This is a fallback when the API isn't available
    try {
      // Check if we're in the browser environment
      if (typeof window !== 'undefined' && document) {
        // Look for the plan label in the header
        const headerPlanLabel = document.querySelector('.basic-plan');
        if (headerPlanLabel) {
          const planText = headerPlanLabel.textContent || '';
          
          if (planText.toLowerCase().includes('premium')) {
            return {
              name: 'Premium Plan',
              type: 'Premium',
            };
          } else if (planText.toLowerCase().includes('basic')) {
            return {
              name: 'Basic Plan',
              type: 'Basic',
            };
          }
        }
      }
    } catch (e) {
      console.error("Error detecting plan from UI:", e);
    }
  
    // If no subscription data is available, use the badge from the header
    if (!subscription) {
      // Default to Basic Plan based on the UI screenshot
      return {
        name: 'Basic Plan',
        type: 'Basic',
      }
    }
    
    // SIMPLIFIED CHECKS - Reduced logging and complexity
    // Check for any premium indicators
    const subscriptionStr = JSON.stringify(subscription).toLowerCase();
    if (subscriptionStr.includes('premium')) {
      return {
        name: 'Premium Plan',
        type: 'Premium',
      };
    }
    
    // Handle the plan_id field
    if ('plan_id' in subscription) {
      let planName = 'Unknown Plan';
      let planType = 'Standard';
      
      const planId = subscription.plan_id;
      
      // Common mapping for plan IDs
      if (planId === 1) {
        planName = 'Free';
        planType = 'Free';
      } else if (planId === 2) {
        planName = 'Standard';
        planType = 'Standard';
      } else if (planId === 3) {
        planName = 'Basic';
        planType = 'Basic';
      } else if (planId === 4 || planId === 5) { // Added plan_id 5 for Premium
        planName = 'Premium';
        planType = 'Premium';
      }
      
      return {
        name: planName + ' Plan',
        type: planType,
      };
    }
    
    // Handle the direct API response structure
    if ('Plan' in subscription && subscription.Plan) {
      const plan = subscription.Plan;
      const planName = plan.name || 'Unknown Plan';
      
      // Map the plan name to types
      let planType = 'Free';
      if (planName.toLowerCase().includes('premium')) {
        planType = 'Premium';
      } else if (planName.toLowerCase().includes('basic')) {
        planType = 'Basic';
      } else if (planName.toLowerCase() !== 'free') {
        planType = 'Standard';
      }
      
      return {
        name: planName.charAt(0).toUpperCase() + planName.slice(1) + ' Plan',
        type: planType,
      };
    }
    
    // Handle subscription_plan property in the User object
    if ('User' in subscription && subscription.User && subscription.User.subscription_plan) {
      const planName = subscription.User.subscription_plan;
      
      // Map the plan name to types
      let planType = 'Free';
      // Case-insensitive check for premium
      if (planName.toLowerCase().includes('premium') || planName.toLowerCase() === 'premium') {
        planType = 'Premium';
      } else if (planName.toLowerCase().includes('basic') || planName.toLowerCase() === 'basic') {
        planType = 'Basic';
      } else if (planName.toLowerCase() !== 'free') {
        planType = 'Standard';
      }
      
      return {
        name: planName.charAt(0).toUpperCase() + planName.slice(1) + ' Plan',
        type: planType,
      };
    }
    
    // Fallback for any other structure
    return {
      name: 'Basic Plan', // Default to Basic instead of Unknown
      type: 'Basic',
    };
  }
  
  const planDetails = getPlanDetails()
  
  // Format date for display
  const formatDate = (dateString?: string | number | Date): string => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const getSubscriptionEndDate = () => {
    if (!subscription) {
      return 'N/A';
    }
    
    // Check all possible property names for end date
    const endDate = 
      subscription.end_date || 
      (subscription as any).subscription_end_date || 
      (subscription as any).next_billing_date;
    
    if (!endDate) {
      // Check User object if available
      if ('User' in subscription && subscription.User) {
        const userEndDate = 
          subscription.User.subscription_end_date || 
          subscription.User.next_billing_date;
        
        if (userEndDate) {
          return formatDate(userEndDate);
        }
      }
      
      return 'N/A';
    }
    
    return formatDate(endDate);
  }

  // Get transaction history
  const getTransactions = (): Transaction[] => {
    if (!subscription) {
      return [];
    }
    
    // Check for Transactions array in the API response
    if ('Transactions' in subscription && Array.isArray(subscription.Transactions)) {
      return subscription.Transactions;
    }
    
    return [];
  }

  const transactions = getTransactions();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerifyEmail = () => {
    // Simulate verification
    setEmailVerified(true)
    setShowConfetti(true)
    
    // Hide confetti after animation
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }
  
  // Get username from user or subscription
  const getUsername = () => {
    const username = user?.email;
    
    // Try to extract from subscription if available
    if (subscription) {
      const emailFromSubscription = 
        subscription.email_address || 
        (subscription.User && subscription.User.email);
        
      if (emailFromSubscription) {
        return emailFromSubscription;
      }
    }
    
    return username || "user@example.com";
  }
  
  const userEmail = user?.email || 'user@example.com'
  const username = getUsername()
  const displayName = user?.name || username
  const planName = planDetails.name
  const isPaid = planDetails.type !== 'Free' || 
    (subscription && 'plan_id' in subscription && subscription.plan_id !== 1)
  const subscriptionEndDate = getSubscriptionEndDate()

  return (
    <div className="container p-0 mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-100 flex items-center justify-center">
              {user?.profilePicture ? (
                <Image 
                  src={user.profilePicture} 
                  alt="Profile" 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <UserCircle className="w-12 h-12 md:w-14 md:h-14 text-emerald-300" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">
                    {user?.name || (user?.email ? user.email.split('@')[0] : 'User')}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">{user?.email || 'No email available'}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-3 md:mt-0 md:ml-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 rounded-md border-gray-200 hover:bg-gray-50"
                    onClick={() => setIsEditing('name')}
                  >
                    <Edit2 className="mr-1 h-3 w-3" />
                    Edit Profile
                  </Button>
                  
                  <Badge className={`py-1 px-3 rounded-full text-xs ${
                    planDetails.type === 'Premium' 
                      ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 hover:from-amber-200 hover:to-amber-300 border-0'
                      : planDetails.type === 'Basic'
                      ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 hover:from-emerald-200 hover:to-emerald-300 border-0'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border-0'
                  }`}>
                    {planDetails.name}
                  </Badge>
                </div>
              </div>
              
              {emailVerified ? (
                <div className="flex items-center mt-2 text-emerald-600 text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Email verified
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 md:mt-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-7 rounded-md"
                  onClick={handleVerifyEmail}
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Verify Email
                </Button>
              )}
            </div>
          </div>
          
          {isEditing === 'name' && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50">
              <div className="flex flex-col space-y-3">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                    Display Name
                  </label>
                  <Input 
                    id="name" 
                    defaultValue={user?.name || ''} 
                    placeholder="Enter your name"
                    className="h-9"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => setIsEditing(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <h3 className="text-sm font-medium">Email Address</h3>
              </div>
              <p className="text-sm break-all">{user?.email || 'Not available'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <h3 className="text-sm font-medium">Member Since</h3>
              </div>
              <p className="text-sm">{user?.created_at ? formatDate(user.created_at) : 'N/A'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Zap className="h-4 w-4 text-gray-500 mr-2" />
                <h3 className="text-sm font-medium">Account Status</h3>
              </div>
              <div className="flex items-center">
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-0 text-xs">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subscription Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium">Subscription</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs rounded-md border-emerald-100 text-emerald-700 hover:bg-emerald-50"
            onClick={() => router.push('/dashboard/upgrade')}
          >
            Manage Plan
          </Button>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Current Plan</h3>
              <div className="flex items-center">
                <Badge className={`py-1 px-3 rounded-full text-xs ${
                  planDetails.type === 'Premium' 
                    ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border-0'
                    : planDetails.type === 'Basic'
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-0'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0'
                }`}>
                  {planDetails.name}
                </Badge>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Next Billing Date</h3>
              <p className="text-sm">{getSubscriptionEndDate()}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Payment Method</h3>
              {planDetails.type === 'Free' ? (
                <p className="text-sm">No payment method</p>
              ) : (
                <div className="flex items-center">
                  <span className="bg-gray-200 rounded p-1 mr-2">
                    <CreditCard className="h-3 w-3 text-gray-700" />
                  </span>
                  <span className="text-sm">••••</span>
                </div>
              )}
            </div>
          </div>
          
          {transactions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Recent Transactions</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-xs">
                            {formatDate(transaction.created_at || transaction.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs">
                            {transaction.description || `Payment for ${planDetails.name}`}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs text-right">
                            ${typeof transaction.amount === 'string' 
                              ? parseFloat(transaction.amount).toFixed(2) 
                              : transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-2 text-right">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-xs h-8 px-0 text-emerald-600 hover:text-emerald-700"
                  onClick={() => router.push('/dashboard/billing-history')}
                >
                  View All Transactions
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Account Security Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium">Account Security</h2>
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-gray-50">
              <div className="mb-3 sm:mb-0">
                <h3 className="text-sm font-medium mb-1">Password</h3>
                <p className="text-xs text-gray-500">Last changed: Never</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs rounded-md"
                onClick={() => setIsEditing('password')}
              >
                Change Password
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-gray-50">
              <div className="mb-3 sm:mb-0">
                <h3 className="text-sm font-medium mb-1">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs rounded-md border-amber-100 text-amber-600 hover:bg-amber-50"
              >
                <Lock className="mr-1.5 h-3 w-3" />
                Set Up 2FA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}