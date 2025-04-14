"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  trend: "up" | "down" | "neutral"
  percentage: string
  chartColor: string
  delay?: number
}

export function MetricCard({ title, value, subtitle, trend, percentage, chartColor, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6"
    >
      <div className="flex flex-col space-y-1.5">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">{title}</h3>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              trend === "up"
                ? "bg-green-100 text-green-800"
                : trend === "down"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800",
            )}
          >
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
            {percentage}
          </motion.div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <motion.p
              className="text-xl sm:text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.1 }}
            >
              {value}
            </motion.p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <motion.div
            className="h-10 sm:h-12 w-16 sm:w-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
          >
            {chartColor === "blue" && (
              <svg viewBox="0 0 100 30" className="h-full w-full">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: delay + 0.3 }}
                  d="M0 30 Q 20 15, 30 20 Q 40 25, 50 15 Q 60 5, 70 10 Q 80 15, 90 5 L 100 0 L 100 30 L 0 30"
                  fill="rgba(59, 130, 246, 0.2)"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: delay + 0.3 }}
                  d="M0 30 Q 20 15, 30 20 Q 40 25, 50 15 Q 60 5, 70 10 Q 80 15, 90 5 L 100 0"
                  fill="none"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="2"
                />
              </svg>
            )}
            {chartColor === "red" && (
              <svg viewBox="0 0 100 30" className="h-full w-full">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: delay + 0.3 }}
                  d="M0 0 Q 20 15, 30 10 Q 40 5, 50 15 Q 60 25, 70 20 Q 80 15, 90 25 L 100 30 L 100 30 L 0 30"
                  fill="rgba(239, 68, 68, 0.2)"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: delay + 0.3 }}
                  d="M0 0 Q 20 15, 30 10 Q 40 5, 50 15 Q 60 25, 70 20 Q 80 15, 90 25 L 100 30"
                  fill="none"
                  stroke="rgb(239, 68, 68)"
                  strokeWidth="2"
                />
              </svg>
            )}
            {chartColor === "green" && (
              <svg viewBox="0 0 100 30" className="h-full w-full">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: delay + 0.3 }}
                  d="M0 30 Q 10 25, 20 20 Q 30 15, 40 18 Q 50 21, 60 15 Q 70 9, 80 5 Q 90 1, 100 0 L 100 30 L 0 30"
                  fill="rgba(34, 197, 94, 0.2)"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: delay + 0.3 }}
                  d="M0 30 Q 10 25, 20 20 Q 30 15, 40 18 Q 50 21, 60 15 Q 70 9, 80 5 Q 90 1, 100 0"
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="2"
                />
              </svg>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
