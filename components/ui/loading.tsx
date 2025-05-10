"use client"

import { CombSpinner, HoopSpinner, JellyfishSpinner, PushSpinner } from "react-spinners-kit"

interface LoadingProps {
  size?: number
  color?: string
  text?: string
  fullScreen?: boolean
  className?: string
  inline?: boolean
}

export function Loading({
  size = 35,
  color = "#FFFFFF",
  text = "Loading...",
  fullScreen = false,
  className = "",
  inline = false,
}: LoadingProps) {
  // For inline loading (like in buttons)
  if (inline) {
    return <CombSpinner size={size} color={color} loading={true} />
  }

  const containerStyles = fullScreen
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center p-4"

  return (
    <div className={`${containerStyles} ${className}`}>
      <div className="flex flex-col items-center">
        <CombSpinner size={size} color={color} loading={true} />
        {text && <p className={`mt-4 text-center ${fullScreen ? "text-black" : ""}`}>{text}</p>}
      </div>
    </div>
  )
} 