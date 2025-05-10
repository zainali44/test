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
  const [verifyingAuth, setVerifyingAuth] = useState(false)
  const authChecked = useRef(false)

  useEffect(() => {
    // If auth is already loading from context, don't check again
    if (loading) return;
    
    // If we already have a user, no need to verify again
    if (user) {
      authChecked.current = true;
      return;
    }
    
    // Only check auth if we haven't done so already
    if (!authChecked.current && !verifyingAuth) {
      const verify = async () => {
        try {
          setVerifyingAuth(true);
          const isAuthenticated = await checkAuth();
          
          if (!isAuthenticated) {
            // Redirect to login with current path for callback
            if (typeof window !== 'undefined') {
              const currentPath = window.location.pathname;
              window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
              return;
            }
            router.push("/login");
          }
        } finally {
          setVerifyingAuth(false);
          authChecked.current = true;
        }
      };
      
      verify();
    }
  }, [router, checkAuth, loading, user, verifyingAuth]);

  // Only show loading spinner when explicitly checking auth (not when using cached state)
  if ((loading || verifyingAuth) && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Verifying your session...</p>
        </div>
      </div>
    )
  }

  // Once auth check is complete and we're still here, render children
  return <>{children}</>
} 