"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Info, Shield, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function DownloadsPage() {
  const handleDownload = (platform: string) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading for ${platform}`)
    // You could also track downloads with analytics here
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Download SecureVPN
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
            <h2 className="text-2xl font-bold mb-2">SecureVPN for Windows</h2>
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
                onClick={() => handleDownload("windows")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Now
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
          onDownload={() => handleDownload("android")}
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
          onDownload={() => handleDownload("ios")}
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
                onClick={() => handleDownload("openvpn-config")}
                variant="outline"
                className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Download className="mr-2 h-4 w-4" />
                OpenVPN Config Files
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
                      ? "w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      : "w-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 "
                  }
                  variant={i === 0 ? "default" : "outline"}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {variant.name}
                </Button>
              ))}
            </div>
          ) : (
            <Button
              onClick={onDownload}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}

          {storeLink && (
            <Button
              variant="outline"
              className="w-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              asChild
            >
              <Link href={storeLink.url} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                {storeLink.text}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {setupGuides && setupGuides.length > 0 && (
        <>
          <Separator />
          <div className="p-4 bg-gray-50">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 mr-1.5 text-emerald-600" />
              Setup Guides
            </h4>
            <ul className="space-y-1.5">
              {setupGuides.map((guide, i) => (
                <li key={i}>
                  <Link
                    href={guide.url}
                    className="text-sm text-muted-foreground hover:text-emerald-600 flex items-center"
                  >
                    <Check className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
