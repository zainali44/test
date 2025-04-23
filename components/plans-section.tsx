"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, User, Users } from "lucide-react"

export default function PlansSection() {
  return (
    <section className="py-20 px-4 bg-[#f8f7ff]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-20 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
            <span className="text-gray-400">
              Imagine this: everything on internet is accessible with complete privacy at exceptional value.
            </span>{" "}
            <span className="text-gray-900 font-bold">Sounds like a dream, no?</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left side text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/3"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Get global access of over 6000 VPN servers.
            </h3>
            <p className="text-gray-600 text-lg">Designed for both personal and team use.</p>
          </motion.div>

          {/* Right side cards */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-purple-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal</h3>
              </div>

              <p className="text-gray-600 mb-auto">
                Unlock complete internet freedom & restricted content for yourself.
              </p>

              <div className="mt-8">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white group flex items-center" size="sm">
                  <span>Try Personal Plan</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

            {/* Teams card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-purple-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Teams</h3>
              </div>

              <p className="text-gray-600 mb-auto">
                Explore business-ready network security for your company with admin panel, private gateways, and more.
              </p>

              <div className="mt-8">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white group flex items-center" size="sm">
                  <span>Try Teams Plan</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
