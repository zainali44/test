"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, Users, Lock } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
// import IpStatusBanner from "@/components/ip-status-banner"

type BillingCycle = "monthly" | "annual"
type PlanDuration = "5-year" | "2-year" | "1-year" | "monthly"

export default function PricingPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<PlanDuration>("5-year")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual")

  // Original prices (monthly)
  const originalPrices = {
    max: 19.95,
    plus: 15.95,
    standard: 12.95,
  }

  // Discount percentages
  const discounts = {
    "5-year": 0.83,
    "2-year": 0.77,
    "1-year": 0.65,
    monthly: 0,
  }

  // Calculate monthly price
  const calculateMonthlyPrice = (originalPrice: number, planType: PlanDuration) => {
    const discountedPrice = originalPrice * (1 - discounts[planType])
    const months = planType === "5-year" ? 60 : planType === "2-year" ? 24 : planType === "1-year" ? 12 : 1
    return (discountedPrice / months).toFixed(2)
  }

  // Calculate total price
  const calculateTotalPrice = (originalPrice: number, planType: PlanDuration) => {
    const discountedPrice = originalPrice * (1 - discounts[planType])
    const months = planType === "5-year" ? 60 : planType === "2-year" ? 24 : planType === "1-year" ? 12 : 1
    return Number.parseFloat((discountedPrice * (months / 12)).toFixed(2))
  }

  const handlePlanSelect = (plan: PlanDuration) => {
    setSelectedPlan(plan)
  }

  const handleBillingCycleChange = (cycle: BillingCycle) => {
    setBillingCycle(cycle)
  }

  const handleCheckout = (planName: string, originalPrice: number) => {
    const totalPrice = calculateTotalPrice(originalPrice, selectedPlan)
    const discountPercent = Math.round(discounts[selectedPlan] * 100)
    const monthlyRate = `$${calculateMonthlyPrice(originalPrice, selectedPlan)}/mo`
    const originalPriceTotal = Number.parseFloat((originalPrice * (selectedPlan === "monthly" ? 1 : 24)).toFixed(2))

    // Navigate to checkout page with plan details
    router.push(
      `/checkout?plan=${planName}&duration=${selectedPlan}&price=${totalPrice}&originalPrice=${originalPriceTotal}&discount=${discountPercent}&monthlyRate=${monthlyRate}`,
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* <IpStatusBanner /> */}
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hexagonal Background Pattern */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <polygon
                  points="25,0 50,14.4 50,43.4 25,57.8 0,43.4 0,14.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Choose a plan for your online freedom</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              No matter what level of security you need, we've got you covered with the best VPN service for any
              requirement.
            </p>
          </motion.div>

          {/* Plan Duration Tabs */}
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
                onClick={() => handleBillingCycleChange("annual")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  billingCycle === "annual" ? "bg-white shadow-md text-gray-900" : "text-gray-600"
                }`}
              >
                <span>Annual</span>
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">save 25%</span>
              </button>
            </div>
          </motion.div>

          {/* Plan Selection Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex bg-gray-100 rounded-full p-1.5">
              {["5-year", "2-year", "1-year", "monthly"].map((plan) => (
                <button
                  key={plan}
                  onClick={() => handlePlanSelect(plan as PlanDuration)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    selectedPlan === plan ? "bg-white shadow-md text-gray-900" : "text-gray-600"
                  }`}
                >
                  {plan === "5-year"
                    ? "5-year plan"
                    : plan === "2-year"
                      ? "2-year plan"
                      : plan === "1-year"
                        ? "1-year plan"
                        : "Monthly plan"}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Standard Plan */}
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
                <h3 className="text-xl font-bold mb-2">Standard</h3>
                <p className="text-gray-600 text-sm mb-6">Basic protection for everyday browsing and streaming.</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">$</span>
                  <span className="text-5xl font-bold text-gray-900">
                    {calculateMonthlyPrice(originalPrices.standard, selectedPlan).split(".")[0]}
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    .{calculateMonthlyPrice(originalPrices.standard, selectedPlan).split(".")[1]}
                  </span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Full featured faster VPN</p>
                      <p className="text-xs text-gray-500">Secure connection with high-speed servers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Tracker Blocker</p>
                      <p className="text-xs text-gray-500">Block unwanted trackers and ads</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Up to 3 devices</p>
                      <p className="text-xs text-gray-500">Connect multiple devices simultaneously</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-6 rounded-xl text-sm"
                  onClick={() => handleCheckout("Standard", originalPrices.standard)}
                >
                  Get started
                </Button>
              </div>
            </motion.div>

            {/* Plus Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative"
            >
              <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Most popular
              </div>
              <div className="p-8">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Plus</h3>
                <p className="text-gray-600 text-sm mb-6">Enhanced protection with additional security features.</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">$</span>
                  <span className="text-5xl font-bold text-gray-900">
                    {calculateMonthlyPrice(originalPrices.plus, selectedPlan).split(".")[0]}
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    .{calculateMonthlyPrice(originalPrices.plus, selectedPlan).split(".")[1]}
                  </span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Full featured faster VPN</p>
                      <p className="text-xs text-gray-500">Secure connection with high-speed servers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Tracker Blocker</p>
                      <p className="text-xs text-gray-500">Block unwanted trackers and ads</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Secure Password Manager</p>
                      <p className="text-xs text-gray-500">Store and manage your passwords securely</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Up to 5 devices</p>
                      <p className="text-xs text-gray-500">Connect multiple devices simultaneously</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-900 hover:bg-purple-800 text-white py-6 rounded-xl text-sm"
                  onClick={() => handleCheckout("Plus", originalPrices.plus)}
                >
                  Get started
                </Button>
              </div>
            </motion.div>

            {/* Max Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-8">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Max</h3>
                <p className="text-gray-600 text-sm mb-6">Complete protection with all premium features included.</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">$</span>
                  <span className="text-5xl font-bold text-gray-900">
                    {calculateMonthlyPrice(originalPrices.max, selectedPlan).split(".")[0]}
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    .{calculateMonthlyPrice(originalPrices.max, selectedPlan).split(".")[1]}
                  </span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Full featured faster VPN</p>
                      <p className="text-xs text-gray-500">Secure connection with high-speed servers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Tracker Blocker</p>
                      <p className="text-xs text-gray-500">Block unwanted trackers and ads</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Secure Password Manager</p>
                      <p className="text-xs text-gray-500">Store and manage your passwords securely</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Remove My Data</p>
                      <p className="text-xs text-gray-500">Remove your personal data from data brokers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Dark Web Monitoring</p>
                      <p className="text-xs text-gray-500">Get alerts if your data appears on the dark web</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-6 rounded-xl text-sm"
                  onClick={() => handleCheckout("Max", originalPrices.max)}
                >
                  Get started
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Teams Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-16 p-8 max-w-3xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-indigo-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Teams</h3>
                <p className="text-gray-600 text-sm mb-6">Perfect for design teams, agencies and startups.</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">$</span>
                  <span className="text-5xl font-bold text-gray-900">5.45</span>
                  <span className="text-gray-500 ml-1">/user/month</span>
                </div>
              </div>

              <div className="md:w-1/2 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Manage up to 1000 accounts</p>
                    <p className="text-xs text-gray-500">Scale your team security as needed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Smooth & Centralized billing</p>
                    <p className="text-xs text-gray-500">One invoice for all your team members</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Dedicated account manager</p>
                    <p className="text-xs text-gray-500">Get personalized support for your team</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl text-sm mt-4"
                  onClick={() => handleCheckout("Teams", 5.45)}
                >
                  Get Teams Plan
                </Button>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-6">Our support team is here to help you 24/7. Contact us anytime.</p>
            <Button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-5 px-8 rounded-xl text-sm">
              Contact Support
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
