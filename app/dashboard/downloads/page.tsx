"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Info, Shield, Check, ExternalLink, Lock, Unlock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/app/contexts/auth-context"
import { UpgradeDialog } from "@/components/upgrade-dialog"
import { useSubscription } from "@/app/contexts/subscription-context"

export default function DownloadsPage() {
  const { user } = useAuth()
  const { subscription } = useSubscription()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [selectedDownload, setSelectedDownload] = useState("")

  // Check if user has a free plan
  const isFreePlan = () => {
    // Check from subscription state
    if (subscription) {
      // Handle case where subscription is wrapped in data property
      const subscriptionData = (subscription as any).data || subscription;
      
      // Check if it's a free plan (plan_id=1)
      if ('plan_id' in subscriptionData) {
        return subscriptionData.plan_id === 1;
      }
      
      // API subscription with Plan object
      if ('Plan' in subscriptionData && subscriptionData.Plan) {
        return subscriptionData.Plan.name.toLowerCase() === 'free';
      }
    }
    
    // Check from user data
    if (!user || !user.subscriptions || !Array.isArray(user.subscriptions) || user.subscriptions.length === 0) {
      return true
    }
    
    const activeSubscription = user.subscriptions.find(sub => sub.status === 'active')
    return !activeSubscription || 
           activeSubscription.plan_id === 1 || 
           activeSubscription.plan?.name.toLowerCase() === 'free';
  }

  const handleDownload = (platform: string) => {
    // Check if user has a free plan
    if (isFreePlan()) {
      setSelectedDownload(platform)
      setShowUpgradeDialog(true)
      return
    }
    
    // For paid plans, proceed with download
    console.log(`Downloading for ${platform}`)
    // You could also track downloads with analytics here
    // Here you'd implement the actual download logic
    
    // Example download URL construction based on platform
    let downloadUrl = "";
    switch(platform) {
      case "Windows":
        downloadUrl = "/downloads/securevpn-windows-latest.exe";
        break;
      case "Android":
        downloadUrl = "/downloads/securevpn-android-latest.apk";
        break;
      case "OpenVPN Config":
        downloadUrl = "/downloads/securevpn-openvpn-configs.zip";
        break;
      default:
        downloadUrl = "#";
    }
    
    // In a real implementation, you'd trigger the actual download
    // window.location.href = downloadUrl;
  }

  // Animation classes
  const lockAnimation = "transition-all duration-300 group-hover:scale-110"
  const unlockAnimation = "transition-all duration-300 group-hover:rotate-12"
  const buttonAnimation = "transition-transform duration-200 group-hover:scale-[1.02]"

  return (
    <div className="container p-0 mx-auto space-y-4 sm:space-y-6 md:space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-4 md:mb-8 px-3 sm:px-4">
        <h1 className="text-lg sm:text-xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Download CREST VPN
        </h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm md:text-base">
          Secure your connection on any device with our high-speed, privacy-focused VPN applications
        </p>
      </div>

      {/* Featured Download - Windows */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden mx-3 sm:mx-4 md:mx-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-3 sm:p-4 md:p-8 flex flex-col justify-center">
            <div className="w-fit mb-2 px-2 py-0.5 sm:py-1 bg-emerald-50 text-emerald-700 text-2xs sm:text-xs rounded-full font-medium">RECOMMENDED</div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">CrestVPN for Windows</h2>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
              Our flagship Windows application with advanced features and the highest level of encryption.
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="h-2 w-2 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-emerald-600" />
                </div>
                <span className="text-2xs sm:text-xs md:text-sm">Windows 10/11</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="h-2 w-2 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-emerald-600" />
                </div>
                <span className="text-2xs sm:text-xs md:text-sm">Latest v8.2.1</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="h-2 w-2 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-emerald-600" />
                </div>
                <span className="text-2xs sm:text-xs md:text-sm">18.4 MB</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <Button
                onClick={() => handleDownload("Windows")}
                className={`group bg-gradient-to-r ${isFreePlan() ? "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700" : "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"} rounded-full text-white ${buttonAnimation} text-2xs sm:text-xs md:text-sm h-7 sm:h-8 md:h-10`}
              >
                {isFreePlan() ? (
                  <Lock className={`mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${lockAnimation}`} />
                ) : (
                  <Unlock className={`mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${unlockAnimation}`} />
                )}
                {isFreePlan() ? "Premium Feature" : "Download Now"}
              </Button>
              <Button variant="outline" className="rounded-full text-2xs sm:text-xs md:text-sm h-7 sm:h-8 md:h-10">
                <Info className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                Release Notes
              </Button>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-3 sm:p-4 md:p-8">
            <div className="relative w-full max-w-[200px] sm:max-w-xs">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-lg"></div>
              <div className="relative bg-white rounded-lg p-4 shadow-sm">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/secure-network-laptop-Mj0ZJy2ekiOIcuOfPkCJlFebzMiwd6.png"
                  alt="SecureVPN for Windows"
                  width={300}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Platforms */}
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mt-6 sm:mt-8 md:mt-12 mb-3 sm:mb-4 md:mb-6 flex items-center px-3 sm:px-4 md:px-0">
        <Shield className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-emerald-600" />
        Available on All Your Devices
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 md:px-0">
        {/* Android */}
        <DownloadCard
          title="Android"
          image="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Android_robot.max-500x500.png"
          requirements="Android 6.0 or later"
          version="v8.5.0"
          onDownload={() => handleDownload("Android")}
          setupGuides={[
            { title: "Installation Guide", url: "#" },
            { title: "Troubleshooting", url: "#" },
          ]}
          storeLink={{
            text: "Get on Google Play",
            url: "https://play.google.com",
          }}
        />

        {/* iOS */}
        <DownloadCard
          title="iOS (Coming Soon)"
          image="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png"
          requirements="iOS 13.0 or later"
          version="v4.2.1 Beta"
          onDownload={() => handleDownload("iOS")}
          setupGuides={[
            { title: "Join Beta Program", url: "#" },
            { title: "Early Access", url: "#" },
          ]}
          storeLink={{
            text: "Coming Soon to App Store",
            url: "#",
          }}
        />

        {/* Android TV */}
    
      </div>

      {/* Configuration Files Section */}
      <div className="mt-6 sm:mt-8 md:mt-12 bg-white rounded-xl border border-gray-100 p-3 sm:p-4 md:p-6 shadow-sm mx-3 sm:mx-4 md:mx-0">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <div className="md:w-1/4">
            <div className="relative w-full max-w-[140px] sm:max-w-[160px] md:max-w-[200px] mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-lg"></div>
              <div className="relative bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <Image
                  src="https://img.freepik.com/premium-vector/outline-document-file-icon_791764-476.jpg"
                  alt="Configuration Files"
                  width={200}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          <div className="md:w-3/4 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Manual Configuration Files</h3>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
              Advanced users can download our configuration files for manual setup on any OpenVPN compatible device.
            </p>
            <div>
              <Button
                onClick={() => handleDownload("OpenVPN Config")}
                variant="outline"
                className={`group border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 ${buttonAnimation} text-2xs sm:text-xs md:text-sm h-7 sm:h-8 md:h-10`}
              >
                {isFreePlan() ? (
                  <Lock className={`mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${lockAnimation}`} />
                ) : (
                  <Unlock className={`mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${unlockAnimation}`} />
                )}
                {isFreePlan() ? "Premium Feature" : "OpenVPN Config Files"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 sm:mt-8 md:mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 sm:p-4 md:p-6 mx-3 sm:mx-4 md:mx-0">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="md:w-2/3">
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Need Help with Installation?</h3>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
              Our support team is available 24/7 to help you with any installation or configuration issues.
            </p>
            <Button variant="default" className="text-2xs sm:text-xs md:text-sm h-7 sm:h-8 md:h-10 bg-white text-emerald-700 hover:bg-gray-100">
              <ExternalLink className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              View Setup Tutorials
            </Button>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <Image
              src="/images/users.svg"
              alt="Customer Support"
              width={50}
              height={50}
              className="w-full max-w-[40px] sm:max-w-[50px] h-auto"
            />
          </div>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onClose={() => setShowUpgradeDialog(false)}
        feature={`download for ${selectedDownload}`}
      />
    </div>
  )
}

interface DownloadCardProps {
  title: string
  image: string
  requirements: string
  version: string
  onDownload: () => void
  setupGuides?: Array<{ title: string; url: string }>
  variants?: Array<{ name: string; onClick: () => void }>
  storeLink?: { text: string; url: string }
}

function DownloadCard({
  title,
  image,
  requirements,
  version,
  onDownload,
  setupGuides,
  variants,
  storeLink,
}: DownloadCardProps) {
  const { subscription } = useSubscription()
  
  const isLocked = () => {
    if (!subscription) return true;
    
    // Check from subscription state
    const subscriptionData = (subscription as any).data || subscription;
    
    // Check if it's a free plan (plan_id=1)
    if ('plan_id' in subscriptionData) {
      return subscriptionData.plan_id === 1;
    }
    
    // API subscription with Plan object
    if ('Plan' in subscriptionData && subscriptionData.Plan) {
      return subscriptionData.Plan.name.toLowerCase() === 'free';
    }
    
    return true;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow transition-all duration-200">
      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative flex-shrink-0">
            <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
            <Image 
              src={image} 
              alt={title} 
              width={48} 
              height={48} 
              className="w-full h-full object-contain p-1.5 sm:p-2 relative z-10" 
            />
          </div>
          <div>
            <h3 className="font-medium text-xs sm:text-sm md:text-base">{title}</h3>
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 text-2xs sm:text-xs">
              <span>{version}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{requirements}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
          <Button
            onClick={onDownload}
            className={`w-full text-2xs sm:text-xs md:text-sm h-7 sm:h-8 md:h-9 ${isLocked() ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"} rounded-lg`}
          >
            {isLocked() ? (
              <Lock className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            ) : (
              <Download className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            )}
            {isLocked() ? "Premium Feature" : "Download"}
          </Button>
          
          {storeLink && (
            <Button
              variant="outline"
              className="w-full text-2xs sm:text-xs md:text-sm h-7 sm:h-8 md:h-9 rounded-lg border-gray-200"
              asChild
            >
              <Link href={storeLink.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {storeLink.text}
              </Link>
            </Button>
          )}
        </div>
        
        {(setupGuides && setupGuides.length > 0) && (
          <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
            <p className="text-2xs sm:text-xs text-gray-500 mb-1 sm:mb-2">Setup Guides:</p>
            <ul className="space-y-0.5 sm:space-y-1">
              {setupGuides.map((guide, index) => (
                <li key={index}>
                  <Link 
                    href={guide.url}
                    className="text-2xs sm:text-xs md:text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mr-1.5 sm:mr-2"></div>
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {variants && variants.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
            <p className="text-2xs sm:text-xs text-gray-500 mb-1 sm:mb-2">Variants:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {variants.map((variant, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-6 sm:h-7 text-2xs sm:text-xs border border-gray-200 rounded-md"
                  onClick={variant.onClick}
                >
                  {variant.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
