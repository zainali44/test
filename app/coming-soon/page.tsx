"use client"

import { motion } from "framer-motion"
import { Shield, Star, Calendar, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ComingSoonPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  const floatingAnimation = {
    y: ["-5%", "0%", "-5%"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  const shimmerAnimation = {
    background: ["linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)", 
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 100%, rgba(255,255,255,0) 100%)",
                "linear-gradient(90deg, rgba(255,255,255,0) 100%, rgba(255,255,255,0.5) 100%, rgba(255,255,255,0) 100%)"],
    backgroundSize: ["200% 100%", "200% 100%", "200% 100%"],
    backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Enterprise-grade encryption for your entire team"
    },
    {
      icon: Star,
      title: "Premium Support",
      description: "24/7 dedicated technical assistance"
    },
    {
      icon: Calendar,
      title: "Flexible Plans",
      description: "Scale as your team grows with customizable options"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600 rounded-full blur-[120px]" />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-400 rounded-full blur-[80px]"
          animate={pulseAnimation}
        />
      </motion.div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div
            className="mx-auto mb-8 relative"
            variants={itemVariants}
          >
            <motion.div 
              className="relative mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.05 }}
              animate={floatingAnimation}
            >
              <Shield className="h-10 w-10 text-white" />
              <motion.div 
                className="absolute inset-0 rounded-2xl blur-md -z-10 bg-purple-500"
                animate={pulseAnimation}
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 w-full h-full mx-auto rounded-2xl blur-xl opacity-40 bg-purple-500"
              animate={pulseAnimation}
            />
          </motion.div>

          {/* Header */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            variants={itemVariants}
          >
            VPN for Teams
          </motion.h1>
          
          <motion.div
            className="text-white/80 text-lg md:text-xl mb-8"
            variants={itemVariants}
          >
            <motion.span
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
            >
              Coming Soon
              <motion.span 
                className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                animate={shimmerAnimation}
              />
            </motion.span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-white/70 text-lg mb-12 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            We're building the most secure and reliable VPN solution designed specifically for teams. 
            Enterprise-grade protection with a user-friendly experience.
          </motion.p>

          {/* Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl mb-16 max-w-md mx-auto border border-white/20"
            variants={itemVariants}
          >
            <h3 className="text-white text-xl font-medium mb-4">Get notified when we launch</h3>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white py-3 px-6">
                Notify Me
              </Button>
            </div>
            <p className="text-white/50 text-xs mt-2">We'll never share your email with anyone else.</p>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl"
                variants={itemVariants}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4 mx-auto"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="h-6 w-6 text-purple-400" />
                </motion.div>
                <h3 className="text-white text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Back button */}
          <motion.div
            className="mt-16"
            variants={itemVariants}
          >
            <Link href="/">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer notification */}
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div 
          className="bg-purple-900/80 backdrop-blur-md border border-purple-700/50 rounded-lg p-4 flex items-center gap-3 shadow-lg"
          whileHover={{ scale: 1.03 }}
        >
          <div className="bg-purple-600/30 p-2 rounded-full">
            <BellRing className="h-5 w-5 text-purple-300" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Development in Progress</p>
            <p className="text-white/70 text-xs">We'll notify you when it's ready</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 