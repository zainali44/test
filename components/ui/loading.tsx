"use client"

import { ClassicSpinner } from "react-spinners-kit"
import { useState, useEffect } from "react"

interface LoadingProps {
  size?: number
  color?: string
  text?: string
  fullScreen?: boolean
  className?: string
  inline?: boolean
  delay?: number // Add a delay prop to prevent flicker for quick loads
}

export function Loading({
  size = 35,
  color = "#6366F1",
  text = "Loading...",
  fullScreen = false,
  className = "",
  inline = false,
  delay = 300, // Default delay of 300ms before showing the loader
}: LoadingProps) {
  const [showLoader, setShowLoader] = useState(delay === 0)

  // Only show the loader after the specified delay
  // This prevents flicker for quickly resolved loads
  useEffect(() => {
    if (delay === 0) return
    
    const timer = setTimeout(() => {
      setShowLoader(true)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [delay])

  // For inline loading (like in buttons)
  if (inline) {
    return showLoader ? <ClassicSpinner size={size * 0.7} color={color} loading={true} /> : null
  }

  if (!showLoader) {
    return null // Don't render anything until the delay has passed
  }

  const containerStyles = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80"
    : "flex items-center justify-center p-4"

  return (
    <div className={`${containerStyles} ${className}`}>
      <div className="flex flex-col items-center backdrop-blur-sm">
        <ClassicSpinner size={size} color={color} loading={true} />
        {text && (
          <p className={`mt-3 text-sm font-medium ${fullScreen ? "text-gray-700" : ""}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
} 