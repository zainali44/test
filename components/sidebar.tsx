"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Download, Globe, Home, Lock, Menu, Server, Settings, Shield, User, Wifi, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/hooks/use-sidebar"
import { useAuth } from "@/app/contexts/auth-context"
import { format } from "date-fns"
import { useSubscription } from "@/app/contexts/subscription-context"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { user } = useAuth()
  const { subscription, pageRefreshCount } = useSubscription()
  
  // Extract subscription data from user context
  const getSubscriptionInfo = useCallback(() => {
    // Check for API subscription data from Jotai state
    if (subscription) {
      // Only log in development environment
      if (process.env.NODE_ENV === 'development') {
        // Use console.debug instead of console.log to reduce noise
        console.debug("Subscription data available:", 
          subscription.subscription_id || subscription.plan_id || 'details hidden');
      }
      
      // Check if subscription is wrapped in a data property
      if ((subscription as any).success && (subscription as any).data) {
        const subscriptionData = (subscription as any).data;
        
        // Get plan name from the plan object if available
        if (subscriptionData.plan) {
          const planName = subscriptionData.plan.name 
            ? subscriptionData.plan.name.charAt(0).toUpperCase() + subscriptionData.plan.name.slice(1) + ' Plan'
            : 'Premium Plan';
          
          return {
            planName: planName,
            endDate: subscriptionData.end_date ? new Date(subscriptionData.end_date) : null,
            isFree: subscriptionData.plan.price === "0.00"
          }
        }
        
        // Check if it has Plan object
        if (subscriptionData.Plan) {
          // Capitalize the first letter of the plan name 
          const planName = subscriptionData.Plan.name 
            ? subscriptionData.Plan.name.charAt(0).toUpperCase() + subscriptionData.Plan.name.slice(1) + ' Plan'
            : 'Unknown Plan';
          
          return {
            planName: planName,
            endDate: subscriptionData.end_date ? new Date(subscriptionData.end_date) : null,
            isFree: subscriptionData.Plan.price === "0.00"
          }
        }
        
        // Fallback to plan_id mapping if no plan object
        if (subscriptionData.plan_id) {
          // Map plan IDs to names
          const planNames: Record<number, string> = {
            1: 'Free Plan',
            2: 'Basic Plan',
            3: 'Premium Plan', // Updated from 'Basic Plan' to 'Premium Plan'
          };
          
          return {
            planName: planNames[subscriptionData.plan_id] || 'Premium Plan',
            endDate: subscriptionData.end_date ? new Date(subscriptionData.end_date) : null,
            isFree: subscriptionData.plan_id === 1
          }
        }
      }
      
      // Check if it's a free plan (plan_id=1)
      if ('plan_id' in subscription && subscription.plan_id === 1) {
        return {
          planName: 'Free Plan',
          endDate: null,
          isFree: true
        }
      }
      
      // Handle the case for direct plan object in subscription
      if ('plan' in subscription && subscription.plan) {
        const planName = subscription.plan.name 
          ? subscription.plan.name.charAt(0).toUpperCase() + subscription.plan.name.slice(1) + ' Plan'
          : 'Unknown Plan';
        
        return {
          planName: planName,
          endDate: subscription.end_date ? new Date(subscription.end_date) : null,
          isFree: subscription.plan.price === "0.00"
        }
      }
      
      // Map plan_id to name for direct plan_id property
      if ('plan_id' in subscription) {
        const planNames: Record<number, string> = {
          1: 'Free Plan',
          2: 'Basic Plan',
          3: 'Premium Plan', // Updated from 'Basic Plan' to 'Premium Plan'
        };
        
        return {
          planName: planNames[subscription.plan_id] || 'Premium Plan',
          endDate: subscription.end_date ? new Date(subscription.end_date) : null,
          isFree: subscription.plan_id === 1
        }
      }
      
      // API subscription with Plan object
      if ('Plan' in subscription && subscription.Plan) {
        // Capitalize the first letter of the plan name 
        const planName = subscription.Plan.name 
          ? subscription.Plan.name.charAt(0).toUpperCase() + subscription.Plan.name.slice(1) + ' Plan'
          : 'Unknown Plan';
        
        return {
          planName: planName,
          endDate: subscription.end_date ? new Date(subscription.end_date) : null,
          isFree: subscription.Plan.price === "0.00"
        }
      }
      
      // Check for basic in User object
      if ('User' in subscription && subscription.User && subscription.User.subscription_plan === 'basic') {
        return {
          planName: 'Basic Plan',
          endDate: subscription.end_date || subscription.User.subscription_end_date 
            ? new Date(subscription.end_date || subscription.User.subscription_end_date) 
            : null,
          isFree: false
        }
      }
    }
    
    // If user data includes subscription information
    if (user && 'subscriptions' && Array.isArray(user.subscriptions) && user.subscriptions.length > 0) {
      const activeSubscription = user.subscriptions.find(sub => sub.status === 'active')
      
      if (activeSubscription) {
        // Get plan name directly from the plan object if available
        if (activeSubscription.plan?.name) {
          const planName = activeSubscription.plan.name.charAt(0).toUpperCase() + 
            activeSubscription.plan.name.slice(1) + ' Plan';
          
          return {
            planName: planName,
            endDate: activeSubscription.end_date ? new Date(activeSubscription.end_date) : null,
            isFree: activeSubscription.plan_id === 1 || activeSubscription.plan.price === "0.00"
          }
        }
        
        // Fall back to plan_id mapping
        const planNames: Record<number, string> = {
          1: 'Free Plan',
          2: 'Basic Plan',
          3: 'Premium Plan', // Updated from 'Basic Plan' to 'Premium Plan'
        };
        
        const isFree = activeSubscription.plan_id === 1 || 
                       (activeSubscription.plan?.name?.toLowerCase() === 'free') ||
                       (activeSubscription.plan?.price === "0.00");
        
        return {
          planName: isFree ? 'Free Plan' : (planNames[activeSubscription.plan_id] || 'Premium Plan'),
          endDate: !isFree && activeSubscription.end_date ? new Date(activeSubscription.end_date) : null,
          isFree: isFree
        }
      }
    }
    
    // Default to Free plan if no subscription data is found
    return {
      planName: 'Free Plan',
      endDate: null,
      isFree: true
    }
  }, [subscription, user]);

  const { planName, endDate, isFree } = getSubscriptionInfo();
  const isPremiumPlan = !isFree;

  const navItems = [
    {
      title: "Download",
      href: "/dashboard/downloads",
      icon: Download,
    },
    // {
    //   title: "Manual Configuration",
    //   href: "/dashboard/manual-configuration",
    //   icon: Globe,
    // },
    {
      title: "Subscriptions",
      href: "/dashboard/subscriptions",
      icon: BarChart3,
    },
    {
      title: "Upgrade Plan",
      href: "/dashboard/upgrade",
      icon: Shield,
    },
    {
      title: "Account",
      href: "/dashboard/profile",
      icon: User,
    },
    // {
    //   title: "Settings",
    //   href: "/dashboard/settings",
    //   icon: Settings,
    // },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-100 bg-white transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
        <Link href="/dashboard" className="flex items-center">
          <div className="h-8 w-8 rounded-sm bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center mr-2">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">CREST VPN</span>
        </Link>
        <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleSidebar}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close Sidebar</span>
        </Button>
      </div>
      <div className="sidebar-scroll h-[calc(100vh-4rem)] overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isHovered = hoveredItem === item.title

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-sm px-2 py-2 text-xs transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50",
                  "relative",
                )}
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-emerald-600 to-teal-500" />
                )}
                <item.icon
                  className={cn(
                    "mr-2 h-4 w-4",
                    isActive ? "text-emerald-600" : "text-gray-500 group-hover:text-gray-700",
                  )}
                />
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 px-4">
          <div className="rounded-sm border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center">
              <div className={`h-8 w-8 rounded-sm flex items-center justify-center ${
                isPremiumPlan 
                  ? "bg-gradient-to-r from-amber-500 to-amber-600" 
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
              }`}>
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-gray-900">{planName}</h3>
                {endDate ? (
                  <p className="text-[10px] text-gray-600">Valid until: {format(endDate, 'MMM yyyy')}</p>
                ) : (
                  <p className="text-[10px] text-gray-600">{isFree ? 'Limited features' : 'No expiration'}</p>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Button
                size="sm"
                className={`w-full ${
                  isPremiumPlan 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
                    : "bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
                } text-white text-[10px] h-7 rounded-sm`}
                onClick={() => window.location.href = '/dashboard/upgrade'}
              >
                {isPremiumPlan ? "Manage Subscription" : "Upgrade Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleSidebar}>
      <Menu className="h-5 w-5" />
      <span className="sr-only">Open Sidebar</span>
    </Button>
  )
}
