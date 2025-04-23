"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowUp, ArrowDown, ChevronUp, Monitor } from "lucide-react"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"

export default function AdvancedFeaturesSection() {
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [networkRef, networkInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [speedRef, speedInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* First Column */}
          <div className="space-y-6">
            {/* More than just a VPN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-800 to-purple-500 rounded-3xl p-8 text-white h-[220px] flex items-center"
            >
              <h3 className="text-3xl font-bold leading-tight">
                More
                <br />
                than just
                <br />a VPN
              </h3>
            </motion.div>

            {/* Stream without limits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 h-[180px]"
            >
              <div className="mb-4">
                <div className="w-12 h-12 flex items-center justify-center text-purple-700">
                  <Monitor className="w-8 h-8" />
                  <div className="absolute transform translate-y-1">
                    <div className="w-4 h-2 bg-purple-700 rounded-sm"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Stream
                <br />
                without limits
              </h3>
            </motion.div>
          </div>

          {/* Second Column */}
          <div className="space-y-6">
            {/* Beach chair illustration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-6 flex justify-center items-center h-[220px]"
            >
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Fsecure-internet.webp?alt=media&token=4c38a86f-c3a5-4b87-ba69-c29fb41e0ec4"
                width={180}
                height={180}
                alt="Beach chair with umbrella"
                className="w-40 h-40 object-contain"
              />
            </motion.div>

            {/* crest your online activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 h-[180px]"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">crest your online activities</h3>
              <p className="text-gray-600 text-sm">One app to protect your digital footprint.</p>
            </motion.div>
          </div>

          {/* Center Column - VPN App UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 lg:col-span-1 row-span-2"
          >
            <div className="bg-white rounded-3xl shadow-lg p-6 h-full">
              {/* Location */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-red-100">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Fdownload%20(1).png?alt=media&token=ac419f89-e86d-41d5-92db-d47649f7449d"
                      width={24}
                      height={24}
                      alt="German flag"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Frankfurt,DE</div>
                    <div className="text-xs text-gray-500">VPN IP: 231.112.121.12</div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-xs text-purple-600 mb-6">
                03:23:56
                <br />
                <span className="text-gray-500 hover:text-purple-600 cursor-pointer">Change Server</span>
              </div>

              {/* Connection Button */}
              <div className="flex justify-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-800 to-purple-600 flex items-center justify-center cursor-pointer"
                >
                  <motion.div
                    animate={{
                      opacity: [0.8, 1, 0.8],
                      scale: [0.98, 1, 0.98],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="text-white"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 3V12M18.36 6.64C19.6 7.88 20.25 9.56 20.25 11.25C20.25 12.94 19.6 14.62 18.36 15.86C17.12 17.1 15.44 17.75 13.75 17.75C12.06 17.75 10.38 17.1 9.14 15.86C7.9 14.62 7.25 12.94 7.25 11.25C7.25 9.56 7.9 7.88 9.14 6.64C10.38 5.4 12.06 4.75 13.75 4.75C15.44 4.75 17.12 5.4 18.36 6.64Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </motion.div>
              </div>

              <div className="text-center text-sm font-medium text-gray-900 mb-6">Connected</div>

              {/* Upload/Download Stats */}
              <div ref={speedRef} className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <ArrowUp className="w-5 h-5 mx-auto text-gray-500 mb-2" />
                  <div className="font-bold text-lg">
                    {speedInView ? (
                      <CountUp
                        start={0}
                        end={91.85}
                        duration={2}
                        decimals={2}
                        decimal="."
                        suffix=" kbps"
                        useEasing={true}
                      />
                    ) : (
                      "91.85 kbps"
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Uploaded</div>
                </div>
                <div className="text-center">
                  <ArrowDown className="w-5 h-5 mx-auto text-gray-500 mb-2" />
                  <div className="font-bold text-lg">
                    {speedInView ? (
                      <CountUp
                        start={0}
                        end={2.3}
                        duration={2}
                        decimals={1}
                        decimal="."
                        suffix=" MB"
                        useEasing={true}
                      />
                    ) : (
                      "2.3 MB"
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Downloaded</div>
                </div>
              </div>

              {/* Tracker Blocker */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-6">
                <div className="text-sm font-medium text-gray-700">Tracker Blocker</div>
                <div className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>

              {/* Connection Details */}
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Connection Details</span>
                <ChevronUp className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Fourth Column */}
          <div className="space-y-6">
            {/* Steady & crest */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 h-[140px]"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full">
                  {/* <Image
                    src="https://images.crestvpn-tools.com/wp-content/uploads/en/2024/10/shopping-dollar.webp"
                    width={24}
                    height={24}
                    alt="crest connection"
                    className="w-12 h-12 object-contain"
                  /> */}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Steady & crest connection with Personal IP</h3>
                </div>
              </div>
            </motion.div>

            {/* Your data, your rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 h-[140px]"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your data, your rules</h3>
              <p className="text-gray-600 text-xs">Control your personal data and prevent it from being misused.</p>
            </motion.div>

            {/* Block trackers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 h-[100px] flex items-center"
            >
              <h3 className="text-lg font-bold text-gray-900">Block trackers that track you</h3>
            </motion.div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl p-6 md:col-span-2 lg:col-span-3"
            ref={statsRef}
          >
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <div className="px-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {statsInView ? (
                    <>
                      <CountUp start={0} end={3} duration={2.5} useEasing={true} />
                      <span className="text-sm align-top">M+</span>
                    </>
                  ) : (
                    <>
                      3<span className="text-sm align-top">M+</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">satisfied users</div>
              </div>
              <div className="px-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {statsInView ? (
                    <>
                      <CountUp start={0} end={31} duration={2} useEasing={true} />
                      <span className="text-sm">-day</span>
                    </>
                  ) : (
                    <>
                      31<span className="text-sm">-day</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">money back guarantee</div>
              </div>
              <div className="px-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {statsInView ? (
                    <>
                      <CountUp start={0} end={24} duration={1.5} useEasing={true} />
                      <span className="text-sm">/7</span>
                    </>
                  ) : (
                    <>
                      24<span className="text-sm">/7</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">Always on support</div>
              </div>
            </div>
          </motion.div>

          {/* Global network */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-purple-800 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden md:col-span-1 lg:col-span-1"
            ref={networkRef}
          >
            <div className="relative z-10">
              <h3 className="text-lg font-medium mb-1">Global network of</h3>
              <div className="text-5xl font-bold mb-1">
                {networkInView ? (
                  <>
                    <CountUp start={1000} end={6000} duration={3} useEasing={true} />
                    <span className="text-3xl">+</span>
                  </>
                ) : (
                  <>
                    6000<span className="text-3xl">+</span>
                  </>
                )}
              </div>
              <div className="text-xl">VPN servers</div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute bottom-0 right-0 w-24 h-24 opacity-50"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
