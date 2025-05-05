"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { 
  storeUserData, 
  getUserData, 
  clearUserData, 
  User, 
  storeAuthToken,
  getAuthToken,
  clearAuthToken 
} from "@/app/utils/auth"

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (email: string, password: string, redirectUrl?: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  validateCurrentToken: () => Promise<boolean>
  updateUserData?: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string, redirectUrl?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include" // Important for cookie handling
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Save token
      const authToken = data.data.token
      setToken(authToken)
      
      // Store token in localStorage
      storeAuthToken(authToken)
      
      // Log authentication status
      console.log("Login successful, token stored:", authToken ? "Yes" : "No")

      // If user data is included in the login response, use it directly
      if (data.data.user) {
        const userData = data.data.user;
        
        // Save the user information in state and persistent storage
        setUser(userData)
        storeUserData(userData)
        
        // Show success toast
        toast.success("Logged in successfully")
        
        // Force cookie check - this helps ensure cookies are properly set before redirect
        // This can help with production environments where cookie handling may be different
        document.cookie = `auth-token-check=true; path=/; max-age=3600;`;
        
        // Wait briefly to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Redirect to appropriate page (dashboard by default)
        if (redirectUrl) {
          router.push(redirectUrl)
          // Fallback redirect in case Next.js router fails
          setTimeout(() => {
            if (window.location.pathname !== redirectUrl) {
              window.location.href = redirectUrl;
            }
          }, 1000);
        } else {
          router.push("/dashboard")
          // Fallback redirect in case Next.js router fails
          setTimeout(() => {
            if (window.location.pathname !== "/dashboard") {
              window.location.href = "/dashboard";
            }
          }, 1000);
        }
        return;
      }

      // Otherwise, validate the token to get user info (fallback)
      const validationResponse = await validateToken(authToken)
      if (validationResponse.data.valid) {
        const userData = validationResponse.data.user;
        setUser(userData)
        storeUserData(userData)
        
        // Show success toast
        toast.success("Logged in successfully")
        
        // Redirect to appropriate page (dashboard by default)
        if (redirectUrl) {
          router.push(redirectUrl)
          // Fallback redirect in case Next.js router fails
          setTimeout(() => {
            if (window.location.pathname !== redirectUrl) {
              window.location.href = redirectUrl;
            }
          }, 1000);
        } else {
          router.push("/dashboard")
          // Fallback redirect in case Next.js router fails
          setTimeout(() => {
            if (window.location.pathname !== "/dashboard") {
              window.location.href = "/dashboard";
            }
          }, 1000);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to login")
      toast.error(err.message || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      
      // Set a temporary cookie to indicate logout in progress
      document.cookie = "logging-out=true; path=/; max-age=5";
      
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include" // Important for cookie handling
      })
      
      // Clear auth state
      setUser(null)
      setToken(null)
      
      // Clear stored data
      clearAuthToken()
      clearUserData()
      
      // Clear cookies manually as a backup
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // Show success toast
      toast.success("Logged out successfully")
      
      // Wait briefly to ensure cookies are fully cleared
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to login page with force reload to clear any cached state
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message || "Failed to logout")
      toast.error(err.message || "Failed to logout")
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    try {
      // First check if we have user data in storage
      const storedUser = getUserData()
      const storedToken = getAuthToken()
      
      if (storedUser && storedToken) {
        // If we already have the user data, use it
        setUser(storedUser)
        setToken(storedToken)
        
        // Validate token with external API
        const isValid = await validateCurrentToken()
        if (!isValid) {
          // If token is invalid, clear user data and log out
          clearAuthToken()
          clearUserData()
          setUser(null)
          setToken(null)
          return false
        }
        
        return true
      } else if (storedToken) {
        // If we have a token but no user data, validate the token
        
        // Check if we already have a user with this token to prevent unnecessary API calls
        if (user && token === storedToken) {
          // Validate token with external API
          const isValid = await validateCurrentToken()
          if (!isValid) {
            // If token is invalid, clear user data and log out
            clearAuthToken()
            clearUserData()
            setUser(null)
            setToken(null)
            return false
          }
          
          return true
        }

        // Validate the token
        const validationResponse = await validateToken(storedToken)
        
        if (validationResponse.data.valid && validationResponse.data.user) {
          const userData = validationResponse.data.user;
          setToken(storedToken)
          setUser(userData)
          storeUserData(userData)
          return true
        } else {
          // Clear invalid token
          clearAuthToken()
          clearUserData()
          return false
        }
      }
      
      return false
    } catch (err) {
      console.error("Auth check failed:", err)
      return false
    }
  }

  const validateCurrentToken = async (): Promise<boolean> => {
    try {
      const currentToken = token || getAuthToken()
      
      if (!currentToken) {
        return false
      }
      
      // Add debouncing to prevent multiple API calls in short succession
      // This uses a static lastValidated variable in the function's closure
      const now = Date.now()
      if (validateCurrentToken.lastValidated && 
          now - validateCurrentToken.lastValidated < 10000) {
        console.log("Token validated recently, using cached result:", validateCurrentToken.lastResult)
        return validateCurrentToken.lastResult
      }
      
      console.log("Validating token with external API")
      // Validate with external API
      try {
        const response = await fetch('http://localhost:8000/users/validate-token', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: currentToken })
        })
        
        const data = await response.json()
        
        // Check if the response contains a valid field
        if (typeof data.valid === 'undefined') {
          console.error("Invalid API response format:", data)
          return false
        }
        
        const result = !!data.valid
        console.log("External token validation result:", result)
        
        // Cache the result
        validateCurrentToken.lastValidated = now
        validateCurrentToken.lastResult = result
        
        return result
      } catch (fetchError) {
        console.error("External API call failed:", fetchError)
        return false
      }
    } catch (error) {
      console.error("External token validation failed:", error)
      return false
    }
  }
  
  // Add static properties to the function
  validateCurrentToken.lastValidated = 0
  validateCurrentToken.lastResult = false

  const validateToken = async (token: string) => {
    const response = await fetch("/api/auth/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()
    return data
  }

  const updateUserData = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      storeUserData(updatedUser)
    }
  }

  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    checkAuth,
    validateCurrentToken,
    updateUserData
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 