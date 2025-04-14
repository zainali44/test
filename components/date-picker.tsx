"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface DatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get current month and year
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Previous month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Select date
  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day)
    onDateChange(selectedDate)
    setIsOpen(false)
  }

  // Reset date
  const handleReset = () => {
    onDateChange(undefined)
    setIsOpen(false)
  }

  // Set to today
  const handleToday = () => {
    onDateChange(new Date())
    setIsOpen(false)
  }

  // Check if a day is selected
  const isSelected = (day: number) => {
    if (!date) return false
    return date.getDate() === day && date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }

  // Check if a day is today
  const isToday = (day: number) => {
    const now = new Date()
    return now.getDate() === day && now.getMonth() === currentMonth && now.getFullYear() === currentYear
  }

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Day names
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  // Format date for display - using a consistent format to avoid hydration errors
  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return "Today"
    return format(date, "MMM d, yyyy")
  }

  return (
    <div className="relative">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="outline" size="sm" className="flex items-center" onClick={() => setIsOpen(!isOpen)}>
          <span>{date ? formatDateForDisplay(date) : "Today"}</span>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.6616 1.33398C14.0066 1.33398 14.2866 1.61398 14.2866 1.95898L14.287 2.66549C15.5037 2.74891 16.5143 3.16569 17.2295 3.8824C18.0103 4.66657 18.4212 5.79407 18.417 7.14657V14.7491C18.417 17.5257 16.6537 19.2507 13.8162 19.2507H6.76783C3.93033 19.2507 2.16699 17.5016 2.16699 14.6857V7.1449C2.16699 4.52589 3.73954 2.84477 6.30423 2.66578L6.30474 1.95898C6.30474 1.61398 6.58474 1.33398 6.92974 1.33398C7.27474 1.33398 7.55474 1.61398 7.55474 1.95898L7.55449 2.64982H13.0362L13.0366 1.95898C13.0366 1.61398 13.3166 1.33398 13.6616 1.33398ZM17.167 8.75398H3.41699V14.6857C3.41699 16.8241 4.60699 18.0007 6.76783 18.0007H13.8162C15.977 18.0007 17.167 16.8457 17.167 14.7491L17.167 8.75398ZM14.0013 13.9976C14.3463 13.9976 14.6263 14.2776 14.6263 14.6226C14.6263 14.9676 14.3463 15.2476 14.0013 15.2476C13.6563 15.2476 13.373 14.9676 13.373 14.6226C13.373 14.2776 13.6488 13.9976 13.9938 13.9976H14.0013ZM10.3034 13.9976C10.6484 13.9976 10.9284 14.2776 10.9284 14.6226C10.9284 14.9676 10.6484 15.2476 10.3034 15.2476C9.95841 15.2476 9.67508 14.9676 9.67508 14.6226C9.67508 14.2776 9.95091 13.9976 10.2959 13.9976H10.3034ZM6.59774 13.9976C6.94274 13.9976 7.22274 14.2776 7.22274 14.6226C7.22274 14.9676 6.94274 15.2476 6.59774 15.2476C6.25274 15.2476 5.96858 14.9676 5.96858 14.6226C5.96858 14.2776 6.24524 13.9976 6.59024 13.9976H6.59774ZM14.0013 10.7587C14.3463 10.7587 14.6263 11.0387 14.6263 11.3837C14.6263 11.7287 14.3463 12.0087 14.0013 12.0087C13.6563 12.0087 13.373 11.7287 13.373 11.3837C13.373 11.0387 13.6488 10.7587 13.9938 10.7587H14.0013ZM10.3034 10.7587C10.6484 10.7587 10.9284 11.0387 10.9284 11.3837C10.9284 11.7287 10.6484 12.0087 10.3034 12.0087C9.95841 12.0087 9.67508 11.7287 9.67508 11.3837C9.67508 11.0387 9.95091 10.7587 10.2959 10.7587H10.3034ZM6.59774 10.7587C6.94274 10.7587 7.22274 11.0387 7.22274 11.3837C7.22274 11.7287 6.94274 12.0087 6.59774 12.0087C6.25274 12.0087 5.96858 11.7287 5.96858 11.3837C5.96858 11.0387 6.24524 10.7587 6.59024 10.7587H6.59774ZM13.0362 3.89982H7.55449L7.55474 4.70148C7.55474 5.04648 7.27474 5.32648 6.92974 5.32648C6.58474 5.32648 6.30474 5.04648 6.30474 4.70148L6.3043 3.91874C4.43744 4.07556 3.41699 5.2072 3.41699 7.1449V7.50398H17.167L17.167 7.1449C17.1703 6.11573 16.8937 5.31573 16.3445 4.76573C15.8624 4.28224 15.1577 3.99349 14.2873 3.91914L14.2866 4.70148C14.2866 5.04648 14.0066 5.32648 13.6616 5.32648C13.3166 5.32648 13.0366 5.04648 13.0366 4.70148L13.0362 3.89982Z" fill="black"/>
</svg>

        </Button>
      </motion.div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md border bg-white shadow-lg z-50">
          <div className="p-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">
                {monthNames[currentMonth]} {currentYear}
              </div>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
              {dayNames.map((day) => (
                <div key={day} className="h-8 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="h-8" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                return (
                  <Button
                    key={day}
                    variant={isSelected(day) ? "default" : isToday(day) ? "outline" : "ghost"}
                    className={`h-8 w-8 p-0 ${isSelected(day) ? "bg-black text-white" : ""} ${
                      isToday(day) && !isSelected(day) ? "border border-black" : ""
                    }`}
                    onClick={() => handleSelectDate(day)}
                  >
                    {day}
                  </Button>
                )
              })}
            </div>

            {/* Footer */}
            {date && (
              <div className="mt-2 pt-2 border-t flex justify-between">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset
                </Button>
                <Button size="sm" onClick={handleToday}>
                  Today
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
