"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, Search, Download, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { users, type User } from "@/data/users"
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

export function UserRegistrationsTable() {
    const [page, setPage] = useState(1)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
    const [searchQuery, setSearchQuery] = useState("")

    // Filter users based on date and search query
    const filterUsers = (date: Date | undefined, query: string) => {
        let filtered = [...users]

        // Filter by date if selected
        if (date) {
            filtered = filtered.filter((user) => {
                // Parse the ISO string date
                const userDate = parseISO(user.date)
                const filterDate = date

                return (
                    userDate.getUTCDate() === filterDate.getUTCDate() &&
                    userDate.getUTCMonth() === filterDate.getUTCMonth() &&
                    userDate.getUTCFullYear() === filterDate.getUTCFullYear()
                )
            })
        }

        // Filter by search query
        if (query) {
            const lowercaseQuery = query.toLowerCase()
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(lowercaseQuery) ||
                    user.category.toLowerCase().includes(lowercaseQuery) ||
                    user.joinDate.toLowerCase().includes(lowercaseQuery) ||
                    user.email.toLowerCase().includes(lowercaseQuery),
            )
        }

        return filtered
    }

    // Handle date change
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate)
        setFilteredUsers(filterUsers(newDate, searchQuery))
    }

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        setFilteredUsers(filterUsers(date, query))
    }

    // Update filtered users when date or search query changes
    useEffect(() => {
        setFilteredUsers(filterUsers(date, searchQuery))
    }, [date, searchQuery])

    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">New User Registrations</h2>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search here..."
                            className="pl-8 h-9 w-full sm:w-[200px]"
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
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.09083 13.3185C8.37792 13.3185 7.36896 12.817 6.57146 10.4185L6.13646 9.11346L4.83146 8.67846C2.43896 7.88096 1.9375 6.872 1.9375 6.15908C1.9375 5.45221 2.43896 4.43721 4.83146 3.63367L9.96083 1.92387C11.2417 1.49492 12.311 1.62179 12.9696 2.27429C13.6281 2.92679 13.755 4.00221 13.326 5.28304L11.6162 10.4124C10.8127 12.817 9.80375 13.3185 9.09083 13.3185ZM5.11542 4.49762C3.43583 5.0595 2.83771 5.72408 2.83771 6.15908C2.83771 6.59408 3.43583 7.25867 5.11542 7.8145L6.63792 8.322C6.77083 8.36429 6.87958 8.47304 6.92187 8.60596L7.42937 10.1285C7.98521 11.808 8.65583 12.4062 9.09083 12.4062C9.52583 12.4062 10.1904 11.808 10.7523 10.1285L12.4621 4.99908C12.7702 4.06867 12.7158 3.30742 12.3231 2.91471C11.9304 2.522 11.1692 2.47367 10.2448 2.78179L5.11542 4.49762Z" fill="white" />
                                    <path d="M6.60786 8.95065C6.49307 8.95065 6.37828 8.90836 6.28766 8.81773C6.11245 8.64253 6.11245 8.35253 6.28766 8.17732L8.45057 6.00836C8.62578 5.83315 8.91578 5.83315 9.09099 6.00836C9.2662 6.18357 9.2662 6.47357 9.09099 6.64878L6.92807 8.81773C6.84349 8.90836 6.72266 8.95065 6.60786 8.95065Z" fill="white" />
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
                            <TableHead>Category</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead className="cursor-pointer">
                                Email
                                <ChevronDown className="ml-2 h-4 w-4 inline" />
                            </TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    variants={rowVariants}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                >
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`
                        ${user.category === "Guest"
                                                    ? "bg-cyan-100 text-cyan-800 border-cyan-200 rounded-full"
                                                    : "bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full"
                                                }
                      `}
                                        >
                                            {user.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.joinDate}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-800 rounded-full text-xs"
                                                >
                                                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.45 11.875H4.55C4.105 11.875 3.535 11.64 3.225 11.325L1.175 9.27499C0.860003 8.95999 0.625 8.39 0.625 7.95V5.05C0.625 4.605 0.860003 4.03501 1.175 3.72501L3.225 1.675C3.54 1.36 4.11 1.125 4.55 1.125H7.45C7.895 1.125 8.465 1.36 8.775 1.675L10.825 3.72501C11.14 4.04001 11.375 4.61 11.375 5.05V7.95C11.375 8.395 11.14 8.96499 10.825 9.27499L8.775 11.325C8.46 11.64 7.895 11.875 7.45 11.875ZM4.55 1.875C4.305 1.875 3.925 2.03 3.755 2.205L1.705 4.255C1.535 4.43 1.375 4.805 1.375 5.05V7.95C1.375 8.195 1.53 8.575 1.705 8.745L3.755 10.795C3.93 10.965 4.305 11.125 4.55 11.125H7.45C7.695 11.125 8.075 10.97 8.245 10.795L10.295 8.745C10.465 8.56999 10.625 8.195 10.625 7.95V5.05C10.625 4.805 10.47 4.425 10.295 4.255L8.245 2.205C8.07 2.035 7.695 1.875 7.45 1.875H4.55Z" fill="#EA4335" />
                                                        <path d="M4.24973 8.62473C4.15473 8.62473 4.05973 8.58972 3.98473 8.51472C3.83973 8.36972 3.83973 8.12973 3.98473 7.98473L7.48473 4.48473C7.62973 4.33973 7.86973 4.33973 8.01473 4.48473C8.15973 4.62973 8.15973 4.86973 8.01473 5.01473L4.51473 8.51472C4.43973 8.58972 4.34473 8.62473 4.24973 8.62473Z" fill="#EA4335" />
                                                        <path d="M7.74973 8.62473C7.65473 8.62473 7.55973 8.58972 7.48473 8.51472L3.98473 5.01473C3.83973 4.86973 3.83973 4.62973 3.98473 4.48473C4.12973 4.33973 4.36973 4.33973 4.51473 4.48473L8.01473 7.98473C8.15973 8.12973 8.15973 8.36972 8.01473 8.51472C7.93973 8.58972 7.84473 8.62473 7.74973 8.62473Z" fill="#EA4335" />
                                                    </svg>

                                                    Decline
                                                </Button>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-800 rounded-full text-xs"
                                                >
                                                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6 11.875C3.035 11.875 0.625 9.465 0.625 6.5C0.625 3.535 3.035 1.125 6 1.125C8.965 1.125 11.375 3.535 11.375 6.5C11.375 9.465 8.965 11.875 6 11.875ZM6 1.875C3.45 1.875 1.375 3.95 1.375 6.5C1.375 9.05 3.45 11.125 6 11.125C8.55 11.125 10.625 9.05 10.625 6.5C10.625 3.95 8.55 1.875 6 1.875Z" fill="#00A559" />
                                                        <path d="M5.28973 8.2898C5.18973 8.2898 5.09473 8.2498 5.02473 8.1798L3.60973 6.7648C3.46473 6.6198 3.46473 6.3798 3.60973 6.2348C3.75473 6.0898 3.99473 6.0898 4.13973 6.2348L5.28973 7.3848L7.85973 4.8148C8.00473 4.6698 8.24473 4.6698 8.38973 4.8148C8.53473 4.9598 8.53473 5.1998 8.38973 5.3448L5.55473 8.1798C5.48473 8.2498 5.38973 8.2898 5.28973 8.2898Z" fill="#00A559" />
                                                    </svg>

                                                    Approve
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No users found for the selected filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </motion.div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex justify-between">
                                        <span>{user.name}</span>
                                        <Badge
                                            variant="outline"
                                            className={`
                        ${user.category === "Guest"
                                                    ? "bg-cyan-100 text-cyan-800 border-cyan-200"
                                                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                }
                      `}
                                        >
                                            {user.category}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-muted-foreground">Join Date:</div>
                                        <div>{user.joinDate}</div>
                                        <div className="text-muted-foreground">Email:</div>
                                        <div className="truncate">{user.email}</div>
                                    </div>
                                    <div className="flex space-x-2 mt-3">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-800 w-full"
                                            >
                                                Decline
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-800 w-full"
                                            >
                                                Approve
                                            </Button>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <Card>
                        <CardContent className="py-6 text-center text-muted-foreground">
                            No users found for the selected filters.
                        </CardContent>
                    </Card>
                )}
            </div>
        </motion.div>
    )
}
