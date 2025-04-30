"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function GlobalAccessSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-1 flex justify-center items-center px-4 sm:px-6 lg:px-0"
          >
            <div className="relative w-full sm:w-4/5 lg:w-full max-w-lg h-[300px] sm:h-[400px] lg:h-[450px]">
              <Image
                src="/Network.png"
                alt="Global Network Connectivity"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2 max-w-xl mx-auto lg:mx-0 px-4 sm:px-6 lg:px-0"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#280068] mb-6 leading-tight">
              Stream, Browse, and Connect—Anywhere
            </h2>
            <p className="text-base lg:text-lg text-gray-700 mb-8">
              No matter where you are, enjoy seamless access to the
              content you love. Whether it's shows, videos, or websites,
              stay connected at home or on the move.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start">
                <span className="text-[#280068] text-xl mr-3 flex-shrink-0">•</span>
                <span className="text-gray-700">Unblock your favorite platforms with ease</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#280068] text-xl mr-3 flex-shrink-0">•</span>
                <span className="text-gray-700">Smooth support for peer-to-peer sharing</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#280068] text-xl mr-3 flex-shrink-0">•</span>
                <span className="text-gray-700">Unlock region-based savings while shopping online</span>
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#9333EA] hover:bg-[#A855F7] text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 text-base sm:text-lg"
            >
              Explore Global Access
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 