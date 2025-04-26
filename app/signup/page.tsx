"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState<{name?: string, email?: string, password?: string}>({})
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Simple password strength checker
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }, [password])

  const validateForm = (): boolean => {
    const errors: {name?: string, email?: string, password?: string} = {};
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Validate password
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear any previous errors
    setErrorMessage("")
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true)

    try {
      // Call our registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle registration errors
        console.error('Registration failed:', data.message);
        setErrorMessage(data.message || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Registration successful
      console.log('Registration successful:', data);
      
      // Store token in localStorage if it exists in the response
      if (data.data?.token && typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.data.token);
      }
      
      // Use a timeout to ensure state updates are complete before navigation
      setTimeout(() => {
        // Redirect to dashboard using Next.js router
        router.push("/dashboard");
      }, 100);
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred during registration. Please try again.');
      setIsLoading(false);
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
      boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)",
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

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-yellow-500"
    if (passwordStrength === 3) return "bg-blue-500"
    return "bg-green-500"
  }

  if (!mounted) {
    return null
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

      {/* Left side content */}
      <div className="absolute left-6 md:left-10 top-1/2 transform -translate-y-1/2 max-w-xs md:max-w-sm lg:max-w-md text-white z-10 hidden md:block">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight"
        >
          Join a safer internet world
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8"
        >
          Create your account today and enjoy secure browsing on all your devices with access to 6500+ servers
          worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-3 md:space-y-4"
        >
          {[
            "Secure connection with high-speed servers",
            "Block unwanted trackers and ads",
            "Connect multiple devices simultaneously",
          ].map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="bg-white/20 p-1 rounded-full mr-3">
                <Check className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
              <span className="text-white text-sm md:text-base">{feature}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile header - only visible on smaller screens */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-white text-center mb-6 z-10 md:hidden"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Join a safer internet world</h1>
        <p className="text-sm sm:text-base text-purple-100 mb-4">Create your account today</p>
        <div className="flex flex-col space-y-2">
          {[
            "Secure connection with high-speed servers",
            "Block unwanted trackers and ads",
          ].map((feature, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="bg-white/20 p-1 rounded-full mr-2">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-white text-xs sm:text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Signup card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md z-10 relative"
      >
        <motion.div variants={logoVariants} initial="hidden" animate="visible" className="flex justify-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 8H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="ml-2 text-xl sm:text-2xl font-bold text-gray-900 self-center">CREST VPN</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6"
        >
          Create your account
        </motion.h2>

        {/* Display error message if any */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5"
        >
          <motion.div variants={itemVariants}>
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`pl-10 sm:pl-12 py-5 sm:py-6 h-12 sm:h-14 text-sm sm:text-base rounded-xl ${validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} focus:border-transparent transition-all duration-300`}
              />
            </div>
            {validationErrors.name && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.name}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`pl-10 sm:pl-12 py-5 sm:py-6 h-12 sm:h-14 text-sm sm:text-base rounded-xl ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} focus:border-transparent transition-all duration-300`}
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.email}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`pl-10 sm:pl-12 py-5 sm:py-6 h-12 sm:h-14 text-sm sm:text-base rounded-xl ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} focus:border-transparent transition-all duration-300 pr-10 sm:pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>

            {/* Password strength meter */}
            <div className="mt-2">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getStrengthColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength * 25}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {password ? (
                  passwordStrength === 4 ? (
                    <span className="text-green-500">Strong password</span>
                  ) : (
                    "Password should be at least 8 characters with uppercase, numbers, and symbols"
                  )
                ) : (
                  "Must be at least 8 characters"
                )}
              </p>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.password}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="text-xs sm:text-sm text-gray-600">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:text-purple-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:text-purple-800">
              Privacy Policy
            </a>
            .
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 sm:py-6 h-12 sm:h-14 rounded-xl text-sm sm:text-base font-medium shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                  <span>Create Account</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative flex items-center justify-center my-4 sm:my-6">
            <div className="border-t border-gray-200 absolute w-full"></div>
            <div className="bg-white px-4 relative z-10 text-xs sm:text-sm text-gray-500">OR</div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-900 py-5 sm:py-6 h-12 sm:h-14 rounded-xl text-sm sm:text-base flex items-center justify-center transition-all duration-300 hover:border-gray-400"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.44 21.68 8.2 23.25C8.8 23.36 9 22.98 9 22.66C9 22.37 9 21.69 9 20.67C5.67 21.39 4.97 19.16 4.97 19.16C4.42 17.77 3.63 17.41 3.63 17.41C2.54 16.67 3.72 16.68 3.72 16.68C4.92 16.76 5.56 17.9 5.56 17.9C6.63 19.73 8.36 19.21 9.04 18.9C9.15 18.13 9.46 17.61 9.81 17.31C7.15 17.01 4.34 15.99 4.34 11.37C4.34 10.07 4.81 9.01 5.58 8.17C5.45 7.87 5.04 6.64 5.7 4.98C5.7 4.98 6.71 4.66 9 6.21C9.97 5.94 11.02 5.81 12.01 5.8C13 5.81 14.04 5.95 15.01 6.21C17.3 4.66 18.3 4.98 18.3 4.98C18.96 6.64 18.55 7.87 18.43 8.17C19.2 9.01 19.66 10.07 19.66 11.37C19.66 16 16.85 17 14.18 17.3C14.63 17.67 15.04 18.42 15.04 19.57C15.04 21.25 15.03 22.28 15.03 22.66C15.03 22.98 15.22 23.36 15.83 23.25C20.57 21.69 24 17.31 24 12C24 5.37 18.63 0 12 0Z"
                  fill="currentColor"
                />
              </svg>
              <span>Sign up with GitHub</span>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-6 sm:mt-8">
            <p className="text-gray-600 text-xs sm:text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Log in
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>

      {/* Floating elements - hidden on small screens */}
      <motion.div
        className="absolute bottom-20 right-10 z-0 hidden lg:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 4.5v2c0 1.1.9 2 2 2h2M10 13l-2 2 2 2M14 13l2 2-2 2"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  )
}
