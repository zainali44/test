"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 mt-14 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 inline-block font-medium text-sm bg-gray-100 dark:bg-gray-800 py-1 px-3 rounded-full text-gray-600 dark:text-gray-400">
                ABOUT US
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white leading-tight tracking-tight">
                Securing your digital privacy.
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                CrestVPN provides military-grade encryption and anonymous browsing, ensuring your online activities remain private and secure.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white text-base px-6 py-5 h-auto rounded-full font-medium transition-all duration-300 hover:shadow-md hover:scale-103 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <Link href="/pricing">Get Started</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-6 py-5 h-auto rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300 border"
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="https://images.unsplash.com/photo-1667372283496-893f0b1e7c16?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="CrestVPN Security" 
                  fill 
                  className="object-cover hover:scale-102 transition-transform duration-700"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJcAP4i0BXhgAAAABJRU5ErkJggg=="
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-purple-500 z-10 animate-pulse"></div>
              <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full border-2 border-amber-400 z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "256-bit", label: "ENCRYPTION", color: "text-green-500" },
              { value: "5,000+", label: "GLOBAL SERVERS", color: "text-amber-500" },
              { value: "99.9%", label: "UPTIME GUARANTEE", color: "text-pink-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-4xl md:text-6xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-sm uppercase mt-3 text-gray-500 dark:text-gray-400 font-medium tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="bg-white dark:bg-gray-950 py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="relative order-2 md:order-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1800&auto=format&fit=crop" 
                  alt="VPN Security" 
                  fill 
                  className="object-cover hover:scale-102 transition-all duration-700"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJcAP4i0BXhggg=="
                />
              </div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-yellow-500 animate-pulse"></div>
              <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full border-2 border-purple-400 z-0"></div>
            </motion.div>
            <motion.div 
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-lg">
                <div className="mb-6 inline-block font-medium text-sm bg-amber-100 dark:bg-amber-900/30 py-1 px-3 rounded-full text-amber-700 dark:text-amber-300">
                  OUR VISION
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">Our Vision</h2>
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    We envision a world where internet users can browse without fear of surveillance, data theft, or censorship. Where digital privacy is not a luxury, but a fundamental right.
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    CrestVPN is committed to creating the most secure, reliable, and user-friendly VPN service that empowers people to take control of their online privacy and freedom.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-block font-medium text-sm bg-purple-100 dark:bg-purple-900/30 py-1 px-3 rounded-full text-purple-700 dark:text-purple-300">
                OUR STORY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
                Building a safer internet for everyone.
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Founded in 2021, CrestVPN was born from a simple belief: everyone deserves privacy and freedom online. 
                  In a world where digital surveillance and data breaches are increasingly common, we set out to create a solution 
                  that puts control back in the hands of internet users.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  What began as a small team of cybersecurity experts has evolved into a growing company dedicated to providing 
                  state-of-the-art VPN services that combine military-grade encryption with user-friendly design.
                </p>
              </div>
            </motion.div>
            <div className="space-y-6">
              {[
                {
                  number: "01",
                  title: "No-logs policy",
                  description: "We never track, store, or share your browsing activity. What you do online stays private, even from us."
                },
                {
                  number: "02",
                  title: "Advanced encryption",
                  description: "Our VPN uses AES-256 encryption, the same standard used by governments and military organizations worldwide."
                },
                {
                  number: "03",
                  title: "Global server network",
                  description: "Access content from anywhere with our network of high-speed servers across 60+ countries and automatic server selection."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="mb-4 text-amber-500 dark:text-amber-400 font-bold">{item.number}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white dark:bg-gray-950 py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-block font-medium text-sm bg-rose-100 dark:bg-rose-900/30 py-1 px-3 rounded-full text-rose-700 dark:text-rose-300">
              OUR TEAM
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">The Security Experts</h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Meet the cybersecurity specialists behind CrestVPN who are dedicated to advancing online privacy and protection.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "CYBERSECURITY LEAD",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
              },
              {
                name: "Michael Rodriguez",
                role: "NETWORK ARCHITECTURE",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
              },
              {
                name: "Amina Patel",
                role: "PRIVACY COMPLIANCE",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
              },
              {
                name: "David Kim",
                role: "CLIENT DEVELOPMENT",
                image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=800&auto=format&fit=crop",
              },
            ].map((member, index) => (
              <motion.div 
                key={index} 
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-80 relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-102"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJcAP4i0BXhgAAAABJRU5ErkJggg=="
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{member.role}</p>
                    <div className="flex mt-4 space-x-3">
                      {['twitter', 'instagram', 'linkedin'].map((social, socialIndex) => (
                        <button 
                          key={socialIndex}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                          aria-label={`${member.name}'s ${social}`}
                        >
                          {social === 'twitter' && (
                            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                          )}
                          {social === 'instagram' && (
                            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          )}
                          {social === 'linkedin' && (
                            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-block font-medium text-sm bg-blue-100 dark:bg-blue-900/30 py-1 px-3 rounded-full text-blue-700 dark:text-blue-300">
                OUR VALUES
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
                What Drives Our VPN Service
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our core values shape everything we do at CrestVPN, from how we build our technology to how we serve our customers.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Privacy First",
                      description: "Your data is yours. We never track, store, or sell your personal information.",
                      color: "bg-purple-100 dark:bg-purple-900/30",
                      hoverColor: "hover:bg-purple-200 dark:hover:bg-purple-800/40",
                      textColor: "group-hover:text-purple-700 dark:group-hover:text-purple-300"
                    },
                    {
                      title: "Zero-Knowledge",
                      description: "Our strict no-logs policy means we have no data to share, even if compelled.",
                      color: "bg-blue-100 dark:bg-blue-900/30",
                      hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800/40",
                      textColor: "group-hover:text-blue-700 dark:group-hover:text-blue-300"
                    },
                    {
                      title: "Global Access",
                      description: "We believe in an open internet without geo-restrictions or censorship.",
                      color: "bg-green-100 dark:bg-green-900/30",
                      hoverColor: "hover:bg-green-200 dark:hover:bg-green-800/40",
                      textColor: "group-hover:text-green-700 dark:group-hover:text-green-300"
                    },
                    {
                      title: "Security Innovation",
                      description: "We constantly improve our protocols to stay ahead of emerging threats.",
                      color: "bg-amber-100 dark:bg-amber-900/30",
                      hoverColor: "hover:bg-amber-200 dark:hover:bg-amber-800/40",
                      textColor: "group-hover:text-amber-700 dark:group-hover:text-amber-300"
                    },
                  ].map((value, index) => (
                    <motion.div 
                      key={index} 
                      className={`${value.color} ${value.hoverColor} p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md group cursor-pointer`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <h3 className={`font-bold text-lg mb-2 text-gray-900 dark:text-white ${value.textColor} transition-colors duration-300`}>
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{value.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop" 
                  alt="VPN Values" 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-102"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJcAP4i0BXhgAAAABJRU5ErkJggg=="
                />
              </div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-pink-500 animate-pulse"></div>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full border-2 border-blue-400 z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">Secure Your Connection Today</h2>
              <p className="text-xl mb-10 text-gray-300 leading-relaxed">
                Experience the internet as it was meant to be—secure, private, and without boundaries. 
                Try CrestVPN today with our 30-day risk-free guarantee and take control of your digital life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white hover:bg-gray-100 text-black text-base px-6 py-5 h-auto rounded-full font-medium transition-all duration-300 hover:shadow-md hover:scale-103 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                  <Link href="/pricing">Explore Our Plans</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border border-white text-white hover:bg-white hover:text-black text-base px-6 py-5 h-auto rounded-full font-medium transition-all duration-300 hover:shadow-md"
                >
                  <Link href="/login">7-Day Free Trial</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1800&auto=format&fit=crop" 
                  alt="Secure VPN Connection" 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-102"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJcAP4i0BXhggg=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-white/30 z-0"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-blue-500 z-10 animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 