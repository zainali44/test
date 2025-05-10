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

// Add TypeScript declaration for window._skipAuthChecks
declare global {
  interface Window {
    _skipAuthChecks?: boolean;
  }
}

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
        // Skip auth check if there's a login failure flag
        if (typeof window !== 'undefined') {
          const hasLoginFailed = window.sessionStorage.getItem('login_failed') === 'true' ||
                               document.cookie.includes('login-failed=true') ||
                               window._skipAuthChecks === true;
          
          if (hasLoginFailed) {
            console.log("Auth initialization skipped due to login failure");
            // Explicitly clear any auth state to ensure we're truly logged out
            setUser(null);
            setToken(null);
            setLoading(false);
            setIsInitialized(true);
            return;
          }
        }
        
        await checkAuth();
      } catch (err) {
        console.error("Error during auth initialization:", err);
        // On error, ensure we're logged out
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    }
    
    initAuth();
  }, []);

  const login = async (email: string, password: string, redirectUrl?: string) => {
    try {
      // Clear auth state immediately to prevent any possible cached auth state
      setUser(null);
      setToken(null);
      clearAuthToken();
      setLoading(true);
      setError(null);

      // Set critical flags BEFORE attempting login
      if (typeof window !== 'undefined') {
        console.log("Setting up pre-login state...");
        
        // Clear ANY existing auth cookies/tokens completely
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'ls-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'recently-logged-out=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'logging-out=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'login-failed=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = '_bypass_auth_during_error=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // Set explicit flag that we're attempting login and auth is not validated
        document.cookie = 'auth-validated=false; path=/; max-age=60';
        document.cookie = 'login-in-progress=true; path=/; max-age=60';
        
        // Clear localStorage
        localStorage.removeItem('auth-token');
        
        // Clear sessionStorage flags
        sessionStorage.removeItem('logout_in_progress');
        sessionStorage.removeItem('login_failed');
        sessionStorage.setItem('login_in_progress', 'true');
        sessionStorage.setItem('auth_validated', 'false');
      }

      // Attempt login
      console.log("Making login API call...");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      // Even before parsing the response, check for non-200 status
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Login failed";
        
        try {
          // Try to parse the error message from JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || "Invalid credentials";
        } catch (e) {
          // If parsing fails, use status text
          errorMessage = response.statusText || "Login failed";
        }
        
        // Immediately throw with the error message
        throw new Error(errorMessage);
      }

      // Only proceed to parse JSON if status is OK
      const data = await response.json();
      
      // Validate token exists and is properly formed
      const authToken = data.data?.token;
      if (!authToken) {
        throw new Error("No authentication token received");
      }
      
      // Attempt to verify token format
      try {
        const decoded = verifyToken(authToken);
        if (!decoded) {
          throw new Error("Invalid token format");
        }
      } catch (e) {
        throw new Error("Token validation failed");
      }
      
      // Clear login in progress flag
      if (typeof window !== 'undefined') {
        document.cookie = 'login-in-progress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        sessionStorage.removeItem('login_in_progress');
      }
      
      // Clear any login failure flags
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('login_failed');
        document.cookie = 'login-failed=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      // Set login success state in cookies/storage BEFORE setting token
      // This helps the middleware make accurate decisions
      if (typeof window !== 'undefined') {
        document.cookie = 'auth-validated=true; path=/; max-age=86400';
        sessionStorage.setItem('auth_validated', 'true');
      }
      
      // Now safe to store token and update state
      console.log("Login successful, storing token");
      storeAuthToken(authToken);
      setToken(authToken);

      if (data.data.user) {
        // Save user data
        const userData = data.data.user;
        setUser(userData);
        storeUserData(userData);
        
        // Show success toast
        toast.success("Logged in successfully");
        
        // Use router.push for navigation instead of window.location
        // Add a query parameter to prevent caching issues
        const cacheBuster = Date.now().toString();
        const targetUrl = redirectUrl || "/dashboard/downloads";
        router.push(`${targetUrl}?auth=${cacheBuster}`);
        return;
      }

      // Fallback for when user data isn't in response
      const validationResponse = await validateToken(authToken);
      if (validationResponse.data?.valid) {
        const userData = validationResponse.data.user;
        setUser(userData);
        storeUserData(userData);
        
        toast.success("Logged in successfully");
        
        // Use router.push for navigation
        const cacheBuster = Date.now().toString();
        const targetUrl = redirectUrl || "/dashboard/downloads";
        router.push(`${targetUrl}?auth=${cacheBuster}`);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      // CRITICAL: Set strong login failure state across multiple storage mechanisms
      if (typeof window !== 'undefined') {
        console.log("Setting login failure state...");
        
        // Clear the login_in_progress flag
        sessionStorage.removeItem('login_in_progress');
        document.cookie = 'login-in-progress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // Set explicit login failure flags with longer expiry
        sessionStorage.setItem('login_failed', 'true'); 
        document.cookie = 'login-failed=true; path=/; max-age=300'; // 5 minute expiry
        document.cookie = 'auth-validated=false; path=/; max-age=300';
        document.cookie = '_bypass_auth_during_error=true; path=/; max-age=300'; // Critical flag to bypass middleware
        
        // Force clear any tokens that might exist
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'ls-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('auth-token');
        
        // Prevent any background auth checks
        window._skipAuthChecks = true; // Global flag to prevent auth checks
        
        // Make sure we stay on the login page
        if (window.history && window.location.pathname.includes('/login')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
      
      // Clear ALL auth state on login error
      setUser(null);
      setToken(null);
      
      // Set error message for display - ensure this is very visible
      const errorMessage = err.message || "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
      console.error("Auth Error:", errorMessage); // Log for debugging
      
      // Display a toast notification for extra visibility
      if (typeof window !== 'undefined' && typeof toast !== 'undefined') {
        toast.error(errorMessage);
      }
      
      // Throw the error to be handled by the login component
      throw err;
    } finally {
      setLoading(false);
      
      // Ensure we're not showing any loading indicators
      if (typeof window !== 'undefined') {
        document.body.classList.remove('auth-loading');
      }
    }
  };

  const logout = async () => {
    try {
      setLoading(true)
      
      // Flag to prevent double navigation
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('logout_in_progress', 'true');
      }
      
      // Set recently-logged-out flag to prevent dashboard flashing
      setCookie("recently-logged-out", "true", 1/24/12); // 5 minutes
      
      // Clear auth state immediately to prevent brief access to protected routes
      setUser(null)
      setToken(null)
      
      // Clear stored data client-side first
      clearAuthToken()
      clearUserData()
      
      // Set a temporary cookie to indicate logout in progress - longer timeout
      setCookie("logging-out", "true", 1/24/60); // 1 minute
      
      // Call logout API - don't wait for the response
      fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include" // Important for cookie handling
      })
      .catch(err => console.error("Error calling logout API:", err));
      
      // Double-check that cookies and localStorage are cleared
      clearAuthToken()
      clearUserData()
      
      // Show success toast
      toast.success("Logged out successfully")
      
      // Wait briefly to ensure state is cleared before redirect
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Use router for navigation
      router.push('/login')
      
      // Clear the logout in progress flag
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('logout_in_progress');
      }
    } catch (err: any) {
      setError(err.message || "Failed to logout")
      toast.error(err.message || "Failed to logout")
      
      // Set recently-logged-out flag even on error
      setCookie("recently-logged-out", "true", 1/24/12); // 5 minutes
      
      // On error, still try to clean up client-side state
      setUser(null)
      setToken(null)
      clearAuthToken()
      clearUserData()
      
      // Use router for navigation
      router.push('/login')
      
      // Clear the flag
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('logout_in_progress');
      }
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    try {
      // CRITICAL: Check for global auth skip flag and login failure flags
      if (typeof window !== 'undefined') {
        // Skip auth check if explicitly set to skip or login failed
        const loginFailed = window._skipAuthChecks || 
                           sessionStorage.getItem('login_failed') === 'true' || 
                           document.cookie.includes('login-failed=true') ||
                           document.cookie.includes('logging-out=true');
                           
        if (loginFailed) {
          console.log("Skipping auth check due to login failure or special flags");
          // Clear any existing auth state to ensure we're truly logged out
          setUser(null);
          setToken(null);
          return false;
        }
      }
      
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
          // Token invalid, let the login page render
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
      // On error, clear auth state
      setUser(null);
      setToken(null);
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