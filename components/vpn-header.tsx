"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function VpnHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 bg-[#1f0045]/80 backdrop-blur-lg border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="mr-3 relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-white"></div>
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <Image src="/logo.png" alt="Crest Logo" width={20} height={20} />
            </div>
          </div>
          <span className="text-white text-2xl font-bold">CREST VPN</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-12">
          <Link href="/pricing" className="text-white hover:text-purple-300 transition">
            Pricing
          </Link>
          <Link href="/teams" className="text-white hover:text-purple-300 transition">
            VPN for Teams
          </Link>
          <Link href="/help" className="text-white hover:text-purple-300 transition">
            Help
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-white font-medium hover:text-purple-300 transition">
            Login
          </Link>
          <Button 
            className="bg-[#9333EA] hover:bg-[#A855F7] text-white font-medium rounded-full px-6 py-2 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-1"
          >
            Get Crest Vpn
          </Button>
        </div>
      </div>
    </header>
  )
} 