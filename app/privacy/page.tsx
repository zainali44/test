"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
  const lastUpdated = "28 June 2023";
  const [activeSection, setActiveSection] = React.useState<string>("introduction");

  // Set up Intersection Observer for automatic section highlighting on scroll
  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-80px 0px 0px 0px", // Adjusted rootMargin to account for navbar height
      threshold: 0.3,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
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

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    // Add an offset to account for the navbar height
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Use the existing Navbar component */}
      <Navbar />

      {/* Add padding-top to ensure content is below navbar */}
      <div className="max-w-6xl mx-auto px-4 py-12 pt-28">
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: {lastUpdated}</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-72"
          >
            <div className="sticky top-24 p-5 rounded-xl bg-white shadow-sm border border-gray-100">
              <nav>
                <h2 className="font-medium text-gray-900 mb-4">Table of Contents</h2>
                <ul className="space-y-1">
                  {[
                    { id: "introduction", label: "Introduction", number: "01" },
                    { id: "information-collected", label: "Information We Collect", number: "02" },
                    { id: "personal-data", label: "Personal Data", number: "02.1" },
                    { id: "non-personal-data", label: "Non-Personal Data", number: "02.2" },
                    { id: "information-usage", label: "How We Use Your Information", number: "03" },
                    { id: "information-sharing", label: "Information Sharing", number: "04" },
                    { id: "security-measures", label: "Security Measures", number: "05" },
                    { id: "data-retention", label: "Data Retention", number: "06" },
                    { id: "your-rights", label: "Your Rights", number: "07" },
                    { id: "international-transfers", label: "International Transfers", number: "08" },
                    { id: "legal-compliance", label: "Legal Compliance", number: "09" },
                    { id: "contact-us", label: "Contact Us", number: "10" },
                  ].map((item) => (
                    <li key={item.id} className={`relative ${item.id.includes('-data') ? 'pl-4' : ''}`}>
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`flex items-center w-full py-2 px-3 rounded-lg transition-colors ${
                          activeSection === item.id ? 
                          'bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-600' : 
                          'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs opacity-60 w-10">{item.number}</span>
                        <span className="text-sm">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:flex-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-6"
            >
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  At CrestVPN, we value your privacy and are committed to protecting your personal information. 
                  This Privacy Policy outlines our practices regarding the collection, use, and 
                  disclosure of your data when you use our VPN services.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm text-gray-500 mb-2">Need Help?</h3>
                <div className="flex items-center">
                  <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mr-4">
                    Contact Support
                  </Link>
                  <Link href="/faq" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Visit FAQ
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Introduction */}
            <section id="introduction" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">01</span>
                  <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                </div>
                
                <div className="prose text-gray-600">
                  <p>
                    CrestVPN is dedicated to creating a safe and secure online environment for our clients 
                    and website visitors. We understand the importance of privacy and are committed to 
                    safeguarding your personal information.
                  </p>
                  <p>
                    Our VPN service is designed to provide you with enhanced security, privacy, and freedom 
                    online. By encrypting your internet connection and masking your IP address, CrestVPN helps 
                    protect your sensitive data from hackers, ISPs, and other third parties.
                  </p>
                  <p>
                    This Privacy Policy explains our practices concerning the collection, use, and sharing 
                    of your data. We encourage you to review this policy regularly as we may update it 
                    periodically to reflect changes in our practices or legal requirements.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Information We Collect */}
            <section id="information-collected" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">02</span>
                  <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                </div>
                
                <div className="prose text-gray-600 mb-6">
                  <p>
                    To provide our VPN services efficiently and securely, we collect certain information 
                    from you. We are committed to collecting only what is necessary and to being 
                    transparent about what we collect.
                  </p>
                </div>

                {/* Personal Data */}
                <div id="personal-data" className="mb-8 border-l-2 border-indigo-100 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 Personal Data</h3>
                  <div className="prose text-gray-600">
                    <p>
                      We collect personally identifiable information ("Personal Data") that you voluntarily 
                      provide to us. This may include your name, email address, phone number, postal address, 
                      and billing information.
                    </p>
                    <p>
                      You may provide this information when you sign up for our services, contact us for 
                      inquiries, or participate in surveys and promotions. We also collect details about 
                      your preferences and answers to tailor our services to your needs.
                    </p>
                  </div>
                </div>

                {/* Non-Personal Data */}
                <div id="non-personal-data" className="border-l-2 border-indigo-100 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2.2 Non-Personal Data</h3>
                  <div className="prose text-gray-600">
                    <p>
                      In addition to Personal Data, we collect non-personal information ("Non-Personal Data") 
                      that cannot be used to identify you individually. This includes data such as your 
                      IP address, browser type, operating system, referring URLs, pages viewed, and the 
                      timestamps of your visits.
                    </p>
                    <p>
                      Non-Personal Data helps us understand user behavior and improve our website's 
                      performance and user experience. We may also collect aggregated data from multiple 
                      users, which is not linked to any specific individual.
                    </p>
                    <p>
                      <strong>Important for VPN users:</strong> When you connect to our VPN service, we collect basic 
                      connection data such as the time when a successful connection was established and the amount of 
                      data transferred during your session. This data is used solely for troubleshooting, service 
                      optimization, and to prevent abuse of our service. We never record or monitor your actual 
                      VPN traffic, ensuring your online activities remain private.
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* How We Use Your Information */}
            <section id="information-usage" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">03</span>
                  <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">3.1 Personal Data</h3>
                    <p className="text-gray-600 mb-4">We use the Personal Data we collect for various purposes:</p>
                    <ul className="space-y-3">
                      <li className="flex">
                        <span className="text-indigo-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-gray-900">Providing Services:</span>
                          <p className="text-sm text-gray-600">To deliver the VPN services you request, manage your account, and process transactions.</p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="text-indigo-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-gray-900">Communication:</span>
                          <p className="text-sm text-gray-600">To communicate with you about your account, respond to inquiries, and send updates about service changes or outages.</p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="text-indigo-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-gray-900">Personalization:</span>
                          <p className="text-sm text-gray-600">To tailor our VPN services to your preferences and enhance your user experience.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">3.2 Non-Personal Data</h3>
                    <p className="text-gray-600 mb-4">Non-Personal Data is used primarily to:</p>
                    <ul className="space-y-3">
                      <li className="flex">
                        <span className="text-indigo-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-gray-900">Enhance User Experience:</span>
                          <p className="text-sm text-gray-600">By understanding how visitors use our website and VPN service, we can improve navigation and content.</p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="text-indigo-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-gray-900">Monitor Trends:</span>
                          <p className="text-sm text-gray-600">To analyze server performance, optimize network resources, and improve server allocation.</p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="text-indigo-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-gray-900">Improve Services:</span>
                          <p className="text-sm text-gray-600">To continuously enhance our VPN solution with faster speeds, better reliability, and additional security features.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Information Sharing */}
            <section id="information-sharing" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">04</span>
                  <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
                </div>
                
                <div className="prose text-gray-600">
                  <p>
                    We are committed to maintaining your trust, and we want you to understand when 
                    and with whom we may share the information we collect. As a privacy-focused VPN 
                    provider, we minimize data sharing to the greatest extent possible.
                  </p>
                  <p>
                    <strong>No logging policy:</strong> CrestVPN operates under a strict no-logs policy, which means 
                    we do not record or monitor your VPN browsing activities, connection logs, IP addresses, or any 
                    internet activity while using our services. What you do online while connected to our VPN remains 
                    private and is not tracked or monitored by us.
                  </p>
                  <p>
                    We may share your information in the following limited circumstances:
                  </p>
                  <ul>
                    <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our website and providing our VPN services.</li>
                    <li><strong>Business Transfers:</strong> If CrestVPN is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid legal requests.</li>
                  </ul>
                  <p>
                    We will never sell your personal data to advertisers or other third parties. Our business model is subscription-based, not data-based.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Security Measures */}
            <section id="security-measures" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">05</span>
                  <h2 className="text-2xl font-bold text-gray-900">Security Measures</h2>
                </div>
                
                <div className="prose text-gray-600">
                  <p>
                    CrestVPN implements robust security measures to protect your personal information and 
                    ensure the security of your VPN connection. These measures include:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h4 className="text-gray-900 font-semibold mb-2">Advanced Encryption</h4>
                      <p className="text-sm">We use military-grade AES-256 encryption to protect your data, the same encryption standard used by governments and security experts worldwide.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h4 className="text-gray-900 font-semibold mb-2">Multiple Protocols</h4>
                      <p className="text-sm">CrestVPN supports various VPN protocols including OpenVPN, IKEv2, and WireGuard® to provide options based on your needs for security, speed, and compatibility.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h4 className="text-gray-900 font-semibold mb-2">Kill Switch</h4>
                      <p className="text-sm">Our automatic kill switch feature blocks internet access if your VPN connection drops, ensuring your data is never exposed.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h4 className="text-gray-900 font-semibold mb-2">DNS Leak Protection</h4>
                      <p className="text-sm">CrestVPN prevents DNS leaks by routing all DNS requests through our secure servers, stopping your ISP from seeing your browsing activity.</p>
                    </div>
                  </div>
                  
                  <p className="mt-6">
                    We regularly update our security practices and technology to maintain the highest standards of 
                    data protection. Our team conducts routine security audits and vulnerability assessments to 
                    identify and address any potential threats.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Data Retention */}
            <section id="data-retention" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">06</span>
                  <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
                </div>
                
                <div className="prose text-gray-600">
                  <p>
                    CrestVPN retains your personal information only for as long as necessary to fulfill the purposes 
                    for which it was collected and to comply with applicable laws. We implement different retention 
                    periods depending on the type of data:
                  </p>
                  <ul>
                    <li><strong>Account Information:</strong> We retain your account information for as long as your account remains active. If you request account deletion, we will delete your personal information within 30 days.</li>
                    <li><strong>Payment Information:</strong> We retain payment records as required by financial regulations, typically for 7 years.</li>
                    <li><strong>VPN Connection Data:</strong> We maintain minimal connection logs that are automatically deleted after 24 hours. These logs only include connection timestamps and data transfer volume, not your activities or the content of your communications.</li>
                    <li><strong>Support Communications:</strong> We may retain customer support communications for up to 2 years to ensure service quality and address recurring issues.</li>
                  </ul>
                  <p>
                    Once the retention period expires, we securely delete your data using industry-standard data 
                    sanitization methods to ensure it cannot be recovered.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">07</span>
                  <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                </div>
                
                <div className="prose text-gray-600">
                  <p>
                    As a CrestVPN user, you have several rights regarding your personal information:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="border-l-2 border-indigo-100 pl-4">
                      <h4 className="text-gray-900 font-semibold mb-2">Right to Access</h4>
                      <p className="text-sm">You have the right to request a copy of the personal information we hold about you.</p>
                    </div>
                    
                    <div className="border-l-2 border-indigo-100 pl-4">
                      <h4 className="text-gray-900 font-semibold mb-2">Right to Rectification</h4>
                      <p className="text-sm">If any information we hold about you is incorrect or incomplete, you have the right to have it corrected.</p>
                    </div>
                    
                    <div className="border-l-2 border-indigo-100 pl-4">
                      <h4 className="text-gray-900 font-semibold mb-2">Right to Erasure</h4>
                      <p className="text-sm">You have the right to request deletion of your personal data under certain circumstances.</p>
                    </div>
                    
                    <div className="border-l-2 border-indigo-100 pl-4">
                      <h4 className="text-gray-900 font-semibold mb-2">Right to Restrict Processing</h4>
                      <p className="text-sm">You can request that we restrict the processing of your data in certain circumstances.</p>
                    </div>
                    
                    <div className="border-l-2 border-indigo-100 pl-4">
                      <h4 className="text-gray-900 font-semibold mb-2">Right to Data Portability</h4>
                      <p className="text-sm">You have the right to receive your personal data in a structured, commonly used format.</p>
                    </div>
                    
                    <div className="border-l-2 border-indigo-100 pl-4">
                      <h4 className="text-gray-900 font-semibold mb-2">Right to Object</h4>
                      <p className="text-sm">You can object to our processing of your personal data for direct marketing purposes.</p>
                    </div>
                  </div>
                  
                  <p className="mt-6">
                    To exercise any of these rights, please contact us through our support channels. We will respond to 
                    your request within 30 days. There might be circumstances where we cannot fulfill certain requests, 
                    particularly if they conflict with our legal obligations or legitimate business interests.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* International Transfers */}
            <section id="international-transfers" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">08</span>
                  <h2 className="text-2xl font-bold text-gray-900">International Transfers</h2>
                </div>
                
                <div className="prose text-gray-600">
                  <p>
                    CrestVPN operates servers in multiple countries worldwide to provide you with better speed, 
                    reliability, and access to global content. When you use our VPN service, your data may be 
                    processed through servers located in different countries.
                  </p>
                  <p>
                    We ensure that any international transfer of personal data complies with applicable data 
                    protection laws. For transfers from the EU/EEA to countries not deemed to provide an adequate 
                    level of data protection, we implement appropriate safeguards such as Standard Contractual 
                    Clauses approved by the European Commission.
                  </p>
                  <p>
                    Our VPN server network spans across 60+ countries, giving you access to over 3,000 servers 
                    worldwide. This global infrastructure allows you to bypass geographic restrictions and access 
                    content from different regions while maintaining your privacy and security.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Legal Compliance */}
            <section id="legal-compliance" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">09</span>
                  <h2 className="text-2xl font-bold text-gray-900">Legal Compliance</h2>
                </div>
                
                <div className="prose text-gray-600">
                  <p>
                    CrestVPN is committed to complying with all applicable laws and regulations regarding data 
                    protection and privacy. This includes:
                  </p>
                  <ul>
                    <li><strong>General Data Protection Regulation (GDPR):</strong> For users in the European Union, we adhere to the principles of data minimization, purpose limitation, and user rights as outlined in the GDPR.</li>
                    <li><strong>California Consumer Privacy Act (CCPA):</strong> For California residents, we respect your rights regarding personal information as defined by the CCPA.</li>
                    <li><strong>Children's Privacy:</strong> Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16 years of age.</li>
                  </ul>
                  <p>
                    While we are committed to protecting your privacy, we may be legally required to disclose 
                    information in response to lawful requests by public authorities, including to meet national 
                    security or law enforcement requirements. However, given our minimal-logging policy, 
                    we have very limited information that could be provided even in such circumstances.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Contact Us */}
            <section id="contact-us" className="mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-light text-indigo-200 mr-4">10</span>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                </div>
                
                <div className="prose text-gray-600">
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or the way we 
                    handle your personal information, please contact us using the following methods:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg mt-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-2">Email</h4>
                        <p className="text-sm">privacy@crestvpn.com</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-2">Support Ticket</h4>
                        <p className="text-sm">Submit a ticket through our <Link href="/support" className="text-indigo-600 hover:text-indigo-700">support portal</Link></p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-2">Postal Address</h4>
                        <p className="text-sm">CrestVPN Privacy Team<br />123 Security Street<br />Privacy City, PC 12345</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6">
                    We will respond to your inquiry as soon as possible, usually within 3-5 business days. 
                    For urgent privacy matters, please indicate the urgency in your communication.
                  </p>
                </div>
              </motion.div>
            </section>
          </motion.div>
        </div>
      </div>
      
      {/* Use the existing Footer component */}
      <Footer />
    </div>
  );
} 