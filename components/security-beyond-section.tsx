"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, Globe, FileHeart, FolderLock, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from "embla-carousel-react"

export default function SecurityBeyondSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Track if we're at the beginning or end for button states
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  const securityFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-yellow-400" />,
      title: "Tracker Blocker",
      description:
        "With one-click tracker blocker in crestVPN, you simply prevent your personal information being tracked while browsing.",
    },
    {
      icon: <Globe className="w-8 h-8 text-yellow-400" />,
      title: "Dark Web Monitoring",
      description:
        "Stay one step ahead of dark web threats with continuous monitoring, timely alerts, and tailored recommendations.",
    },
    {
      icon: <FileHeart className="w-8 h-8 text-yellow-400" />,
      title: "Remove my Data",
      description:
        "Track down the data brokers that have access to your personal information with Remove my data feature and get it erased.",
    },
    {
      icon: <FolderLock className="w-8 h-8 text-yellow-400" />,
      title: "Password Manager",
      description:
        "Give your passwords a safe home and sync them across your teams. You can store and generate unlimited passwords with breach scanner that tells you if your passwords are exposed.",
    },
    {
      icon: <Shield className="w-8 h-8 text-yellow-400" />,
      title: "crest Browsing",
      description:
        "Browse the internet with complete peace of mind knowing your connection is encrypted and your identity is protected.",
    },
    {
      icon: <Globe className="w-8 h-8 text-yellow-400" />,
      title: "Global Access",
      description:
        "Access content from anywhere in the world with our global network of high-speed servers optimized for streaming and browsing.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-[#0e1525]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-white">Security</span> <span className="text-yellow-400">Beyond VPN</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="min-w-0 flex-none w-[85%] sm:w-[45%] md:w-[31%] lg:w-[23%]"
                >
                  <div className="bg-[#1e2738] rounded-3xl p-8 h-full">
                    <div className="mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <div className="flex gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full px-8 py-6">
                  Get Max Plan <span className="ml-2 font-bold">83% off</span>
                </Button>
              </motion.div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  canScrollPrev
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  canScrollNext
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}