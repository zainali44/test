"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import Image from "next/image"

export default function VpnStatsSection() {
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Review section */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-16 gap-8">
          <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100 max-w-xs">
            <div className="flex-shrink-0">
              <Image src="https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Fpc-mag-rating.webp?alt=media&token=dc025864-b906-405a-bc86-acf53614f04c" width={40} height={40} alt="crestVPN Logo" className="rounded" />
            </div>
            <div>
              <div className="font-bold text-sm">Crest VPN: Best for Streaming Enthusiasts</div>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <svg
                      key={star}
                      className="w-3 h-3 text-red-500 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                  <svg
                    className="w-3 h-3 text-red-500 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                      fill="url(#half-star)"
                    />
                    <defs>
                      <linearGradient id="half-star" x1="0" y1="0" x2="100%" y2="0">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="rgba(203, 213, 225, 0.5)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-xs text-red-500 ml-1">4.5 Reviews</span>
              </div>
            </div>
          </div>

          <div className="text-gray-700 text-sm md:text-base max-w-md text-center md:text-left">
            Go-to VPN recommended by PCMAG for blockbuster streaming experience. Enjoy every action-packed moment with
            crestVPN.
          </div>
        </div>

        {/* Stats section */}
        <div ref={statsRef} className="flex flex-col md:flex-row items-center justify-center mb-24 gap-8">
          <div className="flex items-center gap-16 md:gap-24">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {statsInView ? <CountUp start={1000} end={6000} duration={2.5} useEasing={true} /> : "6000"}
                <span className="text-black font-bold">+</span>
              </div>
              <div className="text-xs text-gray-500">VPN Servers</div>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {statsInView ? <CountUp start={20} end={96} duration={2} useEasing={true} /> : "96"}
                <span className="text-black font-bold">+</span>
              </div>
              <div className="text-xs text-gray-500">Locations</div>
            </div>
          </div>

          <div className="md:ml-16">
            <Button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-full text-base flex items-center gap-2">
              Get crestVPN
              <div className="bg-white rounded-full p-1">
                <ArrowRight className="h-3 w-3 text-purple-700" />
              </div>
            </Button>
          </div>
        </div>

        {/* Features section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Tailored-for-you features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4L12 12L4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 4V20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Split tunneling</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your security, your choice. Choose specific apps that require VPN protection and browse with peace of
                mind.
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Internet kill switch</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enhance online security with the kill switch feature, which automatically cuts off internet access if
                VPN disconnects.
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4H20V20H4V4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 10H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 4V20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Shortcuts</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access your favorite apps and channels quickly with our custom shortcuts. Save time and effort while
                enjoying a safer connection.
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">WireGuard</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Experience high-speed, crest connections with WireGuard, offering modern encryption for online
                activities.
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Obfuscated server</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access global content with ease using our Obfuscated Servers, designed to mask your VPN usage and
                privacy.
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 6V12L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Fast Connections</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enjoy lightning-fast connections with optimized servers that provide the best possible speeds for
                streaming and browsing.
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-10">
            <Button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-full text-base flex items-center gap-2">
              See more
              <div className="bg-white rounded-full p-1">
                <ArrowRight className="h-3 w-3 text-purple-700" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
