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
    // Set ready state once auth is loaded
    if (!loading) {
      setIsReady(true)
    }
  }, [loading])

  return (
    <div className="container mx-auto p-6">
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
