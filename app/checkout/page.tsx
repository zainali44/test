"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, CreditCard, Check, ChevronRight, ArrowLeft, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get plan details from URL params
  const planName = searchParams?.get("plan") || "Standard"
  const planDuration = searchParams?.get("duration") || "2-year"
  const planPrice = Number.parseFloat(searchParams?.get("price") || "109.95")
  const originalPrice = Number.parseFloat(searchParams?.get("originalPrice") || "598.50")
  const discount = Number.parseInt(searchParams?.get("discount") || "82")
  const monthlyRate = searchParams?.get("monthlyRate") || "$3.66/mo"

  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [activePaymentMethod, setActivePaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [showCouponField, setShowCouponField] = useState(false)

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handlePaymentMethodChange = (method: string) => {
    setActivePaymentMethod(method)
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (activePaymentMethod === "card") {
      if (!cardNumber.replace(/\s/g, "")) {
        newErrors.cardNumber = "Card number is required"
      } else if (cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "Please enter a valid card number"
      }

      if (!cardHolder) {
        newErrors.cardHolder = "Cardholder name is required"
      }

      if (!expiry) {
        newErrors.expiry = "Expiry date is required"
      } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        newErrors.expiry = "Please use MM/YY format"
      }

      if (!cvv) {
        newErrors.cvv = "CVV is required"
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = "Please enter a valid CVV"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2)
        window.scrollTo(0, 0)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 2) {
      if (validateStep2()) {
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
          setIsSubmitting(false)
          setShowSuccess(true)
        }, 1500)
      }
    }
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Format with spaces every 4 digits
    let formatted = ""
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " "
      }
      formatted += digits[i]
    }

    return formatted.substring(0, 19) // Limit to 16 digits + 3 spaces
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const formatExpiry = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Format as MM/YY
    if (digits.length <= 2) {
      return digits
    }

    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    setExpiry(formatted)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4)
    setCvv(value)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-3xl mx-auto pt-32 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your {planName} plan is now active. We've sent a confirmation email to{" "}
              {email}.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">
                  {planName} ({planDuration})
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount paid:</span>
                <span className="font-medium">${planPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment method:</span>
                <span className="font-medium">Credit Card (•••• {cardNumber.slice(-4)})</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                className="bg-purple-700 hover:bg-purple-800 text-white"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700" onClick={() => router.push("/")}>
                Return to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40" style={{ top: "24px" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-700" />
            <span className="font-bold text-lg text-purple-700">CREST VPN</span>
          </Link>

          <div className="text-sm text-gray-500">Secure Checkout</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto pt-32 pb-20 px-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to pricing</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              {step === 1 ? "1" : <Check className="h-4 w-4 text-white" />}
            </div>
            <div className="h-px w-4 bg-gray-300"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                step === 2 ? "bg-purple-700 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left side - Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h1 className="text-2xl font-bold mb-6">
                {step === 1 ? "Create your account" : "Select your payment method"}
              </h1>

              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Your email address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-4 h-12 text-base ${errors.email ? "border-red-500" 
                          : ""}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Set your password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="8 characters min"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full p-4 h-12 text-base pr-12 ${errors.password ? "border-red-500" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="text-sm text-gray-600">
                      By submitting this form you agree to our{" "}
                      <a href="#" className="text-purple-700 hover:underline">
                        Terms of service
                      </a>
                      ,{" "}
                      <a href="#" className="text-purple-700 hover:underline">
                        Renewal Prices
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-purple-700 hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </div>

                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white py-5 rounded-lg text-base flex items-center justify-center gap-2"
                    >
                      <span>Continue to payment</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto pb-1 gap-2">
                      <button
                        type="button"
                        className={`flex items-center justify-center px-4 py-3 border-b-2 whitespace-nowrap ${
                          activePaymentMethod === "card"
                            ? "border-purple-700 text-purple-700"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => handlePaymentMethodChange("card")}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>Credit Card</span>
                      </button>
                      <button
                        type="button"
                        className={`flex items-center justify-center px-4 py-3 border-b-2 whitespace-nowrap ${
                          activePaymentMethod === "paypal"
                            ? "border-purple-700 text-purple-700"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => handlePaymentMethodChange("paypal")}
                      >
                        <span>PayPal</span>
                      </button>
                      <button
                        type="button"
                        className={`flex items-center justify-center px-4 py-3 border-b-2 whitespace-nowrap ${
                          activePaymentMethod === "pay"
                            ? "border-purple-700 text-purple-700"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => handlePaymentMethodChange("pay")}
                      >
                        <span>Google Pay</span>
                      </button>
                      <button
                        type="button"
                        className={`flex items-center justify-center px-4 py-3 border-b-2 whitespace-nowrap ${
                          activePaymentMethod === "crypto"
                            ? "border-purple-700 text-purple-700"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => handlePaymentMethodChange("crypto")}
                      >
                        <span>Crypto</span>
                      </button>
                    </div>

                    {activePaymentMethod === "card" && (
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card number
                          </label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              className={`w-full p-4 h-12 text-base pl-12 ${errors.cardNumber ? "border-red-500" : ""}`}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                            <div className="flex space-x-1">
                                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                                    <path d="M9.3 11.2H7.1L8.7 4.8H10.9L9.3 11.2ZM14.9 5C14.5 4.9 14.1 4.8 13.6 4.8C11.8 4.8 10.5 5.8 10.5 7.2C10.5 8.2 11.4 8.8 12.1 9.1C12.8 9.4 13 9.6 13 9.9C13 10.3 12.5 10.5 12 10.5C11.4 10.5 10.7 10.4 10.1 10.1L9.8 10L9.5 11.8C10 12 10.8 12.1 11.7 12.1C13.6 12.1 14.9 11.1 14.9 9.6C14.9 8.7 14.3 8.1 13.3 7.7C12.7 7.4 12.3 7.2 12.3 6.9C12.3 6.6 12.6 6.3 13.3 6.3C13.9 6.3 14.4 6.4 14.7 6.5L14.9 6.6L15.2 4.9L14.9 5ZM19.4 4.8H17.7C17.3 4.8 17 4.9 16.8 5.3L14.5 11.2H16.7L17.1 10.1H19.5L19.7 11.2H21.7L20.1 4.8H19.4ZM17.6 8.7L18.4 6.6L18.8 8.7H17.6Z" fill="white"/>
                                </svg>
                                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="24" height="16" rx="2" fill="#EB001B"/>
                                    <circle cx="8" cy="8" r="5" fill="#FF5F00"/>
                                    <circle cx="16" cy="8" r="5" fill="#F79E1B"/>
                                </svg>
                                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="24" height="16" rx="2" fill="#006FCF"/>
                                    <path d="M12 4L13.5 7.5H10.5L12 4ZM12 12L10.5 8.5H13.5L12 12Z" fill="white"/>
                                    <path d="M4 4H6.5L8 8.5L9.5 4H12L9 12H7L4 4ZM15 4H20V5.5H16.5V7H19.5V8.5H16.5V10H20V11.5H15V4Z" fill="white"/>
                                </svg>
                                </div>
                            </div>

                          </div>
                          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div>
                          <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder name
                          </label>
                          <Input
                            id="cardHolder"
                            type="text"
                            placeholder="Name on card"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className={`w-full p-4 h-12 text-base ${errors.cardHolder ? "border-red-500" : ""}`}
                          />
                          {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry date
                            </label>
                            <Input
                              id="expiry"
                              type="text"
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={handleExpiryChange}
                              className={`w-full p-4 h-12 text-base ${errors.expiry ? "border-red-500" : ""}`}
                              maxLength={5}
                            />
                            {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                          </div>
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <Input
                              id="cvv"
                              type="text"
                              placeholder="123"
                              value={cvv}
                              onChange={handleCvvChange}
                              className={`w-full p-4 h-12 text-base ${errors.cvv ? "border-red-500" : ""}`}
                              maxLength={4}
                            />
                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-5 rounded-lg text-base"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <span>Pay ${planPrice.toFixed(2)}</span>
                          )}
                        </Button>
                      </div>
                    )}

                    {activePaymentMethod !== "card" && (
                      <div className="bg-gray-50 p-6 rounded-lg h-64 flex items-center justify-center">
                        <p className="text-gray-500">
                          {activePaymentMethod === "paypal"
                            ? "PayPal"
                            : activePaymentMethod === "pay"
                              ? "Google Pay"
                              : "Cryptocurrency"}{" "}
                          payment option will be available soon.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Right side - Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{planName}</h3>
                    <p className="text-sm text-gray-600">
                      {planDuration} plan ({monthlyRate})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="line-through text-gray-500 text-sm">${originalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-yellow-50 rounded-full px-3 py-1 mb-2">
                  <span className="text-xs font-medium text-yellow-800">Save {discount}%</span>
                  <span className="text-xs text-yellow-800">+6 months</span>
                </div>

                <div className="text-right font-bold">${planPrice.toFixed(2)}</div>
              </div>

              {showCouponField ? (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="text-sm h-9"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => setShowCouponField(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <button
                    className="text-purple-700 hover:text-purple-800 text-sm"
                    onClick={() => setShowCouponField(true)}
                  >
                    Got a coupon code?
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 mb-6">
                <span className="font-medium">Total</span>
                <span className="font-bold text-xl">${planPrice.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">31</div>
                <span>Day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
