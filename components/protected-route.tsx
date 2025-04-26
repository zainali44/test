"use client"

import { ReactNode, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading, checkAuth } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const authChecked = useRef(false)

  useEffect(() => {
    const verify = async () => {
      if (authChecked.current) return
      
      try {
        authChecked.current = true
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
          router.push("/login")
        }
      } finally {
        setIsChecking(false)
      }
    }

    verify()
  }, [router, checkAuth])

  // Add a specific check for user data to ensure profile is available
  useEffect(() => {
    if (!loading && !isChecking && !user) {
      router.push("/login")
    }
  }, [loading, isChecking, user, router])

  if (loading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
} 