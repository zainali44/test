"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/app/contexts/auth-context"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isReady, setIsReady] = useState(false)
  
  // Log user data for debugging
  useEffect(() => {
    console.log("Dashboard received user data:", user)
  }, [user])
  
  useEffect(() => {
    // Don't redirect immediately, wait for auth to be processed
    if (!loading) {
      // Small delay to ensure routing is ready and user data is available
      const timer = setTimeout(() => {
        setIsReady(true)
        router.push("/dashboard/downloads")
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [router, loading])

  return (
    <div className="container mx-auto p-6">
      {/* <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4">Redirecting to downloads page...</p> */}
      
      {/* User info for debugging
      {user && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md">
          <p>User: {user.name || user.email || "Unknown"}</p>
          <p>Email: {user.email || "No email available"}</p>
          <p>ID: {user.id || "No ID available"}</p>
        </div>
      )} */}
      
      {/* Loading skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
