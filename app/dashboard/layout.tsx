"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { useSubscription } from "@/app/contexts/subscription-context"
import { useAuth } from "@/app/contexts/auth-context"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const { fetchActivePlan } = useSubscription();
  const initialFetchRef = useRef(false);
  const [layoutReady, setLayoutReady] = useState(false);

  // Optimize subscription fetch to prevent loading cascade
  useEffect(() => {
    // Only fetch if we have a user and haven't fetched before
    if (user?.id && !initialFetchRef.current) {
      // Set layout as ready immediately instead of waiting for subscription fetch
      setLayoutReady(true);
      
      // Fetch subscription in the background
      fetchActivePlan(user.id)
        .then(() => {
          console.log("Active plan fetched successfully");
        })
        .catch(err => {
          console.error("Error fetching active plan:", err);
        });
        
      initialFetchRef.current = true;
    } else if (user?.id) {
      // If we already have a user and didn't need to fetch, set layout as ready
      setLayoutReady(true);
    }
  }, [user?.id, fetchActivePlan]);

  return (
    <ProtectedRoute>
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] antialiased">
          <Sidebar />
          <div className="flex-1 flex flex-col w-full">
            <Header />
            <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto w-full">
                {/* Key page content to force remount on user change */}
                <div key={user?.id || 'loading'}>
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
