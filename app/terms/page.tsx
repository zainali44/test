"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function TermsPage() {
  const lastUpdated = "May 15, 2024";
  const [activeSection, setActiveSection] = React.useState("introduction");

  // Handle navigation click
  const handleNavClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const navbarOffset = 80; // Approximate navbar height
      window.scrollTo({
        top: elementPosition - navbarOffset,
        behavior: 'smooth'
      });
    }
  };

  // Set up Intersection Observer for automatic section highlighting on scroll
  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-80px 0px 0px 0px", // Adjusted rootMargin to account for navbar height
      threshold: 0.3,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="pt-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="px-3 py-1 text-sm font-medium bg-white/10 rounded-full text-white/80 backdrop-blur-sm mb-6 inline-block">
            Legal Document
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Terms & Conditions</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-300">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Layout Container */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-72 order-2 lg:order-1">
            <div className="sticky top-24 p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <h2 className="font-medium text-gray-800 mb-6 text-lg">Table of Contents</h2>
              <ul className="space-y-1">
                {[
                  { id: "introduction", label: "Introduction", number: "01" },
                  { id: "service-usage", label: "Service Usage", number: "02" },
                  { id: "accounts", label: "Accounts & Subscriptions", number: "03" },
                  { id: "refunds", label: "Free Trial & Refunds", number: "04" },
                  { id: "prohibited-uses", label: "Prohibited Uses", number: "05" },
                  { id: "intellectual-property", label: "Intellectual Property", number: "06" },
                  { id: "limitation", label: "Limitation of Liability", number: "07" },
                  { id: "termination", label: "Termination", number: "08" },
                  { id: "governing-law", label: "Governing Law", number: "09" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center w-full py-2 px-3 rounded-lg transition-all ${
                        activeSection === item.id ? 
                        'bg-gray-100 text-gray-900 font-medium' : 
                        'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="text-xs text-gray-400 w-8">{item.number}</span>
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-4">Need help understanding our terms?</p>
                <Link href="/contact" className="text-sm font-medium text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:flex-1 order-1 lg:order-2">
            
            {/* Introduction */}
            <section id="introduction" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">01</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p className="text-lg mb-4">
                    Please read these Terms and Conditions ("Terms") carefully before using the CrestVPN website, mobile
                    applications, and services (collectively, the "Service") operated by CrestVPN ("us", "we", or "our").
                  </p>
                  <p>
                    Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                    These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using
                    the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not
                    access the Service.
                  </p>
                  
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-start">
                      <svg className="h-6 w-6 text-gray-400 mt-1 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        By using CrestVPN's services, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
                        If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have 
                        the authority to bind such entity to these Terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Service Usage */}
            <section id="service-usage" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">02</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Service Usage</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    CrestVPN provides a virtual private network (VPN) service that allows users to enhance their online privacy 
                    and security. Our Service is designed to be used in accordance with all applicable laws and regulations.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-300">
                      <h3 className="text-xl font-semibold mb-3">Service Availability</h3>
                      <p className="mb-4">
                        While we strive to provide uninterrupted service, we do not guarantee that the Service will be available at 
                        all times. We may experience hardware, software, or other problems, or need to perform maintenance related to 
                        the Service, resulting in interruptions, delays, or errors.
                      </p>
                      <p>
                        We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Service at any 
                        time without prior notice.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-300">
                      <h3 className="text-xl font-semibold mb-3">Third-Party Services</h3>
                      <p className="mb-4">
                        The Service may contain links to third-party websites or services that are not owned or controlled by CrestVPN. 
                        We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any 
                        third-party websites or services.
                      </p>
                      <p>
                        You acknowledge and agree that CrestVPN shall not be responsible or liable, directly or indirectly, for any 
                        damage or loss caused by third-party services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Accounts & Subscriptions */}
            <section id="accounts" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">03</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Accounts & Subscriptions</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    To access certain features of the Service, you may be required to create an account and subscribe to one of our plans.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Account Creation</h3>
                      <p className="text-sm text-gray-600">
                        When you create an account with us, you must provide accurate information. You're responsible for safeguarding your password and all activity under your account.
                      </p>
                    </div>
                    
                    <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Subscription Plans</h3>
                      <p className="text-sm text-gray-600">
                        We offer various plans including a free tier with limited features. Premium subscriptions renew automatically at the end of each billing period.
                      </p>
                    </div>
                    
                    <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                      <p className="text-sm text-gray-600">
                        By submitting payment details, you authorize us to charge your payment method for subscription fees and applicable taxes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Free Trial & Refunds */}
            <section id="refunds" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">04</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Free Trial & Refunds</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold">Free Trial</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        CrestVPN may, at its sole discretion, offer a trial subscription for a limited period. Access to this trial is 
                        subject to these Terms. We reserve the right to modify or terminate the trial offer at any time without notice.
                      </p>
                      <p className="text-sm text-gray-600">
                        At the end of the trial period, you will be automatically charged the applicable subscription fee for the plan 
                        you selected, unless you cancel your subscription before the end of the trial period.
                      </p>
                    </div>
                    
                    <div className="flex-1 p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <h3 className="text-lg font-semibold">Refund Policy</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        We offer a 30-day money-back guarantee for our premium subscription plans. If you're not satisfied with our 
                        Service, you can request a full refund within 30 days of your initial purchase.
                      </p>
                      <p className="text-sm text-gray-600">
                        To be eligible for a refund, submit your request within the 30-day period through our customer support 
                        with your reason for dissatisfaction. Refunds typically take 5-10 business days to process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Prohibited Uses */}
            <section id="prohibited-uses" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">05</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Prohibited Uses</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <div className="p-6 bg-gray-50 rounded-xl border-l-4 border-gray-400 mb-6">
                    <p className="font-medium">
                      You agree to use the Service only for lawful purposes and in accordance with these Terms. 
                      Any violation may result in immediate termination of your account and potential legal action.
                    </p>
                  </div>
                  
                  <p>You agree not to use the Service:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>In any way that violates any applicable federal, state, local, or international law or regulation.</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>To impersonate or attempt to impersonate CrestVPN, a CrestVPN employee, another user, or any other person or entity.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Intellectual Property */}
            <section id="intellectual-property" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">06</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive property 
                    of CrestVPN and its licensors. The Service is protected by copyright, trademark, and other laws of both the 
                    United States and foreign countries. Our trademarks and trade dress may not be used in connection with any 
                    product or service without the prior written consent of CrestVPN.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Limitation of Liability */}
            <section id="limitation" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">07</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    In no event shall CrestVPN, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
                    for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of 
                    profits, data, use, goodwill, or other intangible losses, resulting from:
                  </p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Your access to or use of or inability to access or use the Service;</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Any conduct or content of any third party on the Service;</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Any unauthorized access, use or alteration of your transmissions or content.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Termination */}
            <section id="termination" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">08</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Termination</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
                    including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                  </p>
                  <p className="mt-4">
                    If you wish to terminate your account, you may simply discontinue using the Service, or contact our customer 
                    support to request account deletion.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Governing Law */}
            <section id="governing-law" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">09</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    These Terms shall be governed and construed in accordance with the laws of [Your Country/State], 
                    without regard to its conflict of law provisions.
                  </p>
                  <p className="mt-4">
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. 
                    If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions 
                    of these Terms will remain in effect.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 