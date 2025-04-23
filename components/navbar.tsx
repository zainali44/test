"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

// Simplified nav items as requested
const navItems = [
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "VPN for Teams",
    href: "#",
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
          "fixed top-0 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-500 flex justify-center",
          scrolled ? "py-3" : "py-5",
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
                  <Shield
                    className={cn(
                      "h-8 w-8 transition-colors duration-300",
                      scrolled
                        ? "text-purple-700 group-hover:text-purple-800"
                        : "text-white group-hover:text-purple-300",
                    )}
                  />
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
              <motion.div variants={itemAnimation}>
                <Button
                  size="sm"
                  className={cn(
                    "transition-all duration-300 text-xs",
                    scrolled
                      ? "text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 bg-transparent"
                      : "text-white border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 bg-transparent",
                  )}
               
                >
                  Login
                </Button>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-600/20 border-0 transition-all duration-300 text-xs rounded-full px-8 py-4 flex items-center gap-2"
                  
                >
                  Get CREST VPN
                </Button>
              </motion.div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative">
                {mobileMenuOpen ? (
                  <X className={scrolled ? "h-6 w-6 text-gray-700" : "h-6 w-6 text-white"} />
                ) : (
                  <Menu className={scrolled ? "h-6 w-6 text-gray-700" : "h-6 w-6 text-white"} />
                )}
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-full blur-md -z-10",
                    scrolled ? "bg-purple-500/10" : "bg-purple-500/30",
                  )}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.button>
          </div>
        </motion.header>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                height: {
                  duration: 0.5,
                  ease: [0.04, 0.62, 0.23, 0.98], // Custom easing for a smooth, lazy animation
                },
                opacity: { duration: 0.3 },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
              },
            }}
            className={cn(
              "fixed top-16 left-0 right-0 z-40 shadow-lg lg:hidden overflow-hidden",
              scrolled
                ? "bg-white border-t border-gray-200"
                : "bg-gradient-to-b from-purple-950 to-purple-900/95 backdrop-blur-md border-t border-purple-800/30",
            )}
          >
            <div className="p-6 flex flex-col gap-4">
              <nav className="flex flex-col gap-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.1 * index,
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    }}
                    exit={{
                      x: -20,
                      opacity: 0,
                      transition: {
                        delay: 0.05 * index,
                        duration: 0.3,
                      },
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "px-3 py-3 text-lg font-medium transition-colors flex items-center justify-between group",
                        scrolled ? "text-gray-700 hover:text-gray-900" : "text-white/90 hover:text-white",
                      )}
                    >
                      <span>{item.title}</span>
                      <motion.div
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "absolute bottom-0 left-0 h-0.5",
                          scrolled
                            ? "bg-gradient-to-r from-purple-700 to-transparent"
                            : "bg-gradient-to-r from-purple-400 to-transparent",
                        )}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col gap-3 mt-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.4,
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }}
                  exit={{ y: 20, opacity: 0 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "transition-all duration-300 text-xs",
                      scrolled
                        ? "text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                        : "text-white border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40",
                    )}
                  >
                    Login
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.5,
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }}
                  exit={{ y: 20, opacity: 0 }}
                >
                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-6 text-base">
                    Get CRESTVPN
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
