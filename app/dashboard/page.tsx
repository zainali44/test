"use client"

import { MetricCard } from "@/components/metric-card"
import { BookingsTable } from "@/components/bookings-table"
import { UserRegistrationsTable } from "@/components/user-registrations-table"
import { motion } from "framer-motion"
import { metrics } from "@/data/metrics"

export default function DashboardPage() {
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            trend={metric.trend}
            percentage={metric.percentage}
            chartColor={metric.chartColor}
            delay={index * 0.1}
          />
        ))}
      </div>

      <BookingsTable />

      <UserRegistrationsTable />
    </motion.div>
  )
}
