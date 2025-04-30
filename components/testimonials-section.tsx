"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Quote } from "lucide-react"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  avatar: string
  rating: number
}

const Testimonial = ({ quote, author, role, avatar, rating }: TestimonialProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white relative p-8 pt-12 rounded-xl shadow-xl shadow-purple-200/20 flex flex-col h-full"
    >
      <div className="absolute -top-5 left-8 bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
        <Quote className="w-5 h-5 text-white" />
      </div>
      
      {/* Quote */}
      <p className="text-gray-700 mb-8 text-lg italic flex-grow">{quote}</p>
      
      <div className="border-t border-gray-100 pt-6 mt-auto">
        {/* Rating */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center">
          <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-purple-100">
            <Image 
              src={avatar} 
              alt={author} 
              width={56} 
              height={56} 
              className="object-cover w-full h-full" 
              unoptimized 
            />
          </div>
          <div>
            <h4 className="font-bold text-[#280068] text-lg">{author}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const testimonials: TestimonialProps[] = [
    {
      quote: "SecureVPN has been a game-changer for me. I travel a lot for work and now I can access all my content securely no matter where I am.",
      author: "Sophie Chen",
      role: "Digital Nomad",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      rating: 5,
    },
    {
      quote: "I was skeptical at first, but after experiencing the speed and security SecureVPN offers, I'm completely sold. No more buffering on streaming sites!",
      author: "Marcus Johnson",
      role: "Software Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      rating: 5,
    },
    {
      quote: "As a privacy advocate, I've tried many VPNs. This one stands out for its no-logs policy and incredible encryption. Highly recommend.",
      author: "Elena Rodriguez",
      role: "Cybersecurity Analyst",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      rating: 4,
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-pink-600/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3">
            <div className="bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-medium">
              TESTIMONIALS
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#280068] mb-4">
            Loved by Users Worldwide
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            See why millions trust us with their online privacy and security needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
          <div className="bg-white px-8 py-6 rounded-2xl shadow-lg border border-purple-100/20 flex items-center">
            <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
              4.9
            </div>
            <div className="ml-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">from 25,000+ reviews</div>
            </div>
          </div>
          
          <div className="bg-white px-8 py-6 rounded-2xl shadow-lg border border-purple-100/20 flex items-center">
            <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
              2M+
            </div>
            <div className="ml-4">
              <div className="text-gray-800 font-medium">Happy Users</div>
              <div className="text-sm text-gray-500">across 150+ countries</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 