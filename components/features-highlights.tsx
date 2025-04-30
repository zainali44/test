"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface FeatureProps {
  icon: string
  title: string
  description: string | React.ReactNode
}

const FeatureCard = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="flex flex-col items-center text-center h-full">
      <div className="mb-6 h-20 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <Image 
            src={icon} 
            alt={title} 
            fill
            className="object-contain"
          />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-[#280068]">{title}</h3>
      <div className="text-center text-gray-700">{description}</div>
    </div>
  )
}

export default function FeaturesHighlights() {
  const features = [
    {
      icon: "/global.png",
      title: "Global Servers",
      description: (
        <div>
          <p className="font-medium">100+ locations</p>
          <p>worldwide</p>
        </div>
      ),
    },
    {
      icon: "/shield.png",
      title: "Military-grade Encryption",
      description: (
        <div>
          <p className="font-medium">AES, 265 bit</p>
          <p>Security</p>
        </div>
      ),
    },
    {
      icon: "/infinity.png",
      title: "Unlimited Bandwidth",
      description: (
        <div>
          <p className="font-medium">No throttling</p>
          <p>ever</p>
        </div>
      ),
    },
    {
      icon: "/power.png",
      title: "Unlimited Speed",
      description: (
        <div>
          <p className="font-medium">No throttling</p>
          <p>ever</p>
        </div>
      ),
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#280068] mb-8">Why Cresrt Stand Out</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 