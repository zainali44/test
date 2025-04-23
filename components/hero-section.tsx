"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { Users } from "lucide-react"
import ClientLogos from "./client-logos"

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-10 w-40 h-40 bg-pink-600/10 rounded-full blur-[80px] animate-float"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-700/20 border border-purple-500/20 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-purple-200">Trusted by millions worldwide</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            >
              Online Security Meets{" "}
              <span className="relative">
                Global
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></span>
              </span>{" "}
              Connectivity
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-2">
                83% off SecureVPN
              </h2>
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-4">
                + 3 extra months
              </p>
              <p className="text-white/90 text-lg">& Free 1GB Truly eSIM Data</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-medium px-8 py-6 text-base rounded-full shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-1"
              >
                Get SecureVPN
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-purple-800/30 hover:bg-purple-800/50 text-white border-purple-700/50 px-8 py-6 text-base rounded-full shadow-lg shadow-purple-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 backdrop-blur-sm"
              >
                <Users className="mr-2 h-5 w-5" />
                Try Teams Plan
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative z-10"
            >
              <div className="relative">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Fnew-year-banner-left-img.webp?alt=media&token=4118885b-7fe0-4f30-bf46-42f6bc3d85ea"
                  width={800}
                  height={600}
                  alt="VPN Dashboard Interface"
                  className="rounded-xl shadow-2xl border border-purple-800/30"
                />

                {/* Glow effect behind the image */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl blur-xl -z-10 opacity-70"></div>

                {/* Animated dots */}
                <motion.div
                  className="absolute top-1/4 right-8 h-2 w-2 rounded-full bg-green-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute bottom-1/3 left-10 h-2 w-2 rounded-full bg-blue-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute bottom-0 right-0 z-20 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-xl max-w-[200px] transform translate-y-1/4"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="bg-green-500 h-3 w-3 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    backgroundColor: ["#10b981", "#34d399", "#10b981"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <p className="text-white font-medium text-sm">Free 1GB</p>
              </div>
              <p className="text-white text-lg font-bold">eSIM Data</p>

              {/* Animated arrow */}
              <motion.div
                className="absolute -right-2 -bottom-2 h-6 w-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Connection lines animation */}
            <svg className="absolute inset-0 w-full h-full z-0 opacity-30" viewBox="0 0 800 600">
              <motion.path
                d="M200,300 C300,100 500,500 600,300"
                stroke="url(#gradient1)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, delay: 1 }}
              />
              <motion.path
                d="M150,400 C250,200 550,400 650,200"
                stroke="url(#gradient2)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, delay: 1.5 }}
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
          </motion.div>
        </div>

        {/* <ClientLogos /> */}
      </div>
    </section>
  )
}
