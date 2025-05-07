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
  clearAuthToken,
  verifyToken,
  setCookie
} from "@/app/utils/auth"

// Prevent excessive token validation
let lastValidationTime = 0;
const VALIDATION_COOLDOWN = 30000; // 30 seconds between validations

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
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const router = useRouter()

  // Check if user is already logged in on mount - with protection against excessive calls
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations
    
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (err) {
        console.error("Error during auth initialization:", err);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    }
    
    initAuth();
  }, []);

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
      
      if (!authToken) {
        throw new Error("No authentication token received");
      }
      
      // Store token in both localStorage and cookies for consistent access
      storeAuthToken(authToken);
      setToken(authToken);
      
      // Log authentication status
      console.log("Login successful, token stored")

      // If user data is included in the login response, use it directly
      if (data.data.user) {
        const userData = data.data.user;
        
        // Save the user information in state and persistent storage
        setUser(userData)
        storeUserData(userData)
        
        // Show success toast
        toast.success("Logged in successfully")
        
        // Wait to ensure all state is updated
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Safe redirect logic
        handleRedirect(redirectUrl || "/dashboard");
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
        
        // Safe redirect
        handleRedirect(redirectUrl || "/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login")
      toast.error(err.message || "Failed to login")
      // Clear partial state on error
      clearAuthToken();
    } finally {
      setLoading(false)
    }
  }

  // Helper function to handle redirects safely
  const handleRedirect = (path: string) => {
    // Set a guard against navigation loops
    const guardKey = `navigation_${Date.now()}`;
    sessionStorage.setItem(guardKey, "true");
    
    try {
      router.push(path);
      
      // Fallback - only if router fails after a timeout
      setTimeout(() => {
        if (window.location.pathname !== path && sessionStorage.getItem(guardKey) === "true") {
          window.location.href = path;
        }
        // Clean up the guard
        sessionStorage.removeItem(guardKey);
      }, 2000);
    } catch (err) {
      console.error("Navigation error:", err);
      // Last resort - direct navigation
      window.location.href = path;
      // Clean up the guard
      sessionStorage.removeItem(guardKey);
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      
      // Set a temporary cookie to indicate logout in progress - longer timeout
      setCookie("logging-out", "true", 1/24/60); // 1 minute
      
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
      
      // Show success toast
      toast.success("Logged out successfully")
      
      // Wait briefly to ensure state is cleared before redirect
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Direct navigation to avoid Next.js router caching issues
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message || "Failed to logout")
      toast.error(err.message || "Failed to logout")
      
      // On error, still try to clean up client-side state
      setUser(null)
      setToken(null)
      clearAuthToken()
      clearUserData()
      
      // Force redirect even on error
      window.location.href = "/login";
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    try {
      // First check if we have user data in storage
      const storedUser = getUserData()
      const storedToken = getAuthToken()
      
      if (!storedToken) {
        // No token, definitely not authenticated
        setUser(null);
        setToken(null);
        return false;
      }
      
      // Set token in state
      setToken(storedToken);
      
      if (storedUser) {
        // If we have user data stored, use it
        setUser(storedUser);
        
        // Check if token is valid quickly using client-side validation
        try {
          const decoded = verifyToken(storedToken);
          if (decoded) {
            // Token is valid, avoid unnecessary API calls
            return true;
          }
        } catch (localError) {
          // If local validation fails, continue to API validation
          console.log("Local token validation failed, trying API validation");
        }
      }
      
      // Validate token with API if needed
      if (shouldValidateToken()) {
        const isValid = await validateCurrentToken();
        
        if (!isValid) {
          // If token is invalid, clear all auth data
          clearAuthToken();
          clearUserData();
          setUser(null);
          setToken(null);
          return false;
        }
        
        return true;
      }
      
      // If we avoided validation, assume token is valid based on local data
      return !!storedUser && !!storedToken;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }
  
  // Helper function to determine if we should validate the token
  const shouldValidateToken = (): boolean => {
    const now = Date.now();
    
    // If it's been less than the cooldown period since last validation, skip
    if (now - lastValidationTime < VALIDATION_COOLDOWN) {
      return false;
    }
    
    // Update last validation time
    lastValidationTime = now;
    return true;
  }

  // Validate current token with the API
  const validateCurrentToken = async (): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
      const response = await validateToken(token);
      
      if (response.data.valid && response.data.user) {
        // Update user data if we got it from the API
        setUser(response.data.user);
        storeUserData(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  }

  // Helper function to validate a token
  const validateToken = async (token: string) => {
    const response = await fetch("/api/auth/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ token }),
    })
    
    return await response.json()
  }

  // Update user data
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