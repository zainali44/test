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
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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

      // If user data is included in the login response, use it directly
      if (data.data.user) {
        const userData = data.data.user;
        
        // Save the user information in state and persistent storage
        setUser(userData)
        storeUserData(userData)
        
        // Show success toast
        toast.success("Logged in successfully")
        
        // Redirect to dashboard
        router.push("/dashboard")
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
        
        // Redirect to dashboard
        router.push("/dashboard")
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
      
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      
      // Clear auth state
      setUser(null)
      setToken(null)
      
      // Clear stored data
      clearAuthToken()
      clearUserData()
      
      // Show success toast
      toast.success("Logged out successfully")
      
      // Redirect to login page
      router.push("/login")
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
        return true
      } else if (storedToken) {
        // If we have a token but no user data, validate the token
        
        // Check if we already have a user with this token to prevent unnecessary API calls
        if (user && token === storedToken) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        checkAuth,
      }}
    >
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