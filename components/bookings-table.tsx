"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, ChevronLeft, Search, Download, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { bookings, type Booking } from "@/data/bookings"
import { DatePicker } from "@/components/date-picker"
// Update imports to include format and parseISO
import { parseISO } from "date-fns"

const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
}

const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

export function BookingsTable() {
    const [page, setPage] = useState(1)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings)
    const [searchQuery, setSearchQuery] = useState("")

    // Filter bookings based on date and search query
    const filterBookings = (date: Date | undefined, query: string) => {
        let filtered = [...bookings]

        // Filter by date if selected
        if (date) {
            filtered = filtered.filter((booking) => {
                // Parse the ISO string date
                const bookingDate = parseISO(booking.date)
                const filterDate = date

                return (
                    bookingDate.getUTCDate() === filterDate.getUTCDate() &&
                    bookingDate.getUTCMonth() === filterDate.getUTCMonth() &&
                    bookingDate.getUTCFullYear() === filterDate.getUTCFullYear()
                )
            })
        }

        // Filter by search query
        if (query) {
            const lowercaseQuery = query.toLowerCase()
            filtered = filtered.filter(
                (booking) =>
                    booking.name.toLowerCase().includes(lowercaseQuery) ||
                    booking.status.toLowerCase().includes(lowercaseQuery) ||
                    booking.price.toLowerCase().includes(lowercaseQuery) ||
                    booking.capacity.toLowerCase().includes(lowercaseQuery) ||
                    booking.duration.toLowerCase().includes(lowercaseQuery),
            )
        }

        return filtered
    }

    // Handle date change
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate)
        setFilteredBookings(filterBookings(newDate, searchQuery))
    }

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        setFilteredBookings(filterBookings(date, query))
    }

    useEffect(() => {
        setFilteredBookings(filterBookings(date, searchQuery))
    }, [date, searchQuery])

    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search here..."
                            className="pl-8 h-9 w-full sm:w-[200px] rounded-md"
                            value={searchQuery}
                            onChange={handleSearch}
                            
                        />
                        <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <DatePicker date={date} onDateChange={handleDateChange} />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="default" size="sm" className="bg-black text-white flex items-center">
                                <span>Export</span>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.09083 13.8185C8.37792 13.8185 7.36896 13.317 6.57146 10.9185L6.13646 9.61346L4.83146 9.17846C2.43896 8.38096 1.9375 7.372 1.9375 6.65908C1.9375 5.95221 2.43896 4.93721 4.83146 4.13367L9.96083 2.42387C11.2417 1.99492 12.311 2.12179 12.9696 2.77429C13.6281 3.42679 13.755 4.50221 13.326 5.78304L11.6163 10.9124C10.8127 13.317 9.80375 13.8185 9.09083 13.8185ZM5.11542 4.99762C3.43583 5.5595 2.83771 6.22408 2.83771 6.65908C2.83771 7.09408 3.43583 7.75867 5.11542 8.3145L6.63792 8.822C6.77083 8.86429 6.87958 8.97304 6.92187 9.10596L7.42937 10.6285C7.98521 12.308 8.65583 12.9062 9.09083 12.9062C9.52583 12.9062 10.1904 12.308 10.7523 10.6285L12.4621 5.49908C12.7702 4.56867 12.7158 3.80742 12.3231 3.41471C11.9304 3.022 11.1692 2.97367 10.2448 3.28179L5.11542 4.99762Z" fill="white" />
                                    <path d="M6.60786 9.44967C6.49307 9.44967 6.37828 9.40738 6.28766 9.31676C6.11245 9.14155 6.11245 8.85155 6.28766 8.67634L8.45057 6.50738C8.62578 6.33217 8.91578 6.33217 9.09099 6.50738C9.2662 6.68259 9.2662 6.97259 9.09099 7.1478L6.92807 9.31676C6.84349 9.40738 6.72266 9.44967 6.60786 9.44967Z" fill="white" />
                                </svg>

                            </Button>
                        </motion.div>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <motion.div
                className="rounded-md border hidden md:block"
                variants={tableVariants}
                initial="hidden"
                animate="visible"
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead className="cursor-pointer">
                                Duration
                                <ChevronDown className="ml-2 h-4 w-4 inline" />
                            </TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <motion.tr
                                    key={booking.id}
                                    variants={rowVariants}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                >
                                    <TableCell className="font-medium">{booking.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`
                        ${booking.status === "Completed"
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : booking.status === "In Progress"
                                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                        : "bg-red-100 text-red-800 border-red-200"
                                                }
                      `}
                                        >
                                            {booking.status === "In Progress" && "• "}
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{booking.price}</TableCell>
                                    <TableCell>{booking.capacity}</TableCell>
                                    <TableCell>{booking.duration}</TableCell>
                                    <TableCell>
                                        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                                View Booking Details →
                                            </Button>
                                        </motion.div>
                                    </TableCell>
                                </motion.tr>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No bookings found for the selected filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </motion.div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking, index) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex justify-between">
                                        <span>{booking.name}</span>
                                        <Badge
                                            variant="outline"
                                            className={`
                        ${booking.status === "Completed"
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : booking.status === "In Progress"
                                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                        : "bg-red-100 text-red-800 border-red-200"
                                                }
                      `}
                                        >
                                            {booking.status === "In Progress" && "• "}
                                            {booking.status}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-muted-foreground">Price:</div>
                                        <div>{booking.price}</div>
                                        <div className="text-muted-foreground">Capacity:</div>
                                        <div>{booking.capacity}</div>
                                        <div className="text-muted-foreground">Duration:</div>
                                        <div>{booking.duration}</div>
                                    </div>
                                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-800 mt-2 w-full justify-center"
                                        >
                                            View Booking Details →
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <Card>
                        <CardContent className="py-6 text-center text-muted-foreground">
                            No bookings found for the selected filters.
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex items-center justify-between">
                <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </Button>
                </motion.div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3].map((pageNum) => (
                        <motion.div key={pageNum} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant={page === pageNum ? "default" : "outline"}
                                size="sm"
                                className={page === pageNum ? "bg-black text-white" : ""}
                                onClick={() => setPage(pageNum)}
                            >
                                {pageNum}
                            </Button>
                        </motion.div>
                    ))}
                    <span className="hidden sm:inline">...</span>
                    {[8, 9, 10].map((pageNum) => (
                        <motion.div key={pageNum} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
                            <Button variant="outline" size="sm" onClick={() => setPage(pageNum)}>
                                {pageNum}
                            </Button>
                        </motion.div>
                    ))}
                </div>
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
