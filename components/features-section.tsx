"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"
import Image from "next/image"

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 max-w-xl"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Private. Limitless.
              <br />
              Safer Browsing
            </h2>

            <p className="text-base text-gray-600 mb-6 max-w-lg">
              Bring internet freedom to your fingertips. Encrypt your internet connection and access whatever you want
              with up to 10 logins using one crestVPN account.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-7 py-5 rounded-full text-base group">
                <span>Get crestVPN</span>
                <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative">

              {/* Person image */}
              <div className="relative z-10">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Fbrowsing-safe-img.webp?alt=media&token=7a39537e-2a41-476e-9efd-b38027b03349"
                  width={500}
                  height={600}
                  alt="Person using crestVPN on phone"
                  className="relative z-10"
                />
              </div>

              {/* UI Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute top-[30%] left-[5%] bg-white rounded-xl shadow-lg p-3 z-20 flex items-center gap-2"
              >
                <div className="bg-gray-900 rounded-full p-1.5">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-sm text-gray-800">crestvpn</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute top-[45%] left-[10%] bg-white rounded-xl shadow-lg p-3 z-20 flex items-center gap-2"
              >
                <div className="bg-green-100 rounded-full p-1">
                  <Shield className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Security Status</div>
                  <div className="font-medium text-sm text-green-500">Protected</div>
                </div>
              </motion.div>

              {/* Phone highlight */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute bottom-[30%] right-[15%] z-20"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 20L15 25L30 10"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
