"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, Users, Lock, ArrowRight, MinusCircle, PlusCircle, DollarSign, Globe } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/app/contexts/auth-context"
// import IpStatusBanner from "@/components/ip-status-banner"

type BillingCycle = "monthly" | "yearly"

export default function PricingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Calculate yearly savings
  const calculateYearlySavings = (plan: "individual" | "basic" | "premium") => {
    const monthlyTotal = prices.monthly[plan] * 12
    const yearlyTotal = prices.yearly[plan] * 12
    return monthlyTotal - yearlyTotal
  }

  // Calculate yearly total price
  const calculateYearlyTotal = (plan: "individual" | "basic" | "premium") => {
    return prices.yearly[plan] * 12
  }

  const handleBillingCycleChange = (cycle: BillingCycle) => {
    setBillingCycle(cycle)
  }

  const handleCheckout = (planName: string, plan: "individual" | "basic" | "premium") => {
    // Calculate pricing information
    const price = billingCycle === "yearly" ? prices.yearly[plan] : prices.monthly[plan]
    const monthlyRate = `PKR ${price}/mo`
    const duration = billingCycle
    const totalPrice = billingCycle === "yearly" ? price * 12 : price
    const savings = billingCycle === "yearly" ? calculateYearlySavings(plan) : 0
    
    // Create plan details to store
    const planDetails = {
      plan: planName,
      duration: duration,
      price: totalPrice,
      monthlyRate: monthlyRate,
      savings: savings
    }
    
    // Store plan details in localStorage for later retrieval
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPlan', JSON.stringify(planDetails))
    }
    
    // Check if user is logged in
    if (!mounted || loading) {
      return // Wait for auth to initialize
    }
    
    if (!user) {
      // Not logged in - redirect to login page
      router.push('/login?redirect=checkout')
    } else {
      // User is logged in - proceed with checkout
      router.push(
        `/checkout?plan=${planName}&duration=${duration}&price=${totalPrice}&monthlyRate=${monthlyRate}&savings=${savings}`,
      )
    }
  }

  const handleTeamCheckout = () => {
    const basePrice = 100 // Per user price in PKR
    const totalPrice = basePrice * 5
    const monthlyRate = `PKR${basePrice}/user/mo`
    
    // Store team plan details
    const teamPlanDetails = {
      plan: 'Teams',
      teamMembers: 5,
      price: totalPrice,
      monthlyRate: monthlyRate
    }
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPlan', JSON.stringify(teamPlanDetails))
    }
    
    // Check if user is logged in
    if (!mounted || loading) {
      return // Wait for auth to initialize
    }
    
    if (!user) {
      // Not logged in - redirect to login page
      router.push('/login?redirect=checkout')
    } else {
      // Navigate to checkout page with team plan details
      router.push(
        `/checkout?plan=Teams&teamMembers=5&price=${totalPrice}&monthlyRate=${monthlyRate}`,
      )
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* <IpStatusBanner /> */}
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Choose the plan that works best for you. All plans include a 30-day money-back guarantee.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex bg-gray-100 rounded-full p-1.5">
              <button
                onClick={() => handleBillingCycleChange("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingCycle === "monthly" ? "bg-white shadow-md text-gray-900" : "text-gray-600"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleBillingCycleChange("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  billingCycle === "yearly" ? "bg-white shadow-md text-gray-900" : "text-gray-600"
                }`}
              >
                <span>Yearly</span>
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">save up to 20%</span>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Individual Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-8">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Individual</h3>
                <p className="text-gray-600 text-sm mb-6">Perfect for personal use with 1 device.</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">PKR</span>
                  <span className="text-5xl font-bold text-gray-900">{prices[billingCycle].individual}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                
                {billingCycle === "yearly" && (
                  <div className="mb-4 text-sm text-emerald-600">
                    Billed annually: PKR {calculateYearlyTotal("individual")}
                    <br />
                    <span className="font-medium">Save PKR {calculateYearlySavings("individual")}</span>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">1 Device Connection</p>
                      <p className="text-xs text-gray-500">Connect a single device</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Unlimited Data</p>
                      <p className="text-xs text-gray-500">No bandwidth restrictions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Standard Servers</p>
                      <p className="text-xs text-gray-500">Access to all standard servers</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 rounded-xl text-sm"
                  onClick={() => handleCheckout("Individual", "individual")}
                >
                  Get started
                </Button>
              </div>
            </motion.div>

            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-8">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <p className="text-gray-600 text-sm mb-6">Great for couples or dual-device users.</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">PKR</span>
                  <span className="text-5xl font-bold text-gray-900">{prices[billingCycle].basic}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                
                {billingCycle === "yearly" && (
                  <div className="mb-4 text-sm text-emerald-600">
                    Billed annually: PKR {calculateYearlyTotal("basic")}
                    <br />
                    <span className="font-medium">Save PKR {calculateYearlySavings("basic")}</span>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">2 Device Connections</p>
                      <p className="text-xs text-gray-500">Connect two devices at once</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Unlimited Data</p>
                      <p className="text-xs text-gray-500">No bandwidth restrictions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Premium Servers</p>
                      <p className="text-xs text-gray-500">Access to premium and standard servers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Ad Blocker</p>
                      <p className="text-xs text-gray-500">Block ads and trackers</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 rounded-xl text-sm"
                  onClick={() => handleCheckout("Basic", "basic")}
                >
                  Get started
                </Button>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative"
            >
              <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Most popular
              </div>
              <div className="p-8">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-indigo-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <p className="text-gray-600 text-sm mb-6">Ideal for families or multiple device users.</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">PKR</span>
                  <span className="text-5xl font-bold text-gray-900">{prices[billingCycle].premium}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                
                {billingCycle === "yearly" && (
                  <div className="mb-4 text-sm text-emerald-600">
                    Billed annually: PKR {calculateYearlyTotal("premium")}
                    <br />
                    <span className="font-medium">Save PKR {calculateYearlySavings("premium")}</span>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">5 Device Connections</p>
                      <p className="text-xs text-gray-500">Connect up to five devices at once</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Unlimited Data</p>
                      <p className="text-xs text-gray-500">No bandwidth restrictions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Premium Servers</p>
                      <p className="text-xs text-gray-500">Access to all servers including dedicated IP</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Ad Blocker</p>
                      <p className="text-xs text-gray-500">Enhanced ad and tracker blocking</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Split Tunneling</p>
                      <p className="text-xs text-gray-500">Advanced app routing options</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Advanced Security Features</p>
                      <p className="text-xs text-gray-500">Additional encryption and protection</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Priority Support</p>
                      <p className="text-xs text-gray-500">24/7 priority customer support</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 rounded-xl text-sm"
                  onClick={() => handleCheckout("Premium", "premium")}
                >
                  Get started
                </Button>
              </div>
            </motion.div>
          </div>

          {/* What's Included Section */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">All Plans Include</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">AES-256 Encryption</h3>
                <p className="text-gray-600 text-sm">
                  Military-grade encryption ensures your data remains secure and private.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Global Network</h3>
                <p className="text-gray-600 text-sm">
                  Access servers in multiple countries for complete internet freedom.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No-Logs Policy</h3>
                <p className="text-gray-600 text-sm">
                  We never monitor, record, or store your browsing activities.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-red-700" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600 text-sm">
                  Our customer support team is available around the clock to help you.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">What is a VPN and why do I need it?</h3>
                <p className="text-gray-600">
                  A VPN (Virtual Private Network) creates a secure connection between your device and the internet. It
                  encrypts your data and hides your IP address, protecting your privacy and security online.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Can I use the VPN on multiple devices?</h3>
                <p className="text-gray-600">
                  Yes, depending on your plan. The Individual plan allows 1 device, Basic plan allows 2 devices, and the Premium plan allows up to 5 simultaneous connections.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Is there a money-back guarantee?</h3>
                <p className="text-gray-600">
                  Yes, we offer a 30-day money-back guarantee on all plans. If you're not satisfied with our service,
                  you can request a full refund within 30 days of purchase.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How do I get started?</h3>
                <p className="text-gray-600">
                  Simply choose the plan that fits your needs, create an account, and download our app. Our setup wizard
                  will guide you through the installation process, and you'll be protected in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
