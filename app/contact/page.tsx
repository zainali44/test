"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // This is a placeholder for a future API call
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="pt-28 bg-gradient-to-r from-gray-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="px-3 py-1 text-sm font-medium bg-white/10 rounded-full text-white/80 backdrop-blur-sm mb-6 inline-block">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-300">
            Have questions or need support? We're here to help you.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">How Can We Help?</h2>
            <p className="text-gray-600 mb-8">
              Our team is always ready to assist with any questions, concerns, or feedback you may have about our services.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-gray-100 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1 text-gray-900">Email Us</h3>
                  <p className="text-gray-600 mb-1">For general inquiries:</p>
                  <a href="mailto:support@crestvpn.com" className="text-purple-600 hover:text-purple-700 font-medium">
                    support@crestvpn.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1 text-gray-900">Live Chat</h3>
                  <p className="text-gray-600">Our support team is available:</p>
                  <p className="text-gray-800 font-medium">24/7 for premium users</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1 text-gray-900">Phone Support</h3>
                  <p className="text-gray-600 mb-1">For urgent matters:</p>
                  <p className="text-gray-800 font-medium">+1 (555) 123-4567</p>
                  <p className="text-gray-600 text-sm">(Available Mon-Fri, 9am-5pm EST)</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">Your message has been sent successfully. We'll get back to you soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Send Us a Message</h2>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How do I get started with CrestVPN?",
                answer: "Getting started is easy! Simply create an account, choose a subscription plan that fits your needs, download our app for your device, and connect to any of our secure servers."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and various cryptocurrencies including Bitcoin, Ethereum, and more for your privacy."
              },
              {
                question: "Is CrestVPN available on all devices?",
                answer: "Yes, CrestVPN is available on Windows, macOS, iOS, Android, Linux, and can be configured on routers and other devices."
              },
              {
                question: "What is your refund policy?",
                answer: "We offer a 30-day money-back guarantee for all subscription plans. If you're not satisfied with our service, you can request a full refund within 30 days of your purchase."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 