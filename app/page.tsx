import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import PlansSection from "@/components/plans-section"
import FeaturesSection from "@/components/features-section"
import AdvancedFeaturesSection from "@/components/advanced-features-section"
import VpnStatsSection from "@/components/vpn-stats-section"
import Footer from "@/components/footer"

// Import SecurityBeyondSection with no SSR to avoid hydration errors
const SecurityBeyondSection = dynamic(() => import("@/components/security-beyond-section"), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-br from-purple-950 to-purple-900 bg-grid-pattern">
        <Navbar />
        <HeroSection />
      </div>

      {/* Plans section */}
      <PlansSection />

      {/* Features section */}
      <FeaturesSection />

      {/* Advanced Features section */}
      <AdvancedFeaturesSection />

      {/* Security Beyond VPN section */}
      <SecurityBeyondSection />

      {/* VPN Stats section */}
      <VpnStatsSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
