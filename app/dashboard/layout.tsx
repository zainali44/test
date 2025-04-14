import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Desktop Sidebar - Always visible on md and larger screens */}
        <div className="hidden md:block w-64 h-full">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-4 sm:p-6 overflow-y-auto h-[calc(100vh-4rem)]">{children}</div>
        </div>
      </div>
    </div>
  )
}
