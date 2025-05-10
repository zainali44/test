"use client"

import { ClassicSpinner } from "react-spinners-kit"

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] bg-transparent">
      <div className="flex flex-col items-center">
        <ClassicSpinner size={30} color="#6366F1" loading={true} />
        <p className="mt-2 text-sm text-gray-500 animate-pulse">Loading content...</p>
      </div>
    </div>
  )
} 