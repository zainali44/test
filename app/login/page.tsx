"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loading } from "@/components/ui/loading"
import { Eye, EyeOff, Mail, Lock, PowerCircle, PowerCircleIcon } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/app/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { getAuthToken, verifyToken } from "@/app/utils/auth"
import { toast } from "react-hot-toast"

// Add TypeScript declaration for window._skipAuthChecks
declare global {
  interface Window {
    _skipAuthChecks?: boolean;
  }
}

// Interface for token validation response
interface TokenValidationResponse {
  valid: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(false)
  const { login, logout, loading, user, error } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get('redirect')

  // Function to handle redirects after login - moved up to prevent usage before declaration
  const handlePostLoginRedirect = useCallback(() => {
    if (redirectPath === 'checkout') {
      // Get stored plan details from localStorage
      const storedPlan = localStorage.getItem('selectedPlan')
      
      if (storedPlan) {
        try {
          const planDetails = JSON.parse(storedPlan)
          
          // Build the query string for checkout page
          const queryParams = new URLSearchParams()
          
          if (planDetails.plan === 'Teams') {
            queryParams.append('plan', 'Teams')
            queryParams.append('teamMembers', planDetails.teamMembers.toString())
            queryParams.append('price', planDetails.price.toString())
            queryParams.append('monthlyRate', planDetails.monthlyRate)
          } else {
            queryParams.append('plan', planDetails.plan)
            queryParams.append('duration', planDetails.duration)
            queryParams.append('price', planDetails.price.toString())
            queryParams.append('monthlyRate', planDetails.monthlyRate)
            queryParams.append('savings', planDetails.savings.toString())
          }
          
          // Redirect to checkout with the parameters using router
          router.push(`/checkout?${queryParams.toString()}`)
          return
        } catch (error) {
          console.error('Error parsing stored plan details', error)
          // If there's an error, just go to dashboard as fallback
        }
      }
    } else if (redirectPath === 'upgrade') {
      // Redirect to the upgrade page in dashboard
      router.push('/dashboard/upgrade')
      return
    }
    
    // Default redirect to dashboard
    router.push("/dashboard")
  }, [redirectPath, router]);

  // Simplify auth checking - do a quick check only without affecting UX
  useEffect(() => {
    // If user is already logged in, redirect without showing login form
    if (user) {
      handlePostLoginRedirect();
    }
  }, [user, handlePostLoginRedirect]);

  // Handle the login submission with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent default form behavior aggressively
    e.stopPropagation();
    
    // Early validation to prevent unnecessary API calls
    if (!email || !password) {
      // Display error for empty fields
      toast.error("Please enter both email and password");
      return;
    }
    
    // Set critical flags BEFORE attempting login to prevent page navigation
    if (typeof window !== 'undefined') {
      document.cookie = '_bypass_auth_during_error=true; path=/; max-age=300';
      document.cookie = 'auth-validated=false; path=/; max-age=300';
      document.cookie = 'login-in-progress=true; path=/; max-age=60';
      window._skipAuthChecks = true;
    }
    
    // Now set loading state
    setCheckingAuth(true);
    
    try {
      // Attempt login with try/catch to capture all errors
      await login(email, password, redirectPath ? `/dashboard?redirect=${redirectPath}` : undefined);
      // Note: Successful login redirection is now handled in the auth context
    } catch (err) {
      console.error("Login form submission error:", err);
      
      // Handle error locally - don't rely on auth context
      toast.error("Login failed. Please check your credentials and try again.");
      
      // Set error flags
      if (typeof window !== 'undefined') {
        // Set login failure flags
        window.sessionStorage.setItem('login_failed', 'true');
        document.cookie = 'login-failed=true; path=/; max-age=300';
        document.cookie = 'login-in-progress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        // Force the page to stay on login without reloading
        if (window.history && window.location.pathname.includes('/login')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    } finally {
      // Reset loading state
      setCheckingAuth(false);
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  }

  const buttonVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.6 },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(46, 213, 115, 0.5)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  }

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.2 },
    },
  }

  const backgroundShapes = [
    { top: "10%", left: "10%", size: "300px", delay: 0 },
    { top: "60%", left: "15%", size: "200px", delay: 0.2 },
    { top: "30%", left: "60%", size: "250px", delay: 0.4 },
    { top: "80%", left: "70%", size: "180px", delay: 0.6 },
  ]

  // Render loading or form based on state
  if (checkingAuth && typeof document !== 'undefined' && !document.cookie.includes('login-failed=true') && !loading) {
    return <Loading fullScreen text="Please Wait..." />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-700 to-purple-600 z-0">
        {/* Animated background shapes */}
        {backgroundShapes.map((shape, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white opacity-5"
            style={{
              top: shape.top,
              left: shape.left,
              width: shape.size,
              height: shape.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0.7, 1, 0.9, 1],
              opacity: [0.03, 0.05, 0.04, 0.05],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        ))}

        {/* Wave pattern */}
        <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="rgba(255, 255, 255, 0.05)"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Left side content - hidden on mobile, visible from md breakpoint */}
      <div className="absolute left-6 md:left-10 top-1/2 transform -translate-y-1/2 max-w-xs md:max-w-sm lg:max-w-md text-white z-10 hidden md:block">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight"
        >
          Log in to a safer internet world
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8"
        >
          Download SecureVPN apps on all your devices, and stay secure on 6500+ servers from anywhere, anytime.
        </motion.p>
      </div>

      {/* Mobile header - only visible on smaller screens */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-white text-center mb-6 z-10 md:hidden"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Log in to a safer internet world</h1>
        <p className="text-sm sm:text-base text-purple-100">Secure your connection, anywhere you go</p>
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md z-10 relative"
      >
        <motion.div variants={logoVariants} initial="hidden" animate="visible" className="flex justify-center mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <PowerCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="ml-2 text-xl sm:text-2xl font-bold text-gray-900 self-center">CREST VPN</div>
        </motion.div>

        {/* Display error message if present */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 border border-red-300 text-red-600 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6"
        >
          <motion.div variants={itemVariants}>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 sm:pl-12 py-5 sm:py-6 h-12 sm:h-14 text-sm sm:text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-12 py-6 h-14 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
                Forgot password?
              </Link>
            </div>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-5 sm:py-6 h-12 sm:h-14 rounded-xl text-sm sm:text-base font-medium shadow-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loading size={16} color="#FFFFFF" text="" inline className="mr-4" />
                  <span>Login</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-6 sm:mt-8">
            <p className="text-gray-600 text-xs sm:text-sm">
              Don't have an account yet?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>

      {/* Floating elements - hidden on small screens */}
      <motion.div
        className="absolute top-20 right-20 z-0 hidden lg:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 z-0 hidden lg:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M2 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  )
}
