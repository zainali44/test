import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import PlansSection from "@/components/plans-section"
import FeaturesSection from "@/components/features-section"
import AdvancedFeaturesSection from "@/components/advanced-features-section"
import VpnStatsSection from "@/components/vpn-stats-section"
import Footer from "@/components/footer"
import IpStatusBanner from "@/components/ip-status-banner"
import FeaturesHighlights from "@/components/features-highlights"
import SecureConnectionSection from "@/components/secure-connection-section"
import GlobalAccessSection from "@/components/global-access-section"
import TestimonialsSection from "@/components/testimonials-section"
import PricingPage from "./pricing/page"

// Import SecurityBeyondSection with no SSR to avoid hydration errors
const SecurityBeyondSection = dynamic(() => import("@/components/security-beyond-section"), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* IP Status Banner */}
      <IpStatusBanner />

      {/* Hero section with gradient background */}
      <div className="bg-[#1f0045]">
        <Navbar />
        <HeroSection />
      </div>

      {/* Features Highlights section */}
      <FeaturesHighlights />

      {/* Secure Connection section */}
      <SecureConnectionSection />
      
      {/* Global Access section */}
      <GlobalAccessSection />
      
      {/* Testimonials section */}
      {/* <TestimonialsSection /> */}

      {/* <PricingPage /> */}

      {/* Plans section */}
      {/* <PlansSection /> */}

      {/* Features section */}
      {/* <FeaturesSection /> */}

      {/* Advanced Features section */}
      {/* <AdvancedFeaturesSection /> */}

      {/* Security Beyond VPN section */}
      {/* <SecurityBeyondSection /> */}

      {/* VPN Stats section */}
      {/* <VpnStatsSection /> */}

      {/* Footer */}
      <Footer />
    </main>
  )
}
