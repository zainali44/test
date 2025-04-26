"use client"

import { useState } from "react"
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

export default function SubscriptionsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [usernameCopied, setUsernameCopied] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Subscription data
  const subscriptionData = {
    billingCycle: "12 Months",
    planType: "Standard",
    accountType: "Individual",
    subscriptionType: "PAID",
    status: "Active",
    multiLoginLimit: 10,
    expiryDate: "Oct 28, 2025",
    daysRemaining: 188,
    paymentMethod: "Coinpayment",
    username: "purevpn0s13959853",
    password: "**************",
  }

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
          >
            Upgrade Plan
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
            <div className="w-8 h-8 rounded-sm bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center mr-3">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-sm font-medium text-gray-900">Standard Plan</h2>
                <Badge variant="outline" className="ml-2 bg-green-50 text-emerald-700 border-0 text-[9px] px-1.5 py-0">
                  Active
                </Badge>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">Expires on {subscriptionData.expiryDate}</p>
            </div>
          </div>
        </div>

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

        {/* Payment Method */}
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
              <span className="text-[8px] font-medium text-gray-700">CP</span>
            </div>
            <span className="text-xs font-medium">{subscriptionData.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Billing History Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900">Billing History</h2>
          <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-gray-900 hover:bg-gray-100 rounded-sm">
            View all
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

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
                <tr>
                  <td className="text-xs px-3 py-2">Oct 28, 2024</td>
                  <td className="text-xs px-3 py-2">Standard Plan - 12 Months</td>
                  <td className="text-xs px-3 py-2">$59.88</td>
                  <td className="text-xs px-3 py-2">
                    <Badge variant="outline" className="bg-green-50 text-emerald-700 border-0 text-[9px] px-1.5 py-0">
                      Paid
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className="text-xs px-3 py-2">Oct 28, 2023</td>
                  <td className="text-xs px-3 py-2">Standard Plan - 12 Months</td>
                  <td className="text-xs px-3 py-2">$59.88</td>
                  <td className="text-xs px-3 py-2">
                    <Badge variant="outline" className="bg-green-50 text-emerald-700 border-0 text-[9px] px-1.5 py-0">
                      Paid
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Special Offer */}
      <div className="mb-8 border border-gray-200 rounded-sm overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-sm bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Upgrade to Premium</h3>
                <p className="text-xs text-gray-600 mt-0.5 max-w-md">
                  Get access to dedicated IP, faster servers, and priority support for just $3.99/month more.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[10px] h-7 px-2.5 rounded-sm"
            >
              Upgrade Now
              <ChevronRight className="h-3 w-3 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Button */}
      <div className="border-t border-gray-200 pt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-gray-200 hover:bg-red-50 text-[10px] h-7 px-2.5 rounded-sm"
          onClick={() => setShowCancelDialog(true)}
        >
          <AlertTriangle className="h-3 w-3 mr-1.5" />
          Cancel subscription
        </Button>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md rounded-sm p-0 border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-medium">Cancel subscription?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-gray-500 mt-1">
                Canceling your subscription will immediately revoke your access to all SecureVPN services. Your
                subscription will remain active until the end of your current billing period on{" "}
                {subscriptionData.expiryDate}.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-4 flex-row justify-end gap-2">
            <AlertDialogCancel className="text-xs h-8 px-3 rounded-sm">Keep subscription</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-xs h-8 px-3 rounded-sm">
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
