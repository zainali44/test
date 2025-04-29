"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
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

  // Refresh subscription data only once when dashboard is first loaded
  useEffect(() => {
    // Only fetch if we have a user and haven't fetched before
    if (user?.id && !initialFetchRef.current) {
      console.log("Initial subscription fetch in dashboard layout");
      fetchActivePlan(user.id)
        .then(() => {
          console.log("Active plan fetched successfully in dashboard layout");
        })
        .catch(err => {
          console.error("Error fetching active plan in dashboard layout:", err);
        });
      initialFetchRef.current = true;
    }
  }, [user?.id, fetchActivePlan]);

  return (
    <ProtectedRoute>
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="flex flex-col md:flex-row h-screen bg-[#f8fafc]">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden w-full">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
