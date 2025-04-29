"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
    Check,
    Clock,
    CreditCard,
    Calendar,
    Package,
    Zap,
    Globe,
    Key,
    AlertTriangle,
    Database,
    Info,
    Shield,
    DollarSign,
    ArrowUpRight,
    Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/app/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { useSubscription } from "@/app/contexts/subscription-context"
import { PaymentMethodsSheet } from "@/components/payment-methods-sheet"
import Link from "next/link"

export default function UpgradePage() {
    const { user } = useAuth()
    const { subscription, forceSubscriptionRefresh } = useSubscription()
    const router = useRouter()
    const [selectedPlan, setSelectedPlan] = useState<"individual" | "basic" | "premium">("premium")
    const [selectedDuration, setSelectedDuration] = useState<"yearly" | "monthly">("yearly")
    const [currentBillingCycle, setCurrentBillingCycle] = useState<"yearly" | "monthly" | null>(null)

    // Add detailed debugging logs
    useEffect(() => {
        console.log("==== DEBUG SUBSCRIPTION DATA ====");
        console.log("subscription object:", subscription);
        if (subscription && (subscription as any).data) {
            console.log("subscription.data:", (subscription as any).data);
            console.log("subscription.data.plan_id:", (subscription as any).data.plan_id);
        }
        console.log("user object:", user);
        console.log("user.subscriptions:", user?.subscriptions);
        if (user && user.subscriptions && user.subscriptions.length > 0) {
            console.log("First active subscription:", user.subscriptions.find(sub => sub.status === 'active'));
        }
        console.log("================================");
    }, [subscription, user]);

    // Get the current billing cycle
    const getBillingCycle = useCallback(() => {
        // Check direct subscription first
        if (subscription) {
            const subscriptionData = (subscription as any).data || subscription;
            
            // Check for billing_cycle property in different locations using safe property access
            if (subscriptionData && typeof subscriptionData === 'object') {
                // Use type assertion to safely check properties
                if ('billing_cycle' in subscriptionData) {
                    return subscriptionData.billing_cycle as string;
                }
                
                // Check in plan object
                const planObj = subscriptionData.plan || null;
                if (planObj && typeof planObj === 'object' && 'billing_cycle' in planObj) {
                    return planObj.billing_cycle as string;
                }
                
                // Check in Plan object
                const PlanObj = subscriptionData.Plan || null;
                if (PlanObj && typeof PlanObj === 'object' && 'billing_cycle' in PlanObj) {
                    return PlanObj.billing_cycle as string;
                }
                
                // Check for duration property
                if ('duration' in subscriptionData) {
                    return subscriptionData.duration as string;
                }
            }
        }
        
        // Check user object fallback
        if (user?.subscriptions && Array.isArray(user.subscriptions) && user.subscriptions.length > 0) {
            const activeSubscription = user.subscriptions.find(sub => sub.status === 'active');
            if (activeSubscription && typeof activeSubscription === 'object') {
                // Use type assertion for safe property access
                if ('billing_cycle' in activeSubscription) {
                    return activeSubscription.billing_cycle as string;
                }
                
                const subPlan = activeSubscription.plan || null;
                if (subPlan && typeof subPlan === 'object' && 'billing_cycle' in subPlan) {
                    return subPlan.billing_cycle as string;
                }
                
                if ('duration' in activeSubscription) {
                    return activeSubscription.duration as string;
                }
            }
        }
        
        return null;
    }, [subscription, user]);

    // Set billing cycle on mount and when subscription changes
    useEffect(() => {
        const cycle = getBillingCycle();
        if (cycle === 'monthly' || cycle === 'yearly') {
            setCurrentBillingCycle(cycle);
            // Also set the selected duration to match current cycle
            setSelectedDuration(cycle);
        }
    }, [subscription, user, getBillingCycle]);

    // Check if user has a free plan
    const isFreePlan = () => {
        console.log("Checking if user has free plan, subscription:", subscription);
        console.log("User Plan:", user?.subscriptions);
        
        // First check subscription data from API
        if (subscription) {
            const subscriptionData = (subscription as any).data || subscription;
            
            // If we have a plan_id directly in the data, check it
            if (subscriptionData.plan_id !== undefined) {
                return subscriptionData.plan_id === 1; // Only plan ID 1 is free
            }
            
            // Check if it's in a Plan object
            if (subscriptionData.Plan) {
                if ((subscriptionData.Plan as any).id !== undefined) {
                    return (subscriptionData.Plan as any).id === 1;
                }
                // Fallback to name check if no id
                return subscriptionData.Plan.name?.toLowerCase() === 'free';
            }
            
            // Check if it's in User object
            if (subscriptionData.User) {
                if (subscriptionData.User.subscription_plan_id !== undefined) {
                    return subscriptionData.User.subscription_plan_id === 1;
                }
                // Fallback to name check
                return subscriptionData.User.subscription_plan?.toLowerCase() === 'free';
            }
        }
        
        // User object fallback
        if (!user || !user.subscriptions || !Array.isArray(user.subscriptions) || user.subscriptions.length === 0) {
            return true; // No subscription means free plan
        }
        
        const activeSubscription = user.subscriptions.find(sub => sub.status === 'active');
        if (!activeSubscription) {
            return true; // No active subscription means free plan
        }
        
        // Check plan_id in the active subscription
        if (activeSubscription.plan_id !== undefined) {
            return activeSubscription.plan_id === 1;
        }
        
        // Check plan object
        if (activeSubscription.plan) {
            if ((activeSubscription.plan as any).id !== undefined) {
                return (activeSubscription.plan as any).id === 1;
            }
            return activeSubscription.plan.name?.toLowerCase() === 'free';
        }
        
        return true; // Default to free plan if we can't determine
    }

    // Get current plan from user subscription data
    const getCurrentPlan = (): { name: string; type: 'individual' | 'basic' | 'premium' | null } => {
        // Check subscription data from API first
        if (subscription) {
            const subscriptionData = (subscription as any).data || subscription;
            
            // Check plan_id in the subscription data
            if (subscriptionData.plan_id !== undefined) {
                if (subscriptionData.plan_id === 1) return { name: 'Free Plan', type: null };
                if (subscriptionData.plan_id === 2) return { name: 'Individual Plan', type: 'individual' };
                if (subscriptionData.plan_id === 3) return { name: 'Premium Plan', type: 'premium' };
                if (subscriptionData.plan_id === 4) return { name: 'Premium Plan', type: 'premium' };
            }
            
            // Check Plan object
            if (subscriptionData.Plan) {
                if ((subscriptionData.Plan as any).id !== undefined) {
                    if ((subscriptionData.Plan as any).id === 1) return { name: 'Free Plan', type: null };
                    if ((subscriptionData.Plan as any).id === 2) return { name: 'Individual Plan', type: 'individual' };
                    if ((subscriptionData.Plan as any).id === 3) return { name: 'Premium Plan', type: 'premium' };
                    if ((subscriptionData.Plan as any).id === 4) return { name: 'Premium Plan', type: 'premium' };
                }
                
                // Fallback to name-based check
                const planName = subscriptionData.Plan.name || 'Free';
                if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('plus')) return { name: 'Premium Plan', type: 'premium' };
                if (planName.toLowerCase().includes('basic') || planName.toLowerCase().includes('standard')) return { name: 'Basic Plan', type: 'basic' };
                if (planName.toLowerCase() !== 'free') return { name: planName + ' Plan', type: 'individual' };
                return { name: 'Free Plan', type: null };
            }
            
            // Check User object
            if (subscriptionData.User) {
                if (subscriptionData.User.subscription_plan_id !== undefined) {
                    if (subscriptionData.User.subscription_plan_id === 1) return { name: 'Free Plan', type: null };
                    if (subscriptionData.User.subscription_plan_id === 2) return { name: 'Individual Plan', type: 'individual' };
                    if (subscriptionData.User.subscription_plan_id === 3) return { name: 'Premium Plan', type: 'premium' };
                    if (subscriptionData.User.subscription_plan_id === 4) return { name: 'Premium Plan', type: 'premium' };
                }
                
                // Fallback to name-based check
                const planName = subscriptionData.User.subscription_plan || 'Free';
                if (planName.toLowerCase().includes('premium')) return { name: 'Premium Plan', type: 'premium' };
                if (planName.toLowerCase().includes('basic')) return { name: 'Basic Plan', type: 'basic' };
                if (planName.toLowerCase() !== 'free') return { name: planName + ' Plan', type: 'individual' };
                return { name: 'Free Plan', type: null };
            }
        }
        
        // User object fallback
        if (!user || !user.subscriptions || !Array.isArray(user.subscriptions) || user.subscriptions.length === 0) {
            return { name: 'Free Plan', type: null };
        }
        
        const activeSubscription = user.subscriptions.find(sub => sub.status === 'active');
        if (!activeSubscription) {
            return { name: 'Free Plan', type: null };
        }
        
        // Check plan_id in the active subscription
        if (activeSubscription.plan_id !== undefined) {
            if (activeSubscription.plan_id === 1) return { name: 'Free Plan', type: null };
            if (activeSubscription.plan_id === 2) return { name: 'Individual Plan', type: 'individual' };
            if (activeSubscription.plan_id === 3) return { name: 'Premium Plan', type: 'premium' };
            if (activeSubscription.plan_id === 4) return { name: 'Premium Plan', type: 'premium' };
        }
        
        // Check plan object
        if (activeSubscription.plan) {
            if ((activeSubscription.plan as any).id !== undefined) {
                if ((activeSubscription.plan as any).id === 1) return { name: 'Free Plan', type: null };
                if ((activeSubscription.plan as any).id === 2) return { name: 'Individual Plan', type: 'individual' };
                if ((activeSubscription.plan as any).id === 3) return { name: 'Premium Plan', type: 'premium' };
                if ((activeSubscription.plan as any).id === 4) return { name: 'Premium Plan', type: 'premium' };
            }
            
            const planName = activeSubscription.plan.name || 'Free';
            if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('plus')) return { name: 'Premium Plan', type: 'premium' };
            if (planName.toLowerCase().includes('basic') || planName.toLowerCase().includes('standard')) return { name: 'Basic Plan', type: 'basic' };
            if (planName.toLowerCase() !== 'free') return { name: planName + ' Plan', type: 'individual' };
        }
        
        return { name: 'Free Plan', type: null };
    }

    // Set the selected plan based on user subscription when component mounts
    useEffect(() => {
        const { type } = getCurrentPlan()
        if (type) {
            setSelectedPlan(type as "individual" | "basic" | "premium")
        }
    }, [user])

    // Plan prices
    const prices = {
        monthly: {
            individual: 500,
            basic: 800,
            premium: 2000,
        },
        yearly: {
            individual: 400,
            basic: 600,
            premium: 1800,
        }
    }

    // Plan details
    const plans = {
        individual: {
            name: "Individual",
            description: "Perfect for personal use with 1 device.",
            devices: 1,
            icon: <Zap className="h-5 w-5 text-emerald-600" />,
            features: [
                { name: "1 Device Connection", description: "Connect a single device" },
                { name: "Unlimited Data", description: "No bandwidth restrictions" },
                { name: "Standard Servers", description: "Access to all standard servers" },
            ],
            isPopular: false,
        },
        basic: {
            name: "Basic",
            description: "Great for couples or dual-device users.",
            devices: 2,
            icon: <Shield className="h-5 w-5 text-emerald-600" />,
            features: [
                { name: "2 Device Connections", description: "Connect two devices at once" },
                { name: "Unlimited Data", description: "No bandwidth restrictions" },
                { name: "Premium Servers", description: "Access to premium and standard servers" },
                { name: "Ad Blocker", description: "Block ads and trackers" },
            ],
            isPopular: false,
        },
        premium: {
            name: "Premium",
            description: "Ideal for families or multiple device users.",
            devices: 5,
            icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
            features: [
                { name: "5 Device Connections", description: "Connect up to five devices at once" },
                { name: "Unlimited Data", description: "No bandwidth restrictions" },
                { name: "Premium Servers", description: "Access to all servers including dedicated IP" },
                { name: "Ad Blocker", description: "Enhanced ad and tracker blocking" },
                { name: "Split Tunneling", description: "Advanced app routing options" },
                { name: "Advanced Security Features", description: "Additional encryption and protection" },
                { name: "Priority Support", description: "24/7 priority customer support" },
            ],
            isPopular: true,
        },
    }

    // Calculate yearly savings
    const calculateYearlySavings = (plan: "individual" | "basic" | "premium") => {
        const monthlyTotal = prices.monthly[plan] * 12
        const yearlyTotal = prices.yearly[plan] * 12
        return monthlyTotal - yearlyTotal
    }

    // Calculate total price
    const calculateTotalPrice = (plan: "individual" | "basic" | "premium", duration: "yearly" | "monthly") => {
        if (duration === "yearly") {
            return (prices.yearly[plan] * 12).toFixed(0)
        } else {
            return prices.monthly[plan].toFixed(0)
        }
    }

    // Get expiry date
    const getExpiryDate = (duration: "yearly" | "monthly") => {
        const today = new Date()
        if (duration === "yearly") {
            today.setFullYear(today.getFullYear() + 1)
        } else {
            today.setMonth(today.getMonth() + 1)
        }
        return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    // Current subscription info
    const currentPlan = getCurrentPlan()
    const currentPlanDisplay = currentPlan.name || 'Free Plan'
    const isSameCycle = currentBillingCycle === selectedDuration
    
    // Function to check if the current plan button should be disabled based on billing cycle
    const isPlanDisabled = (planType: "individual" | "basic" | "premium") => {
        // If it's a free plan, never disable
        if (isFreePlan()) return false;
        
        // If it's the same plan as current, disable it
        if (currentPlan.type === planType && isSameCycle) return true;
        
        return false;
    }

    // Handle payment redirect
    const handlePaymentRedirect = () => {
        try {
            // Force a refresh of subscription data before redirecting to payment
            if (user?.id) {
                // First reset any stale subscription data
                console.log("Resetting subscription state before payment redirect");
                forceSubscriptionRefresh();
            }
            
            // Get the plan amount based on selection
            const amount = selectedDuration === "yearly" 
                ? calculateTotalPrice(selectedPlan, "yearly") 
                : prices.monthly[selectedPlan];
            
            // Get plan name for transaction description
            const planName = plans[selectedPlan].name;
            
            // Create query parameters for payment page
            const queryParams = new URLSearchParams({
                plan: selectedPlan,
                duration: selectedDuration,
                amount: amount.toString(),
                description: `${planName} Plan - ${selectedDuration === "yearly" ? "Annual" : "Monthly"} Subscription`
            }).toString();
            
            // Add a small delay to allow subscription refresh to complete
            // This helps prevent state issues with the payment page
            setTimeout(() => {
                // Navigate to payment page with query parameters
                router.push(`/payment?${queryParams}`);
            }, 300);
        } catch (error) {
            console.error("Error redirecting to payment:", error);
            // Try direct navigation even if there was an error
            const amount = selectedDuration === "yearly" 
                ? calculateTotalPrice(selectedPlan, "yearly") 
                : prices.monthly[selectedPlan];
            
            const planName = plans[selectedPlan].name;
            const queryParams = new URLSearchParams({
                plan: selectedPlan,
                duration: selectedDuration,
                amount: amount.toString(),
                description: `${planName} Plan - ${selectedDuration === "yearly" ? "Annual" : "Monthly"} Subscription`
            }).toString();
            
            router.push(`/payment?${queryParams}`);
        }
    };

    return (
        <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h1 className="text-xl font-medium text-gray-900">Upgrade Plan</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/billing-history" className="flex-1 sm:flex-auto">
                            <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-sm text-gray-600 hover:bg-gray-100">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                Billing History
                            </Button>
                        </Link>
                        <div className="flex-1 sm:flex-auto">
                            <PaymentMethodsSheet />
                        </div>
                    </div>
                </div>
                <p className="text-gray-500 text-xs mt-2">Upgrade your plan to get more features and longer protection.</p>
            </div>

            {/* Subscription Status Message */}
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gray-50 border-0 rounded-lg">
                {isFreePlan() ? (
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Star className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">You're currently on the Free Plan</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Upgrade now to unlock premium features including multiple device connections, 
                                faster servers, and advanced security features.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">Download apps for all platforms</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">Up to 5 simultaneous device connections</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">Premium servers with faster speeds</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            currentPlan.type === 'premium' 
                                ? 'bg-gradient-to-r from-purple-100 to-indigo-100' 
                                : 'bg-gradient-to-r from-emerald-100 to-teal-100'
                        }`}>
                            <Shield className={`h-6 w-6 ${
                                currentPlan.type === 'premium' 
                                    ? 'text-indigo-600' 
                                    : 'text-emerald-600'
                            }`} />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Your current plan: {currentPlanDisplay}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                You already have access to premium features. You can upgrade or change your plan below.
                            </p>
                            <div className="flex items-center">
                                <Badge className={`mr-3 ${
                                    currentPlan.type === 'premium' 
                                        ? 'bg-indigo-100 text-indigo-800' 
                                        : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                    ACTIVE
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    {currentBillingCycle ? `${currentBillingCycle.charAt(0).toUpperCase() + currentBillingCycle.slice(1)} billing` : 'Your plan'} 
                                    - selection is highlighted below
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Current Plan Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Current Billing Cycle</div>
                    <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                        <span className="text-sm font-medium">{currentBillingCycle ? 
                            currentBillingCycle.charAt(0).toUpperCase() + currentBillingCycle.slice(1) : 
                            "Monthly"}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Current Plan Type</div>
                    <div className="flex items-center">
                        <Package className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                        <span className="text-sm font-medium">{currentPlanDisplay}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Connected Add-ons</div>
                    <div className="flex items-center">
                        <Zap className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                        <span className="text-sm font-medium">Port Forwarding, CREST VPN</span>
                    </div>
                </div>
            </div>

            {/* Upgrade Offer - Only show for free plans */}
            {isFreePlan() && (
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-center py-2 px-4 rounded-t-lg text-sm font-medium">
                        Special Upgrade Offer!
                    </div>
                    <div className="bg-white border-x border-b border-gray-200 rounded-b-sm p-4 sm:p-6 text-center shadow-sm">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Save up to PKR 2,400 with yearly plans</h2>
                        <p className="text-gray-600 text-sm">**Choose a yearly plan for the best value**</p>
                    </div>
                </div>
            )}
            
            {/* Plan Duration Selection */}
            <div className="flex justify-center mb-6 sm:mb-8">
                <div className="inline-flex bg-gray-100 rounded-full p-1.5 w-full sm:w-auto justify-between">
                    {["monthly", "yearly"].map((duration) => (
                        <button
                            key={duration}
                            onClick={() => setSelectedDuration(duration as "yearly" | "monthly")}
                            className={`py-2 rounded-full text-xs font-medium transition-all duration-300 w-[48%] sm:w-auto sm:px-4 ${
                                selectedDuration === duration ? "bg-white shadow-md text-gray-900" : "text-gray-600"
                            }`}
                        >
                            {duration === "yearly"
                                ? "Yearly Billing"
                                : "Monthly Billing"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plan Selection - Stacked on mobile, side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                {/* Individual Plan Card */}
                <div className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
                    selectedPlan === "individual"
                        ? "border-emerald-500 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:border-emerald-200"
                }`}>
                    <div className="bg-white p-4 sm:p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                {selectedDuration === "yearly" && (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-2">
                                        Save PKR {calculateYearlySavings("individual")}
                                    </Badge>
                                )}
                                <h3 className="text-lg font-medium text-gray-900">{plans.individual.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{plans.individual.description}</p>
                            </div>
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    selectedPlan === "individual" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                }`}
                                onClick={() => setSelectedPlan("individual")}
                            >
                                {selectedPlan === "individual" && <Check className="h-3 w-3 text-white" />}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">PKR {prices[selectedDuration].individual}</span>
                                <span className="text-gray-500 ml-1 text-sm">/month</span>
                            </div>
                            {selectedDuration === "yearly" && (
                                <div className="text-xs text-emerald-600 font-medium mt-1">
                                    Billed as PKR {calculateTotalPrice("individual", "yearly")} per year
                                </div>
                            )}
                        </div>

                        <div className="space-y-2.5 mb-6">
                            {plans.individual.features.map((feature, index) => (
                                <div key={index} className="flex items-start">
                                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{feature.name}</p>
                                        <p className="text-xs text-gray-500">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className={`w-full ${
                                selectedPlan === "individual"
                                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-lg"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedPlan("individual")}
                            disabled={isPlanDisabled("individual")}
                        >
                            {selectedPlan === "individual" && currentPlan.type === "individual" && isSameCycle 
                                ? `Current ${currentBillingCycle} Plan` 
                                : selectedPlan === "individual" ? "Selected" : "Select Plan"}
                        </Button>

                        <div className="text-xs text-gray-500 mt-3 text-center">
                            Next renewal on {getExpiryDate(selectedDuration)}
                        </div>
                    </div>
                </div>

                {/* Basic Plan Card */}
                <div className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
                    selectedPlan === "basic"
                        ? "border-emerald-500 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:border-emerald-200"
                }`}>
                    <div className="bg-white p-4 sm:p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                {selectedDuration === "yearly" && (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-2">
                                        Save PKR {calculateYearlySavings("basic")}
                                    </Badge>
                                )}
                                <h3 className="text-lg font-medium text-gray-900">{plans.basic.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{plans.basic.description}</p>
                            </div>
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    selectedPlan === "basic" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                }`}
                                onClick={() => setSelectedPlan("basic")}
                            >
                                {selectedPlan === "basic" && <Check className="h-3 w-3 text-white" />}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">PKR {prices[selectedDuration].basic}</span>
                                <span className="text-gray-500 ml-1 text-sm">/month</span>
                            </div>
                            {selectedDuration === "yearly" && (
                                <div className="text-xs text-emerald-600 font-medium mt-1">
                                    Billed as PKR {calculateTotalPrice("basic", "yearly")} per year
                                </div>
                            )}
                        </div>

                        <div className="space-y-2.5 mb-6">
                            {plans.basic.features.map((feature, index) => (
                                <div key={index} className="flex items-start">
                                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{feature.name}</p>
                                        <p className="text-xs text-gray-500">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className={`w-full ${
                                selectedPlan === "basic"
                                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedPlan("basic")}
                            disabled={isPlanDisabled("basic")}
                        >
                            {selectedPlan === "basic" && currentPlan.type === "basic" && isSameCycle 
                                ? `Current ${currentBillingCycle} Plan` 
                                : selectedPlan === "basic" ? "Selected" : "Select Plan"}
                        </Button>

                        <div className="text-xs text-gray-500 mt-3 text-center">
                            Next renewal on {getExpiryDate(selectedDuration)}
                        </div>
                    </div>
                </div>

                {/* Premium Plan Card */}
                <div className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
                    selectedPlan === "premium"
                        ? "border-emerald-500 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:border-emerald-200"
                }`}>
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white text-center py-1.5 text-xs font-medium rounded-t-lg">
                        MOST POPULAR
                    </div>
                    <div className="bg-white p-4 sm:p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                {selectedDuration === "yearly" && (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-2">
                                        Save PKR {calculateYearlySavings("premium")}
                                    </Badge>
                                )}
                                <h3 className="text-lg font-medium text-gray-900">{plans.premium.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{plans.premium.description}</p>
                            </div>
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    selectedPlan === "premium" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                }`}
                                onClick={() => setSelectedPlan("premium")}
                            >
                                {selectedPlan === "premium" && <Check className="h-3 w-3 text-white" />}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">PKR {prices[selectedDuration].premium}</span>
                                <span className="text-gray-500 ml-1 text-sm">/month</span>
                            </div>
                            {selectedDuration === "yearly" && (
                                <div className="text-xs text-emerald-600 font-medium mt-1">
                                    Billed as PKR {calculateTotalPrice("premium", "yearly")} per year
                                </div>
                            )}
                        </div>

                        <div className="space-y-2.5 mb-6">
                            {plans.premium.features.map((feature, index) => (
                                <div key={index} className="flex items-start">
                                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{feature.name}</p>
                                        <p className="text-xs text-gray-500">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className={`w-full ${
                                selectedPlan === "premium"
                                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-lg"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedPlan("premium")}
                            disabled={isPlanDisabled("premium")}
                        >
                            {selectedPlan === "premium" && currentPlan.type === "premium" && isSameCycle 
                                ? `Current ${currentBillingCycle} Plan` 
                                : selectedPlan === "premium" ? "Selected" : "Select Plan"}
                        </Button>

                        <div className="text-xs text-gray-500 mt-3 text-center">
                            Next renewal on {getExpiryDate(selectedDuration)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="bg-gray-50 p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Total Amount</p>
                        <p className="text-xs text-gray-500">
                            {selectedDuration === "yearly" ? "Annual" : "Monthly"} billing for {plans[selectedPlan].name} plan
                        </p>
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                        PKR {selectedDuration === "yearly" 
                            ? calculateTotalPrice(selectedPlan, "yearly") 
                            : prices.monthly[selectedPlan]}
                    </div>
                </div>
                
                <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 sm:py-6"
                    onClick={handlePaymentRedirect}
                    disabled={currentPlan.type === selectedPlan && isSameCycle}
                >
                    {currentPlan.type === selectedPlan && isSameCycle 
                        ? `Current ${currentBillingCycle} Plan - Cannot Upgrade` 
                        : "Proceed to Payment"}
                </Button>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                    Your subscription includes a 30-day money-back guarantee
                </p>
            </div>
        </div>
    )
}
