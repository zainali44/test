"use client"

import { useState, useEffect } from "react"
import { Bell, Search, ChevronDown, Menu, LogOut, User, Settings, CreditCard } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/hooks/use-sidebar"
import { useAuth } from "@/app/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function Header() {
  const [notifications, setNotifications] = useState(3)
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
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-[240px] h-9 bg-gray-50 border-gray-100 focus:bg-white"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
              <Avatar className="h-8 w-8 bg-purple-100">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-purple-600 text-white">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{name}</span>
                <span className="text-xs text-gray-500">{email}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-100">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
