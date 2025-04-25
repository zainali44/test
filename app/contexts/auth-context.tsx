"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface User {
  id: string
  email: string
}

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
      localStorage.setItem("auth-token", authToken)

      // Now get the user info by validating the token
      const validationResponse = await validateToken(authToken)
      if (validationResponse.data.valid) {
        setUser(validationResponse.data.user)
        
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
      localStorage.removeItem("auth-token")
      
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
      // Check for token in localStorage
      const storedToken = localStorage.getItem("auth-token")
      if (!storedToken) {
        return false
      }

      // Validate the token
      const validationResponse = await validateToken(storedToken)
      
      if (validationResponse.data.valid) {
        setToken(storedToken)
        setUser(validationResponse.data.user)
        return true
      } else {
        // Clear invalid token
        localStorage.removeItem("auth-token")
        return false
      }
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