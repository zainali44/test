"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CookiePolicyPage() {
  const lastUpdated = "May 15, 2024";
  const [activeSection, setActiveSection] = React.useState("what-are-cookies");

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Cookie Policy</h1>
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
                  { id: "what-are-cookies", label: "What Are Cookies", number: "01" },
                  { id: "how-we-use-cookies", label: "How We Use Cookies", number: "02" },
                  { id: "types-of-cookies", label: "Types of Cookies", number: "03" },
                  { id: "third-party-cookies", label: "Third Party Cookies", number: "04" },
                  { id: "managing-cookies", label: "Managing Cookies", number: "05" },
                  { id: "changes-to-policy", label: "Changes to Policy", number: "06" },
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
                <p className="text-sm text-gray-500 mb-4">Need help understanding our cookie policy?</p>
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
            
            {/* What Are Cookies */}
            <section id="what-are-cookies" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">01</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">What Are Cookies</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p className="text-lg mb-4">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                    They are widely used to make websites work more efficiently and provide information to the website owners.
                  </p>
                  <p>
                    Cookies help websites remember information about your visit, like your preferred language and other settings. 
                    This can make your next visit easier and the site more useful to you. Cookies play an important role 
                    in improving your online experience.
                  </p>
                </div>
              </div>
            </section>
            
            {/* How We Use Cookies */}
            <section id="how-we-use-cookies" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">02</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">How We Use Cookies</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    At CrestVPN, we use cookies for a variety of purposes, including:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-300">
                      <h3 className="text-xl font-semibold mb-3">Authentication</h3>
                      <p>
                        We use cookies to recognize you when you sign in to your account. This helps us show you the right 
                        information and personalize your experience.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-300">
                      <h3 className="text-xl font-semibold mb-3">Security</h3>
                      <p>
                        We use cookies to support and enable security features, protect user data, and detect 
                        malicious activity and violations of our Terms of Service.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-300">
                      <h3 className="text-xl font-semibold mb-3">Preferences</h3>
                      <p>
                        We use cookies to remember information about how you prefer the website to behave and look,
                        such as your preferred language or the region you're in.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-300">
                      <h3 className="text-xl font-semibold mb-3">Analytics</h3>
                      <p>
                        We use cookies to understand how visitors interact with our website, which helps us improve our 
                        services and provide better content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Types of Cookies */}
            <section id="types-of-cookies" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">03</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Types of Cookies</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6">
                    We use different types of cookies to run our website and services. The following describes
                    the categories of cookies we use and why we use them:
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
                      <p>
                        These cookies are strictly necessary to provide you with services available through our website and to 
                        use some of its features, such as access to secure areas. Because these cookies are strictly necessary 
                        to deliver the website, you cannot refuse them without impacting how our website functions.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold mb-3">Performance and Analytics Cookies</h3>
                      <p>
                        These cookies collect information that is used to help us understand how our website is being used or 
                        how effective our marketing campaigns are. They also help us customize our website for you in order to 
                        enhance your experience.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold mb-3">Functional Cookies</h3>
                      <p>
                        These cookies enable the website to provide enhanced functionality and personalization. They may be set by 
                        us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, 
                        then some or all of these services may not function properly.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold mb-3">Targeting Cookies</h3>
                      <p>
                        These cookies are set through our site by our advertising partners. They may be used by those companies to build 
                        a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal 
                        information but are based on uniquely identifying your browser and internet device.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Third Party Cookies */}
            <section id="third-party-cookies" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">04</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Third Party Cookies</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6">
                    In addition to our own cookies, we may also use various third-party cookies to report usage statistics 
                    of the website, deliver advertisements on and through the website, and so on.
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <h3 className="text-xl font-semibold mb-3">Third-Party Service Providers</h3>
                    <p className="mb-4">
                      We may use third-party service providers to monitor and analyze the use of our website. These 
                      service providers may use cookies to collect information about your visits to our website. 
                      The information collected may include:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>IP addresses</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent on pages</li>
                      <li>Referring websites</li>
                      <li>Other browsing statistics</li>
                    </ul>
                  </div>
                  
                  <p>
                    The specific third-party cookies we use include:
                  </p>
                  
                  <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">More Information</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Google Analytics</td>
                          <td className="px-6 py-4 text-sm text-gray-500">Analytics tracking and website optimization</td>
                          <td className="px-6 py-4 text-sm text-gray-500"><a href="https://policies.google.com/privacy" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Stripe</td>
                          <td className="px-6 py-4 text-sm text-gray-500">Payment processing</td>
                          <td className="px-6 py-4 text-sm text-gray-500"><a href="https://stripe.com/privacy" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Intercom</td>
                          <td className="px-6 py-4 text-sm text-gray-500">Customer support chat</td>
                          <td className="px-6 py-4 text-sm text-gray-500"><a href="https://www.intercom.com/legal/privacy" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Managing Cookies */}
            <section id="managing-cookies" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">05</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Managing Cookies</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6">
                    Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies or delete certain cookies. 
                    Generally, you can also manage similar technologies in the same way that you manage cookies — using your browser's preferences settings.
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <h3 className="text-xl font-semibold mb-3">How to Manage Cookies in Different Browsers</h3>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Google Chrome</h4>
                        <p className="text-sm text-gray-600">
                          To manage cookies in Chrome, go to Settings &gt; Privacy and security &gt; Cookies and other site data.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Mozilla Firefox</h4>
                        <p className="text-sm text-gray-600">
                          To manage cookies in Firefox, go to Options &gt; Privacy & Security &gt; Cookies and Site Data.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Safari</h4>
                        <p className="text-sm text-gray-600">
                          To manage cookies in Safari, go to Preferences &gt; Privacy &gt; Cookies and website data.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Microsoft Edge</h4>
                        <p className="text-sm text-gray-600">
                          To manage cookies in Edge, go to Settings &gt; Cookies and site permissions &gt; Cookies and site data.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-4">
                    Please note that if you choose to block cookies, you may not be able to use all the features of our website.
                  </p>
                  
                  <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm text-yellow-700">
                        Essential cookies cannot be disabled as they are necessary for the proper functioning of the website. 
                        Disabling other cookies may affect your experience on our website, and some features may not function correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Changes to Policy */}
            <section id="changes-to-policy" className="mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
                    <span className="text-sm font-medium">06</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Changes to Policy</h2>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new 
                    Cookie Policy on this page and updating the "Last Updated" date at the top of this page.
                  </p>
                  <p className="mb-4">
                    You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy 
                    are effective when they are posted on this page.
                  </p>
                  <p>
                    If you have any questions about our Cookie Policy, please contact us at:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <span className="font-medium">Email:</span> <a href="mailto:privacy@crestvpn.com" className="text-purple-600 hover:underline">privacy@crestvpn.com</a>
                    </li>
                    <li>
                      <span className="font-medium">Contact:</span> Through our <Link href="/contact" className="text-purple-600 hover:underline">Contact Form</Link>
                    </li>
                  </ul>
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