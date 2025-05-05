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
  const { subscription } = useSubscription()
  
  // Get plan info from subscription data
  const getPlanInfo = () => {
    // Default to Free Plan
    let planName = 'Free Plan';
    let endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    let isFree = true;
    let isPremiumPlan = false;
    
    if (subscription) {
      // Extract plan data from subscription
      const subscriptionData = (subscription as any).data || subscription;
      
      // Get plan_id
      const planId = subscriptionData.plan_id || 
                    (subscriptionData.plan && subscriptionData.plan.plan_id) || 
                    (subscriptionData.Plan && subscriptionData.Plan.plan_id) || 1;
      
      // Get plan name
      if (planId === 1) {
        planName = 'Free Plan';
        isFree = true;
      } else if (planId === 2 || planId === 5) {
        planName = planId === 5 ? 'Individual Plan (Yearly)' : 'Individual Plan';
        isFree = false;
      } else if (planId === 3 || planId === 6) {
        planName = planId === 6 ? 'Basic Plan (Yearly)' : 'Basic Plan';
        isFree = false;
      } else if (planId === 4 || planId === 7) {
        planName = planId === 7 ? 'Premium Plan (Yearly)' : 'Premium Plan';
        isFree = false;
        isPremiumPlan = true;
      }
      
      // Get end date
      const endDateStr = subscriptionData.end_date || 
                        subscriptionData.next_billing_date ||
                        (subscriptionData.plan && subscriptionData.plan.next_billing_date) ||
                        (subscriptionData.Plan && subscriptionData.Plan.next_billing_date);
                        
      if (endDateStr) {
        endDate = new Date(endDateStr);
      }
    }
    
    return { planName, endDate, isFree, isPremiumPlan };
  };
  
  const { planName, endDate, isFree, isPremiumPlan } = getPlanInfo();

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
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[250px] sm:w-[280px] transform border-r border-gray-100 bg-white transition-all duration-300 ease-in-out shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 md:shadow-none",
          className,
        )}
      >
        <div className="flex h-14 md:h-16 items-center justify-between border-b border-gray-100 px-3 sm:px-4">
          <Link href="/dashboard" className="flex items-center">
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-sm bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center mr-2">
              <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium">CREST VPN</span>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden h-8 w-8 p-0" 
            onClick={toggleSidebar}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>
        <div className="sidebar-scroll h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-y-auto py-3 md:py-4 no-scrollbar">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const isHovered = hoveredItem === item.title;
              
              return (
                <Link 
                  key={item.title}
                  href={item.href}
                  onClick={closeSidebar}
                  onMouseEnter={() => setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "flex items-center px-3 py-1.5 md:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 group relative",
                    isActive
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700"
                      : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 transition-transform duration-200",
                      isActive ? "text-emerald-600" : "text-gray-500 group-hover:text-emerald-600",
                      isHovered && !isActive && "scale-110",
                    )}
                  />
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 md:h-8 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-l-sm" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Subscription Info Card */}
          <div className="mt-6 mx-2 p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-gray-100">
            <div className="flex items-center mb-2">
              <Lock className={cn(
                "h-3.5 w-3.5 mr-2",
                isPremiumPlan ? "text-emerald-600" : "text-gray-400"
              )} />
              <span className="text-xs font-medium">{planName}</span>
            </div>
            
            {endDate && (
              <div className="text-xs text-gray-500 mb-2">
                Valid until {format(endDate, 'MMM d, yyyy')}
              </div>
            )}
            
            <Link href="/dashboard/upgrade">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mt-1 text-xs h-7 md:h-8 rounded-md border-emerald-100 text-emerald-700 hover:bg-emerald-50"
              >
                {isPremiumPlan ? 'Manage Plan' : 'Upgrade Now'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar()
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="md:hidden flex items-center justify-center"
      onClick={toggleSidebar}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Open menu</span>
    </Button>
  )
}
