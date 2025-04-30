"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { Users } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 overflow-hidden h-screen bg-[#1f0045]">
      {/* Animated background elements */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-10 w-40 h-40 bg-pink-600/10 rounded-full blur-[80px] animate-pulse"></div>

      {/* Placeholder for the globe image */}
      <div className="absolute inset-0 z-0">
        {/* You can add your globe image here */}
        <Image 
          src="/background.jpg" 
          alt="Global network" 
          fill 
          className="object-cover opacity-20"
        /> 
      </div>

      {/* Network globe effects */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <motion.path
            d="M200,300 C300,100 500,500 600,300"
            stroke="url(#gradient1)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.path
            d="M150,400 C250,200 550,400 650,200"
            stroke="url(#gradient2)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatType: "loop" }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Trusted by Millions Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-800/30 backdrop-blur-sm border border-purple-500/20">
            <Users className="w-4 h-4 mr-2 text-white/80" />
            <span className="text-sm font-medium text-white/80">Trusted by Millions Globally</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Unbreakable Security
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Unstoppable Freedom
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-lg md:text-xl text-white/80">
            Enjoy the internet your way safe, fast, and free from prying eyes
          </p>
        </motion.div>

        {/* Offer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center">
            <span className="inline-block mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="#FF3D00"
                  fillOpacity="0.2"
                />
                <path
                  d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C13.8565 5 15.637 5.7375 16.9497 7.05025C18.2625 8.36301 19 10.1435 19 12Z"
                  fill="#FF3D00"
                />
              </svg>
            </span>
            <h2 className="text-3xl font-bold text-white">83% Off + 3 Free Months + 1GB Free eSIM</h2>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap md:flex-nowrap justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-[#9333EA] hover:bg-[#A855F7] text-white font-medium px-6 sm:px-8 md:px-10 py-5 md:py-7 text-base md:text-lg rounded-full shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-1 w-[80%] sm:w-auto"
          >
            Get SecureVPN
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-[#1b0038]/70 hover:bg-[#3b0066]/70 text-white border-purple-700/50 px-6 sm:px-8 md:px-10 py-5 md:py-7 text-base md:text-lg rounded-full shadow-lg shadow-purple-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 backdrop-blur-sm w-[80%] sm:w-auto"
          >
            Try Teams Plan
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
