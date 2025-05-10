"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { requestPasswordReset } from "../utils/profileApi"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowLeft, AlertCircle, Check } from "lucide-react"
import { Loading } from "@/components/ui/loading"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Email is required")
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await requestPasswordReset(email)
      
      setSuccess(response.message || "Password reset link sent successfully. Please check your email.")
      toast.success("Password reset link sent successfully")
      
      // Clear form
      setEmail("")
    } catch (err: any) {
      setError(err.message || "Failed to send password reset link")
      toast.error(`Error: ${err.message || "Failed to send password reset link"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-emerald-700">{success}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loading size={20} color="#FFFFFF" text="" inline className="mr-2" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
