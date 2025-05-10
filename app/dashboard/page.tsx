"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/app/contexts/auth-context"
import { 
  ArrowRight, 
  Clock, 
  Download, 
  Globe, 
  HelpCircle, 
  Lock, 
  Server, 
  Settings, 
  Shield, 
  Zap
} from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/app/contexts/subscription-context"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { subscription } = useSubscription()
  const [greeting, setGreeting] = useState("Welcome")
  const [isReady, setIsReady] = useState(false)
  const [lastConnection, setLastConnection] = useState<string | null>(null)
  
  // Set greeting based on time of day
  useEffect(() => {
    const currentHour = new Date().getHours()
    
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good morning")
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
    
    // Simulate last connection data (replace with actual API call in production)
    setLastConnection("Yesterday at 8:32 PM")
    
    // Indicate page is ready
    setIsReady(true)
  }, [])

  // Check if user has a free plan
  const isFreePlan = () => {
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

  if (!isReady) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-2">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-60 rounded-xl mt-6" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-2">
      {/* Welcome Section with Time-based Greeting */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {greeting}, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-emerald-50 text-sm md:text-base">
              Your CREST VPN dashboard is ready. {isFreePlan() ? 'Upgrade to Premium for full protection.' : 'Your protection is active.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-white text-emerald-700 hover:bg-emerald-50 border-none shadow-sm" 
              onClick={() => router.push('/dashboard/downloads')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Apps
            </Button>
          </div>
        </div>
        
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs flex items-center">
            <Shield className="h-3 w-3 mr-1.5" />
            {isFreePlan() ? 'Basic Protection' : 'Premium Protection'}
          </div>
          {lastConnection && (
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1.5" />
              Last connected: {lastConnection}
            </div>
          )}
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs flex items-center">
            <Server className="h-3 w-3 mr-1.5" />
            {isFreePlan() ? '3 servers available' : '65 servers available'}
          </div>
        </div>
      </div>
      
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <QuickActionCard 
          title="Download VPN Client"
          description="Get our apps for all your devices"
          icon={<Download className="h-5 w-5 text-emerald-600" />}
          href="/dashboard/downloads"
        />
        
        <QuickActionCard 
          title="Server Locations"
          description={isFreePlan() ? "Upgrade to access 65+ servers" : "Connect to any of our 65+ servers"}
          icon={<Globe className="h-5 w-5 text-emerald-600" />}
          href={isFreePlan() ? "/dashboard/upgrade" : "/dashboard/servers"}
          locked={isFreePlan()}
        />
        
        <QuickActionCard 
          title="Account Settings"
          description="Manage your profile and subscription"
          icon={<Settings className="h-5 w-5 text-emerald-600" />}
          href="/dashboard/settings"
        />
      </div>
      
      {/* Connection Stats & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 mr-2 text-emerald-600" />
            <h2 className="text-lg font-semibold">Connection Statistics</h2>
          </div>
          
          {isFreePlan() ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-3">
                Connection statistics are available for premium users
              </p>
              <Button 
                variant="outline" 
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => router.push('/dashboard/upgrade')}
              >
                Upgrade to Premium
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Data Used" value="1.2 GB" icon={<Zap className="h-5 w-5 text-emerald-500" />} />
              <StatCard title="Time Connected" value="5h 23m" icon={<Clock className="h-5 w-5 text-emerald-500" />} />
              <StatCard title="Threats Blocked" value="27" icon={<Shield className="h-5 w-5 text-emerald-500" />} />
            </div>
          )}
        </Card>
        
        <Card className="col-span-1 p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <HelpCircle className="h-5 w-5 mr-2 text-emerald-600" />
            <h2 className="text-lg font-semibold">Quick Tips</h2>
          </div>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-700 font-medium mt-0.5 mr-2">1</div>
              <span className="text-sm text-gray-600">Download our apps on all your devices for complete protection</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-700 font-medium mt-0.5 mr-2">2</div>
              <span className="text-sm text-gray-600">{isFreePlan() ? 'Upgrade to Premium for unlimited bandwidth' : 'Connect to the closest server for best performance'}</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-700 font-medium mt-0.5 mr-2">3</div>
              <span className="text-sm text-gray-600">Enable auto-connect to stay protected at all times</span>
            </li>
          </ul>
          
          <Button 
            variant="link" 
            className="text-emerald-600 hover:text-emerald-700 pl-0 mt-3"
            asChild
          >
            <Link href="/dashboard/support">
              View all help articles
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  locked?: boolean
}

function QuickActionCard({ title, description, icon, href, locked = false }: QuickActionCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="p-6 border border-gray-100 h-full transition-all duration-200 hover:border-emerald-200 hover:shadow-md group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-emerald-50">
        <div className="flex items-start justify-between">
          <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
            {icon}
          </div>
          {locked && (
            <div className="bg-gray-100 rounded-full p-1">
              <Lock className="h-3.5 w-3.5 text-gray-400" />
            </div>
          )}
        </div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex items-center mt-4 text-xs text-emerald-600 font-medium group-hover:translate-x-0.5 transition-transform duration-200">
          {locked ? 'Upgrade to unlock' : 'Get started'}
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </Card>
    </Link>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        {icon}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}
