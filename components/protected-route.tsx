"use client"

import { ReactNode, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading, checkAuth } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [redirectAttempted, setRedirectAttempted] = useState(false)
  const authChecked = useRef(false)

  useEffect(() => {
    // Debug logging
    console.log("Protected route - Auth state:", { 
      loading, 
      isChecking, 
      user: !!user, 
      redirectAttempted,
      path: typeof window !== 'undefined' ? window.location.pathname : 'unknown' 
    })
    
    // Check for potential redirect loop
    const path = typeof window !== 'undefined' ? window.location.pathname : ''
    const isLoop = path.includes('/login') && path.includes('callbackUrl=')
    
    if (isLoop) {
      console.log("Detected potential redirect loop in protected route")
      // Don't redirect again, stay on the current page
      setIsChecking(false)
      return
    }
    
    const verify = async () => {
      if (authChecked.current) return
      
      try {
        authChecked.current = true
        
        // Check the auth state (this internally validates the token)
        const isAuthenticated = await checkAuth()
        console.log("Auth checked result:", isAuthenticated)
        
        if (!isAuthenticated && !redirectAttempted) {
          setRedirectAttempted(true)
          console.log("Not authenticated, redirecting to login")
          // Use direct navigation as a fallback if Next.js router isn't working
          if (typeof window !== 'undefined') {
            window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
          } else {
            router.push("/login")
          }
        }
      } finally {
        setIsChecking(false)
      }
    }

    verify()
  }, [router, checkAuth, loading, isChecking, redirectAttempted])

  // Add a specific check for user data to ensure profile is available
  useEffect(() => {
    if (!loading && !isChecking && !user && !redirectAttempted) {
      setRedirectAttempted(true)
      console.log("No user after auth check, redirecting to login")
      if (typeof window !== 'undefined') {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
      } else {
        router.push("/login")
      }
    }
  }, [loading, isChecking, user, router, redirectAttempted])

  if (loading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
      </div>
    )
  }

  // Force render children even if auth is uncertain in production
  // This prevents redirect loops in problematic environments
  return <>{children}</>
} 