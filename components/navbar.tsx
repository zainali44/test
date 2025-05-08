"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import router from "next/router"

// Simplified nav items as requested
const navItems = [
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "VPN for Teams",
    href: "/coming-soon",
  },
  {
    title: "Help",
    href: "#",
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Set scrolled to true by default on pages other than home
  const isNotHomePage = pathname !== "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10 || isNotHomePage)
    }

    // Set initial state
    setScrolled(isNotHomePage)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isNotHomePage])

  // Staggered animation for nav items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemAnimation = {
    hidden: { y: -20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    },
  }

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 md:px-8 transition-all duration-500 flex justify-center",
          scrolled ? "py-2 sm:py-3" : "py-12 sm:py-8",
        )}
      >
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // Custom bezier curve for a lazy animation
            delay: 0.2,
          }}
          className={cn(
            "transition-all duration-500 w-full",
            scrolled ? "bg-white shadow-md rounded-full max-w-6xl px-6" : "bg-transparent",
          )}
        >
          <div className="flex items-center justify-between h-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.3,
              }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <img src="/logo.png" alt="Crest Logo" className="w-8 h-8 object-contain p-0.5" />
                  <motion.div
                    className={cn(
                      "absolute inset-0 rounded-full blur-md -z-10",
                      scrolled ? "bg-purple-500/10" : "bg-purple-500/30",
                    )}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <span
                  className={cn(
                    "font-bold text-lg transition-colors duration-300",
                    scrolled ? "text-purple-700 group-hover:text-purple-800" : "text-white group-hover:text-purple-300",
                  )}
                >
                  CREST VPN
                </span>
              </Link>
            </motion.div>

            <motion.nav
              variants={container}
              initial="hidden"
              animate="show"
              className="hidden lg:flex items-center gap-8"
            >
              {navItems.map((item, index) => (
                <motion.div key={index} variants={itemAnimation}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-xs font-medium transition-colors group",
                      scrolled ? "text-gray-700 hover:text-gray-900" : "text-white/90 hover:text-white",
                    )}
                  >
                    <span>{item.title}</span>
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ease-out",
                        scrolled
                          ? "bg-gradient-to-r from-purple-700 to-transparent"
                          : "bg-gradient-to-r from-purple-400 to-transparent",
                      )}
                    ></span>
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="hidden lg:flex items-center gap-4"
            >
              {user ? (
                <motion.div variants={itemAnimation} className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300",
                      scrolled 
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}>
                      <User className="h-4 w-4" />
                      <span className="text-xs font-medium truncate max-w-[120px]">
                        {user.name || user.email}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-100">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <span className="text-xs truncate w-full max-w-[200px]">{user.email}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/dashboard" className="flex w-full">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/profile" className="flex w-full">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <>
                  <motion.div variants={itemAnimation}>
                    <Link
                      href="/login"
                      className={cn(
                        "transition-all duration-300 text-xs",
                        scrolled
                          ? "text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 bg-transparent"
                          : "text-white border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 bg-transparent hover:shadow-lg hover:shadow-white/20 rounded-full px-5 py-2 flex items-center gap-2",
                      )}
                    >
                      Login
                    </Link>
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-600/20 border-0 transition-all duration-300 text-xs rounded-full px-8 py-4 flex items-center gap-2"
                      onClick={() => router.push('/payment')}
                    >
                      Get CREST VPN
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>

            <div className="flex items-center gap-2 lg:hidden">
              {!user && (
                <Link href="/login">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "text-xs",
                      scrolled
                        ? "text-gray-700"
                        : "text-white"
                    )}
                  >
                    Login
                  </Button>
                </Link>
              )}
              
              <Link href={user ? "/dashboard" : "#"}>
                <Button
                  size="sm"
                  className={cn(
                    "text-xs bg-gradient-to-r",
                    user
                      ? "from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
                      : "from-red-600 to-red-500 hover:from-red-500 hover:to-red-400",
                    "text-white shadow-sm border-0 rounded-full px-4"
                  )}
                >
                  {user ? "Dashboard" : "Get VPN"}
                </Button>
              </Link>
            </div>
          </div>
        </motion.header>
      </div>
    </>
  )
}
