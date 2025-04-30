"use client"

import { useState, useEffect } from "react"
import { LogOut, User, Settings, CreditCard, Menu, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/hooks/use-sidebar"
import { useAuth } from "@/app/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function Header() {
  const { toggleSidebar } = useSidebar()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [initials, setInitials] = useState("U")
  const [name, setName] = useState("User")
  const [email, setEmail] = useState("")
  
  // Update user display information when the user state changes
  useEffect(() => {
    // Only update user details if we have an actual user object
    if (user) {
      // Use user's email to set display data if we have it
      if (user.email) {
        // Set email (only update if different to prevent loops)
        if (email !== user.email) {
          setEmail(user.email)
        }
        
        // Generate initials from email (first letter)
        const emailInitial = user.email.charAt(0).toUpperCase()
        if (initials !== emailInitial) {
          setInitials(emailInitial)
        }
        
        // Derive name from email if no name is provided
        if (!user.name) {
          const userName = user.email.split('@')[0]
          // Format the name: capitalize first letter and add spaces between camelCase segments
          const formattedName = userName
            // Insert a space before any capital letter that follows a lowercase letter
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            // Insert a space before any number that follows a letter or vice versa
            .replace(/([a-zA-Z])(\d)|(\d)([a-zA-Z])/g, '$1$3 $2$4')
            // Capitalize the first letter of each word
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          if (name !== formattedName) {
            setName(formattedName)
          }
        } else {
          // Use the provided name
          if (name !== user.name) {
            setName(user.name)
          }
        }
      } else if (name !== "User" || email !== "" || initials !== "U") {
        // Reset to defaults if user has no email
        setName("User")
        setEmail("")
        setInitials("U")
      }
    } else if (name !== "User" || email !== "" || initials !== "U") {
      // Reset to defaults if no user
      setName("User")
      setEmail("")
      setInitials("U")
    }
  }, [user, name, email, initials])
  
  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-100 h-14 md:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-500 hover:text-gray-700 h-8 w-8"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="md:hidden flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-md bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
            </div>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-8 md:h-9 px-1 md:px-2 rounded-full hover:bg-gray-100">
              <Avatar className="h-7 w-7 md:h-8 md:w-8 border border-gray-200">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-emerald-600 text-white font-medium text-xs md:text-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm">
                <span className="font-medium">{name}</span>
                <span className="text-xs text-gray-500">{email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-100 rounded-xl p-1">
            <DropdownMenuLabel className="px-2 py-1.5 text-sm text-gray-500">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
              <Link href="/dashboard/profile" className="flex items-center px-2 py-1.5">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="cursor-pointer text-red-600 rounded-lg" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
