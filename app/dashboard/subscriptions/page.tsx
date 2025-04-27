"use client"

import { useState, useEffect } from "react"
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
import Link from "next/link"
import Image from "next/image"

export default function SubscriptionsPage() {
  const { user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [usernameCopied, setUsernameCopied] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Get active subscription from user data
  const getActiveSubscription = () => {
    if (!user || !user.subscriptions || !Array.isArray(user.subscriptions)) {
      return null
    }
    
    return user.subscriptions.find(sub => sub.status === 'active') || null
  }

  const activeSubscription = getActiveSubscription()
  
  // Get plan details
  const getPlanDetails = () => {
    if (!activeSubscription) {
      return {
        name: 'Free Plan',
        type: 'Free',
        accountType: 'Individual',
        multiLoginLimit: 1
      }
    }
    
    const planName = activeSubscription.plan?.name || 'Unknown Plan'
    
    // Map the plan name to types
    let planType = 'Free'
    if (planName.toLowerCase().includes('premium')) {
      planType = 'Premium'
    } else if (planName.toLowerCase().includes('basic')) {
      planType = 'Basic'
    } else if (planName.toLowerCase() !== 'free') {
      planType = 'Standard'
    }
    
    return {
      name: planName,
      type: planType,
      accountType: 'Individual',
      multiLoginLimit: planType === 'Premium' ? 5 : planType === 'Basic' ? 2 : 1
    }
  }
  
  const planDetails = getPlanDetails()
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!activeSubscription || !activeSubscription.end_date) {
      return 0
    }
    
    const endDate = new Date(activeSubscription.end_date)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays > 0 ? diffDays : 0
  }
  
  const daysRemaining = getDaysRemaining()
  
  // Format date for display
  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Subscription data
  const subscriptionData = {
    billingCycle: activeSubscription?.plan?.billing_cycle === "0" ? "Free" : 
                  activeSubscription?.plan?.billing_cycle === "12" ? "12 Months" : "Monthly",
    planType: planDetails.type,
    accountType: planDetails.accountType,
    subscriptionType: activeSubscription?.plan?.price === "0.00" ? "FREE" : "PAID",
    status: activeSubscription?.status || "Inactive",
    multiLoginLimit: planDetails.multiLoginLimit,
    expiryDate: formatDate(activeSubscription?.end_date),
    daysRemaining: daysRemaining,
    paymentMethod: "Credit Card",
    username: user?.email || "user@example.com",
    password: "**************",
  }

  // Sample billing history data - in a real app, this would come from an API
  const billingHistory = activeSubscription ? [
    {
      date: formatDate(activeSubscription.start_date),
      description: `${planDetails.name} - ${subscriptionData.billingCycle}`,
      amount: activeSubscription.plan?.price || "$0.00",
      status: "Paid"
    }
  ] : []

  // VPN add-ons data
  const addOns = [
    { name: "Dedicated IP", status: "locked", isNew: false, icon: Shield },
    { name: "Dedicated Server", status: "locked", isNew: true, icon: Server },
    { name: "Port Forwarding", status: "purchased", isNew: false, icon: Settings },
    { name: "Multi Login", status: "locked", isNew: false, icon: Users },
    { name: "Residential Network", status: "locked", isNew: true, icon: Network },
    { name: "Wireguard", status: "locked", isNew: false, icon: Layers },
  ]

  const copyToClipboard = (text: string, type: "username" | "password") => {
    navigator.clipboard.writeText(text)
    if (type === "username") {
      setUsernameCopied(true)
      setTimeout(() => setUsernameCopied(false), 2000)
    } else {
      setPasswordCopied(true)
      setTimeout(() => setPasswordCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Subscriptions</h1>
          <Button
            size="sm"
            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs h-8 px-3 rounded-sm"
            asChild
          >
            <Link href="/dashboard/upgrade">Upgrade Plan</Link>
          </Button>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          Manage your payment details, plan upgrades, renewals, and VPN passwords.
        </p>
      </div>

      {/* Subscription Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
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

        {subscriptionData.status.toLowerCase() === 'active' && subscriptionData.subscriptionType !== 'FREE' && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-gray-500">{subscriptionData.daysRemaining} days remaining</span>
              <span className="text-[11px] text-gray-500">
                {Math.round((subscriptionData.daysRemaining / 365) * 100)}%
              </span>
            </div>
            <Progress value={(subscriptionData.daysRemaining / 365) * 100} className="h-1 bg-gray-100">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-none" />
            </Progress>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          <div className="bg-gray-50 border border-gray-100 p-3 rounded-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-3.5 w-3.5 text-gray-500 mr-2" />
                <span className="text-[10px] uppercase tracking-wider text-gray-500">Payment Method</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] h-6 px-2 text-gray-900 hover:bg-gray-100 rounded-sm"
              >
                Change
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-4 w-8 bg-gray-200 rounded-sm mr-2 flex items-center justify-center">
                <span className="text-[8px] font-medium text-gray-700">CC</span>
              </div>
              <span className="text-xs font-medium">{subscriptionData.paymentMethod}</span>
            </div>
          </div>
        )}
      </div>

      {/* Billing History Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900">Billing History</h2>
          {billingHistory.length > 0 && (
            <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-gray-900 hover:bg-gray-100 rounded-sm">
              View all
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>

        {billingHistory.length > 0 ? (
          <div className="border border-gray-200 rounded-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-3 py-2">Date</th>
                    <th className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-3 py-2">
                      Description
                    </th>
                    <th className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-3 py-2">Amount</th>
                    <th className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billingHistory.map((item, index) => (
                    <tr key={index}>
                      <td className="text-xs px-3 py-2">{item.date}</td>
                      <td className="text-xs px-3 py-2">{item.description}</td>
                      <td className="text-xs px-3 py-2">{item.amount}</td>
                      <td className="text-xs px-3 py-2">
                        <Badge variant="outline" className="bg-green-50 text-emerald-700 border-0 text-[9px] px-1.5 py-0">
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-sm p-8 text-center">
            <div className="max-w-[200px] h-[140px] mx-auto mb-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Receipt className="h-16 w-16 text-gray-300" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="h-6 w-6 text-gray-400" />
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
        <div className="mb-8 border border-gray-200 rounded-sm overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-sm bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-amber-900">Special Upgrade Offer</h3>
                  <p className="text-xs text-amber-700 mt-0.5">Upgrade now and save up to 50% on yearly plans</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-full h-7"
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

      {/* Account Credentials */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900">Account Credentials</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Use these credentials in the VPN app</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="p-4 space-y-3">
            {/* Username Field */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Username</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 text-gray-500 mr-2" />
                  <span className="text-sm">{subscriptionData.username}</span>
                </div>
                <button
                  className="text-emerald-600 hover:text-emerald-700 text-xs"
                  onClick={() => copyToClipboard(subscriptionData.username, "username")}
                >
                  {usernameCopied ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Copied
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>

            <Separator />

            {/* Password Field */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Password</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="h-3.5 w-3.5 text-gray-500 mr-2" />
                  <span className="text-sm">{showPassword ? "securepassword123" : "••••••••••••••"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Show
                      </>
                    )}
                  </button>
                  <button
                    className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center"
                    onClick={() => copyToClipboard("securepassword123", "password")}
                  >
                    {passwordCopied ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VPN Add-ons Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900">VPN Add-ons</h2>
          <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-gray-900 hover:bg-gray-100 rounded-sm">
            See all
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {addOns.map((addon, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-sm overflow-hidden bg-white relative p-4"
            >
              {addon.isNew && (
                <div className="absolute top-0 right-0">
                  <div className="bg-rose-500 text-white text-[8px] px-2 py-0.5 uppercase tracking-wider">New</div>
                </div>
              )}
              <div className="flex items-center mb-3">
                <div
                  className={`w-8 h-8 rounded-sm flex items-center justify-center mr-3 ${
                    addon.status === "purchased"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-500"
                      : "bg-gray-100"
                  }`}
                >
                  <addon.icon
                    className={`h-4 w-4 ${addon.status === "purchased" ? "text-white" : "text-gray-400"}`}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{addon.name}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {addon.status === "purchased" ? "Active" : "Not Purchased"}
                  </p>
                </div>
              </div>
              <Button
                variant={addon.status === "purchased" ? "default" : "outline"}
                size="sm"
                className={`w-full text-xs h-7 ${
                  addon.status === "purchased"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                    : "text-gray-700"
                }`}
              >
                {addon.status === "purchased" ? "Manage" : "Purchase"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Your Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your subscription at the end of your current billing cycle. You will still have access
              until October 28, 2025.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Keep Subscription</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-xs">Confirm Cancellation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
