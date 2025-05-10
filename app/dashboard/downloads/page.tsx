"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Info, Shield, Check, ExternalLink, Lock, Unlock, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/app/contexts/auth-context"
import { UpgradeDialog } from "@/components/upgrade-dialog"
import { useSubscription } from "@/app/contexts/subscription-context"
import { toast } from "react-hot-toast"

// After the imports, add this diagnostic component
function AuthDebugButton({ onDebugComplete }: { onDebugComplete: (result: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [debugType, setDebugType] = useState<'auth' | 'token'>('auth');
  
  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      // Choose which endpoint to use based on debug type
      const endpoint = debugType === 'auth' ? '/api/auth-status' : '/api/debug-token';
      
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      onDebugComplete(data);
    } catch (error) {
      console.error('Auth check error:', error);
      onDebugComplete({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Button
          variant={debugType === 'auth' ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
          onClick={() => setDebugType('auth')}
        >
          Auth Status
        </Button>
        <Button
          variant={debugType === 'token' ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
          onClick={() => setDebugType('token')}
        >
          Token Debug
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-gray-500 hover:text-gray-700"
        onClick={checkAuthStatus}
        disabled={loading}
      >
        {loading ? 'Checking...' : `Check ${debugType === 'auth' ? 'Auth Status' : 'Token Status'}`}
      </Button>
    </div>
  );
}

export default function DownloadsPage() {
  const { user, token } = useAuth()
  const { subscription, loading: subscriptionLoading } = useSubscription()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [selectedDownload, setSelectedDownload] = useState("")
  const [authDebugResult, setAuthDebugResult] = useState<any>(null)
  const [showAuthDebug, setShowAuthDebug] = useState(false)
  const [pageReady, setPageReady] = useState(false)

  // Manage page loading once we have essential data
  useEffect(() => {
    if (user && !subscriptionLoading) {
      // Only show page when necessary data is loaded
      const timer = setTimeout(() => {
        setPageReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, subscriptionLoading]);

  // If data isn't ready, show a minimal inline loader instead of a full screen one
  if (!pageReady) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-500">Preparing downloads...</p>
        </div>
      </div>
    );
  }

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
        return subscriptionData.Plan.name.toLowerCase() === 'free' || 
               subscriptionData.Plan.price === "0.00";
      }
    }
    
    // Check from user data
    if (!user || !user.subscriptions || !Array.isArray(user.subscriptions) || user.subscriptions.length === 0) {
      return true;
    }
    
    const activeSubscription = user.subscriptions.find(sub => sub.status === 'active');
    return !activeSubscription || 
           activeSubscription.plan_id === 1 || 
           (activeSubscription.plan?.name?.toLowerCase() === 'free') ||
           (activeSubscription.plan?.price === "0.00");
  }

  const handleDownload = async (platform: string) => {
    // Check if user has a free plan
    if (isFreePlan()) {
      setSelectedDownload(platform)
      setShowUpgradeDialog(true)
      return
    }
    
    // For paid plans, proceed with download
    console.log(`Downloading for ${platform}`)
    
    // Example download URL construction based on platform
    let downloadUrl = "";
    let useSecureApi = false;
    let useDirectUrl = false;
    
    switch(platform) {
      case "Windows":
        // Route all premium downloads through the secure API
        downloadUrl = "securevpn-windows-latest.exe";
        useSecureApi = true;
        break;
      case "Android":
        // Route all premium downloads through the secure API
        downloadUrl = "securevpn-android-latest.apk";
        useSecureApi = true;
        break;
      case "OpenVPN Config":
        // Use direct Firebase Storage URL for OpenVPN config
        downloadUrl = "https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Falice2-team-1.ovpn?alt=media&token=fb49c9dd-4e38-429c-ba76-351170c09292";
        useDirectUrl = true;
        break;
      default:
        downloadUrl = "#";
    }
    
    // Trigger the download via the appropriate method
    if (useDirectUrl) {
      // For direct URLs like Firebase Storage, simply redirect the browser
      window.location.href = downloadUrl;
    } else if (useSecureApi) {
      // Get the token directly from the auth context
      const authToken = token; // From useAuth() context
      
      if (!authToken) {
        toast.error("Authentication required. Please log in again.");
        setShowAuthDebug(true);
        return;
      }
      
      // Try to refresh the token first to avoid expiration issues
      try {
        const refreshResponse = await fetch('/api/auth/refresh-token', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        const refreshData = await refreshResponse.json();
        console.log('Token refresh check result:', refreshData);
        
        // If token was refreshed, wait a moment for cookies to be set
        if (refreshData.refreshed) {
          toast.success("Authentication refreshed");
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        // Continue with download attempt even if refresh fails
      }
      
      // For secure API endpoint, we need to handle the download carefully to include authentication
      // Instead of redirecting the browser, we'll make a fetch request and handle the response
      
      // Create a download by using the Fetch API with explicit auth header
      fetch(`/api/downloads?file=${downloadUrl}`, {
        method: 'GET',
        credentials: 'include', // This ensures cookies are sent with the request
        headers: {
          'Authorization': `Bearer ${authToken}` // Add explicit auth header
        }
      })
      .then(response => {
        if (!response.ok) {
          // If response is not OK, parse it as JSON to get the error message
          return response.json().then(errData => {
            // If we get an auth error, show the auth debug option
            if (errData.error === 'Authentication required' || errData.error === 'Invalid or expired token') {
              setShowAuthDebug(true);
            }
            throw new Error(errData.error || 'Download failed');
          });
        }
        // If response is OK, create a blob from the response
        return response.blob();
      })
      .then(blob => {
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = downloadUrl; // Use the original filename
        
        // Append to the document and trigger the download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Download error:', error);
        // Show an error toast or message to the user
        toast.error(`Error: ${error.message}. Please try again.`);
      });
    } else if (downloadUrl !== "#") {
      // Direct download for public files (still accessible to anyone who knows the URL)
      window.location.href = downloadUrl;
    }
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
                onClick={() => {
                  if (isFreePlan()) {
                    // For free plan users, show upgrade dialog
                    setSelectedDownload("Windows")
                    setShowUpgradeDialog(true)
                  } else {
                    // For paid users, direct download from Firebase URL
                    window.location.href = "https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Falice2-team-1.ovpn?alt=media&token=fb49c9dd-4e38-429c-ba76-351170c09292"
                  }
                }}
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
          onDownload={() => {
            if (isFreePlan()) {
              setSelectedDownload("Android")
              setShowUpgradeDialog(true)
            } else {
              // For paid users, direct download from Firebase URL
              window.location.href = "https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Falice2-team-1.ovpn?alt=media&token=fb49c9dd-4e38-429c-ba76-351170c09292"
            }
          }}
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
          onDownload={() => {
            if (isFreePlan()) {
              setSelectedDownload("iOS")
              setShowUpgradeDialog(true)
            } else {
              // iOS coming soon - show a toast instead of download
              toast.success("iOS app is coming soon! Join our beta program.")
            }
          }}
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
                onClick={() => {
                  if (isFreePlan()) {
                    // For free plan users, show upgrade dialog
                    setSelectedDownload("OpenVPN Config")
                    setShowUpgradeDialog(true)
                  } else {
                    // For paid users, direct download from Firebase URL
                    window.location.href = "https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Falice2-team-1.ovpn?alt=media&token=fb49c9dd-4e38-429c-ba76-351170c09292"
                  }
                }}
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
              
              {/* Add specific VPN config options for paid users */}
              {!isFreePlan() && (
                <div className="mt-3 space-y-2">
                  <p className="text-2xs sm:text-xs text-gray-500">Available configurations:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => window.location.href = "https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Falice2-team-1.ovpn?alt=media&token=fb49c9dd-4e38-429c-ba76-351170c09292"}
                      variant="ghost"
                      size="sm"
                      className="rounded-md border border-gray-200 text-2xs sm:text-xs h-7 sm:h-8"
                    >
                      <Download className="mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      alice2-team-1.ovpn
                    </Button>
                  </div>
                </div>
              )}
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

      {/* Authentication Debug Panel */}
      {showAuthDebug && (
        <div className="mt-6 sm:mt-8 md:mt-12 border border-amber-200 bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6 mx-3 sm:mx-4 md:mx-0">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-amber-800">Authentication Troubleshooter</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-amber-800 hover:bg-amber-100"
                onClick={() => {
                  setShowAuthDebug(false);
                  setAuthDebugResult(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs sm:text-sm text-amber-700">
              There seems to be an issue with your authentication. This could happen if your session has expired or if cookies are blocked.
            </p>
            
            <div className="flex flex-col space-y-2">
              <p className="text-xs font-medium text-amber-800">Try these solutions:</p>
              <ol className="list-decimal list-inside text-xs text-amber-700 space-y-1">
                <li>Refresh the page and try again</li>
                <li>Log out and log back in</li>
                <li>Make sure cookies are enabled in your browser</li>
                <li>Clear your browser cache and cookies</li>
              </ol>
            </div>
            
            {!authDebugResult ? (
              <div className="flex justify-end space-x-2">
                <AuthDebugButton onDebugComplete={setAuthDebugResult} />
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-amber-700 border-amber-300"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/test-token', {
                        credentials: 'include',
                        headers: token ? {
                          'Authorization': `Bearer ${token}`
                        } : {}
                      });
                      const data = await res.json();
                      setAuthDebugResult({
                        tokenTest: data
                      });
                    } catch (error) {
                      console.error('Token test error:', error);
                      setAuthDebugResult({
                        error: error instanceof Error ? error.message : 'Unknown error testing token'
                      });
                    }
                  }}
                >
                  Inspect Token
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-amber-700 border-amber-300"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/auth/refresh-token', {
                        credentials: 'include',
                        headers: token ? {
                          'Authorization': `Bearer ${token}`
                        } : {}
                      });
                      const data = await res.json();
                      toast.success(data.refreshed ? 'Token refreshed!' : 'Token still valid');
                      setAuthDebugResult({
                        tokenRefresh: data
                      });
                      
                      // If token was refreshed, reload the page after a short delay
                      if (data.refreshed) {
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                      }
                    } catch (error) {
                      console.error('Token refresh error:', error);
                      toast.error('Token refresh failed');
                      setAuthDebugResult({
                        error: error instanceof Error ? error.message : 'Unknown error refreshing token'
                      });
                    }
                  }}
                >
                  Refresh Token
                </Button>
              </div>
            ) : (
              <div className="mt-2 border border-amber-200 bg-white rounded-md p-3">
                <h4 className="text-xs font-medium text-amber-800 mb-2">Authentication Status:</h4>
                <div className="text-xs text-gray-700 font-mono whitespace-pre-wrap overflow-auto max-h-60">
                  {authDebugResult.tokenTest && (
                    <div>
                      <div className="mb-2">
                        <span className="font-semibold">Token Source:</span> {authDebugResult.tokenTest.token_source}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Token Valid:</span> {
                          authDebugResult.tokenTest.validation_errors.length === 0 ? '✅' : '❌'
                        }
                      </div>
                      {authDebugResult.tokenTest.decoded && (
                        <div className="mb-2">
                          <span className="font-semibold">Expiration:</span> {authDebugResult.tokenTest.decoded.expires_at}
                          <div className="ml-4">
                            <span className="font-semibold">Time Remaining:</span> {
                              authDebugResult.tokenTest.decoded.time_remaining > 0 
                                ? `${authDebugResult.tokenTest.decoded.time_remaining} seconds` 
                                : 'Expired'
                            }
                          </div>
                        </div>
                      )}
                      {authDebugResult.tokenTest.validation_errors.length > 0 && (
                        <div className="mb-2">
                          <span className="font-semibold">Errors:</span>
                          <ul className="ml-4 mt-1">
                            {authDebugResult.tokenTest.validation_errors.map((error: any, index: number) => (
                              <li key={index} className="text-red-600">
                                {error.source}: {error.error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {authDebugResult.tokenRefresh && (
                    <div>
                      <div className="mb-2">
                        <span className="font-semibold">Token Refresh:</span> {
                          authDebugResult.tokenRefresh.refreshed ? 'Token was refreshed ✅' : 'Token still valid ✅'
                        }
                      </div>
                      {authDebugResult.tokenRefresh.tokenInfo && (
                        <div className="mb-2">
                          <span className="font-semibold">Token Info:</span>
                          <div className="ml-4">
                            <div>Expires: {new Date(authDebugResult.tokenRefresh.tokenInfo.expiresAt * 1000).toISOString()}</div>
                            <div>Remaining: {authDebugResult.tokenRefresh.tokenInfo.timeRemaining} seconds</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {authDebugResult.auth && (
                    <>
                      <div className="mb-2">
                        <span className="font-semibold">Token Present:</span> {authDebugResult.auth?.tokenPresent ? '✅' : '❌'}
                      </div>
                      {authDebugResult.validationResult && (
                        <div className="mb-2">
                          <span className="font-semibold">Token Valid:</span> {authDebugResult.validationResult.valid ? '✅' : '❌'}
                          {authDebugResult.validationResult.error && (
                            <div className="text-red-600 mt-1">{authDebugResult.validationResult.error}</div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {token && (
                  <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs font-medium mb-1">Emergency Download Option:</p>
                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 w-full border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200"
                        onClick={() => {
                          // Use direct URL with token parameter for emergency downloads
                          window.location.href = `/api/downloads?file=securevpn-windows-latest.exe&token=${token}`;
                        }}
                      >
                        Try Download Windows Client with Token in URL
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 w-full border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200"
                        onClick={() => {
                          // Use direct Firebase Storage URL for OpenVPN config
                          window.location.href = "https://firebasestorage.googleapis.com/v0/b/me365-81633.appspot.com/o/crest%2Falice2-team-1.ovpn?alt=media&token=fb49c9dd-4e38-429c-ba76-351170c09292";
                        }}
                      >
                        Direct Download OpenVPN Config
                      </Button>
                    </div>
                    <p className="text-2xs text-amber-600 mt-1">
                      Note: This is a fallback method when cookies aren't working properly.
                    </p>
                  </div>
                )}
                
                <div className="mt-3 flex justify-between">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 text-amber-700 border-amber-200 hover:bg-amber-50"
                    onClick={() => window.location.href = '/login'}
                  >
                    Go to Login
                  </Button>
                  <div className="flex space-x-2">
                    <AuthDebugButton onDebugComplete={setAuthDebugResult} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-amber-700 border-amber-300"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/test-token', {
                            credentials: 'include',
                            headers: token ? {
                              'Authorization': `Bearer ${token}`
                            } : {}
                          });
                          const data = await res.json();
                          setAuthDebugResult({
                            tokenTest: data
                          });
                        } catch (error) {
                          console.error('Token test error:', error);
                          setAuthDebugResult({
                            error: error instanceof Error ? error.message : 'Unknown error testing token'
                          });
                        }
                      }}
                    >
                      Inspect Token
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
      return subscriptionData.Plan.name.toLowerCase() === 'free' || 
             subscriptionData.Plan.price === "0.00";
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
