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
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Download CREST VPN
        </h1>
        <p className="text-muted-foreground mt-3">
          Secure your connection on any device with our high-speed, privacy-focused VPN applications
        </p>
      </div>

      {/* Featured Download - Windows */}
      <Card className="bg-white shadow-none border-none overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 flex flex-col justify-center">
            <Badge className="w-fit mb-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">RECOMMENDED</Badge>
            <h2 className="text-2xl font-bold mb-2">CrestVPN for Windows</h2>
            <p className="text-muted-foreground mb-4">
              Our flagship Windows application with advanced features and the highest level of encryption.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-sm">Windows 10/11</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-sm">Latest v8.2.1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-sm">18.4 MB</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleDownload("Windows")}
                className={`group bg-gradient-to-r ${isFreePlan() ? "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700" : "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"} rounded-full text-white ${buttonAnimation}`}
              >
                {isFreePlan() ? (
                  <Lock className={`mr-2 h-4 w-4 ${lockAnimation}`} />
                ) : (
                  <Unlock className={`mr-2 h-4 w-4 ${unlockAnimation}`} />
                )}
                {isFreePlan() ? "Premium Feature" : "Download Now"}
              </Button>
              <Button variant="outline" className="rounded-full">
                <Info className="mr-2 h-4 w-4" />
                Release Notes
              </Button>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-8">
            <div className="relative w-full max-w-xs">
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
      </Card>

      {/* All Platforms */}
      <h2 className="text-xl font-semibold mt-12 mb-6 flex items-center">
        <Shield className="mr-2 h-5 w-5 text-emerald-600" />
        Available on All Your Devices
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="mt-12 bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/4">
            <div className="relative w-full max-w-[200px] mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-lg"></div>
              <div className="relative bg-white rounded-lg p-4 shadow-sm">
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
          <div className="md:w-3/4">
            <h3 className="text-lg font-semibold mb-2">Manual Configuration Files</h3>
            <p className="text-muted-foreground mb-4">
              Advanced users can download our configuration files for manual setup on any OpenVPN compatible device.
            </p>
            <div>
              <Button
                onClick={() => handleDownload("OpenVPN Config")}
                variant="outline"
                className={`group border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 ${buttonAnimation}`}
              >
                {isFreePlan() ? (
                  <Lock className={`mr-2 h-4 w-4 ${lockAnimation}`} />
                ) : (
                  <Unlock className={`mr-2 h-4 w-4 ${unlockAnimation}`} />
                )}
                {isFreePlan() ? "Premium Feature" : "OpenVPN Config Files"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-2/3">
            <h3 className="text-lg font-semibold mb-2">Need Help with Installation?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is available 24/7 to help you with any installation or configuration issues.
            </p>
            <Button variant="default" className="bg-white text-emerald-700 hover:bg-gray-100">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Setup Tutorials
            </Button>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <Image
              src="/images/users.svg"
              alt="Customer Support"
              width={50}
              height={50}
              className="w-full max-w-[50px] h-auto"
            />
          </div>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog 
        isOpen={showUpgradeDialog} 
        onClose={() => setShowUpgradeDialog(false)}
        downloadType={selectedDownload}
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
  
  // Check if user has a free plan - reusing the logic from the parent component
  const isLocked = () => {
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
    
    return true;
  }

  // Animation classes
  const lockAnimation = "transition-all duration-300 group-hover:scale-110"
  const unlockAnimation = "transition-all duration-300 group-hover:rotate-12"
  const buttonAnimation = "transition-transform duration-200 group-hover:scale-[1.02]"

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 flex-1 flex flex-col">
        <div className="aspect-video relative mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-md overflow-hidden">
          <Image src={image || "/placeholder.svg"} alt={`${title} app`} fill className="object-contain p-8" />
        </div>

        <h3 className="text-lg font-semibold">{title}</h3>

        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>{requirements}</span>
          <span>•</span>
          <Badge variant="outline" className="text-xs font-normal bg-emerald-50 text-emerald-700 border-0">
            {version}
          </Badge>      
        </div>

        <div className="mt-4 space-y-3">
          {variants ? (
            <div className="grid grid-cols-2 gap-2">
              {variants.map((variant, i) => (
                <Button
                  key={i}
                  onClick={variant.onClick}
                  className={
                    i === 0
                      ? `group w-full ${isLocked() ? "bg-gray-500 hover:bg-gray-600" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"} text-white ${buttonAnimation}`
                      : "w-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  }
                  variant={i === 0 ? "default" : "outline"}
                >
                  {i === 0 && isLocked() ? (
                    <Lock className={`mr-2 h-4 w-4 ${lockAnimation}`} />
                  ) : (
                    <>{i === 0 ? (
                      isLocked() ? null : <Unlock className={`mr-2 h-4 w-4 ${unlockAnimation}`} />
                    ) : null}</>
                  )}
                  {i === 0 && isLocked() ? "Premium Feature" : variant.name}
                </Button>
              ))}
            </div>
          ) : (
            <Button
              onClick={onDownload}
              className={`group w-full ${isLocked() ? "bg-gray-500 hover:bg-gray-600" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"} text-white ${buttonAnimation}`}
            >
              {isLocked() ? (
                <Lock className={`mr-2 h-4 w-4 ${lockAnimation}`} />
              ) : (
                <Unlock className={`mr-2 h-4 w-4 ${unlockAnimation}`} />
              )}
              {isLocked() ? "Premium Feature" : "Download"}
            </Button>
          )}

          {storeLink && (
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href={storeLink.url}>
                <ExternalLink className="mr-2 h-4 w-4" />
                {storeLink.text}
              </Link>
            </Button>
          )}

          {setupGuides && setupGuides.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-1.5">Setup guides:</p>
              <div className="flex flex-wrap gap-2">
                {setupGuides.map((guide, i) => (
                  <Link
                    key={i}
                    href={guide.url}
                    className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    {guide.title}
                    {i < setupGuides.length - 1 && <span className="ml-2 text-gray-300">•</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
