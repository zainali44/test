"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, Edit2, ExternalLink, Lock, Mail, Shield, Upload, X, User, UserCircle, Zap, Settings, CreditCard, Calendar, Copy, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/app/contexts/auth-context"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [emailVerified, setEmailVerified] = useState(true) // Assume email is verified for now
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Check if user has an active subscription
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
    }
  }
  
  const planDetails = getPlanDetails()
  
  // Format date for display
  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const getSubscriptionEndDate = () => {
    if (!activeSubscription || !activeSubscription.end_date) {
      return 'N/A'
    }
    
    return formatDate(activeSubscription.end_date)
  }

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
  
  // Get username from email
  const getUsername = () => {
    if (!user || !user.email) return 'user'
    return user.email.split('@')[0]
  }
  
  const userEmail = user?.email || 'user@example.com'
  const username = getUsername()
  const displayName = user?.name || username
  const planName = planDetails.name
  const isPaid = planDetails.type !== 'Free'
  const subscriptionEndDate = getSubscriptionEndDate()

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-6 pb-20">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Simple CSS confetti effect would go here */}
        </div>
      )}
      
      <div className="flex flex-col space-y-8">
        <div className="relative">
          {/* Background header decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-emerald-600/5 rounded-xl h-32 -z-10 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/10 rounded-full blur-xl"></div>
            <div className="absolute left-20 top-10 w-20 h-20 bg-emerald-600/10 rounded-full blur-lg"></div>
          </div>
          
          <div className="pt-6 pb-12 px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 p-1">
                    <div className="h-full w-full rounded-full overflow-hidden bg-white">
                      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
                        <User className="h-12 w-12" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                    <div className={`rounded-full p-1.5 ${
                      isPaid 
                        ? 'bg-emerald-500' 
                        : 'bg-gray-400'
                    }`}>
                      <Shield className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-500">@{username}</p>
                    <Badge variant="outline" className={`${
                      isPaid 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {planName}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient shadow-md self-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </div>
        </div>

        {!emailVerified && (
          <div className="card-shadow bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="p-6 border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-amber-50/50">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 rounded-full p-2.5 mt-0.5">
                  <Mail className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-amber-800 text-lg">Verify your email address</h3>
                  <p className="text-amber-700 mt-1">For account security, please confirm your email address with the 6-digit verification code we sent to {userEmail}</p>

                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex gap-2">
                      {verificationCode.map((digit, index) => (
                        <Input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          className="w-10 h-12 text-center p-0 text-lg font-medium border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                        />
                      ))}
                    </div>
                    <Button
                      onClick={handleVerifyEmail}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white btn-gradient shadow-sm"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Verify Email
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-amber-700 text-sm">
                    <button className="text-amber-800 hover:text-amber-900 underline underline-offset-2 font-medium">
                      Resend code
                    </button>
                    {" or "}
                    <button className="text-amber-800 hover:text-amber-900 underline underline-offset-2 font-medium">
                      Change email address
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm card-shadow overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-emerald-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle className="h-6 w-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              </div>
              <Badge variant="outline" className={`${
                isPaid 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              } shadow-sm`}>
                <Zap className="h-3 w-3 mr-1" /> {planName}
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Profile Photo</h3>
                <p className="text-xs text-gray-400 mt-1">This will be displayed on your account</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-0.5">
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-full">
                      <User className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-200 shadow-sm">
                    <div className={`rounded-full p-1 ${
                      isPaid 
                        ? 'bg-emerald-500' 
                        : 'bg-gray-400'
                    }`}>
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-gray-600 hover:text-red-600 hover:border-red-200 focus-ring">
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Username */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Username</h3>
                <p className="text-xs text-gray-400 mt-1">Your unique identifier on our platform</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">securevpn.com/{username}</span>
                {isEditing === "username" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue={username}
                      className="w-40 h-8 text-sm border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(null)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 focus-ring"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing("username")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus-ring"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Email Address */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Email Address</h3>
                <p className="text-xs text-gray-400 mt-1">Your contact and login email</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{userEmail}</span>
                {emailVerified && (
                  <Badge variant="outline" className="bg-green-50 text-emerald-700 border-green-200 shadow-sm">
                    <Check className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
                {isEditing === "email" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue={userEmail}
                      className="w-60 h-8 text-sm border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(null)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 focus-ring"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing("email")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus-ring"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Account ID */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Account ID</h3>
                <p className="text-xs text-gray-400 mt-1">Your unique account identifier</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{user?.id || '14'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 focus-ring"
                  onClick={() => navigator.clipboard.writeText(user?.id || '14')}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Subscription Details */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Subscription Plan</h3>
                <p className="text-xs text-gray-400 mt-1">Your current plan and benefits</p>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full ${
                  isPaid 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <span className="text-sm font-medium">{planName}</span>
                </div>
                
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient h-8"
                  asChild
                >
                  <Link href="/dashboard/upgrade">
                    {isPaid ? "Manage Plan" : "Upgrade Plan"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Subscription Status - Show only if user has a subscription */}
            {activeSubscription && (
              <>
                <Separator className="bg-gray-100" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Subscription Status</h3>
                    <p className="text-xs text-gray-400 mt-1">Current status and renewal date</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <Badge variant="outline" className="bg-green-50 text-emerald-700 border-green-200 shadow-sm mb-1">
                        Active
                      </Badge>
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        Renews on: {subscriptionEndDate}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator className="bg-gray-100" />

            {/* Password */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Password</h3>
                <p className="text-xs text-gray-400 mt-1">Manage your account password</p>
              </div>

              <Button
                size="sm"
                className="sm:self-auto self-start bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
              >
                <Lock className="h-4 w-4 mr-2 text-gray-500" />
                Change Password
              </Button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm card-shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Two-Factor Authentication */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-400 mt-1">Add an extra layer of security to your account</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 shadow-sm">
                  Disabled
                </Badge>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient h-8"
                >
                  Enable
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Session Management */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Active Sessions</h3>
                <p className="text-xs text-gray-400 mt-1">Manage your active login sessions</p>
              </div>

              <Button
                size="sm"
                className="sm:self-auto self-start bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
              >
                <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                Manage Sessions
              </Button>
            </div>

            <Separator className="bg-gray-100" />

            {/* Connected Devices */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Connected Devices</h3>
                <p className="text-xs text-gray-400 mt-1">Manage devices connected to your account</p>
              </div>

              <Button
                size="sm"
                className="sm:self-auto self-start bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
              >
                <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                View Devices
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-100 shadow-sm card-shadow overflow-hidden">
          <div className="p-6 border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-red-100 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Delete Account</h3>
                <p className="text-xs text-gray-400 mt-1">Permanently delete your account and all data</p>
              </div>

              <Button
                size="sm"
                className="sm:self-auto self-start bg-white text-red-600 border border-red-200 hover:bg-red-50 shadow-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}