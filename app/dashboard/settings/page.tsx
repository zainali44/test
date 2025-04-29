"use client"

import React, { useState } from "react"
import {
  AlertCircle,
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Info,
  Languages,
  Lock,
  Monitor,
  Moon,
  Power,
  RefreshCw,
  Save,
  Server,
  SettingsIcon,
  Shield,
  Sun,
  Trash2,
  Wifi,
  SunMoon,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function SettingsPage() {
  // State for settings
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("english")
  const [autoConnect, setAutoConnect] = useState(true)
  const [killSwitch, setKillSwitch] = useState(true)
  const [dnsLeak, setDnsLeak] = useState(true)
  const [ipv6Leak, setIpv6Leak] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [updates, setUpdates] = useState(true)
  const [analytics, setAnalytics] = useState(false)
  const [protocol, setProtocol] = useState("automatic")
  const [startOnBoot, setStartOnBoot] = useState(true)
  const [minimizeToTray, setMinimizeToTray] = useState(true)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showClearDataDialog, setShowClearDataDialog] = useState(false)
  const [timezone, setTimezone] = useState("utc-8")
  const [dateFormat, setDateFormat] = useState("mdy")
  const [privacySettings, setPrivacySettings] = useState({
    analytics: true,
    cookieConsent: true,
    dataSharing: false,
  })

  // Handle reset settings
  const handleResetSettings = () => {
    setTheme("system")
    setLanguage("english")
    setAutoConnect(true)
    setKillSwitch(true)
    setDnsLeak(true)
    setIpv6Leak(true)
    setNotifications(true)
    setUpdates(true)
    setAnalytics(false)
    setProtocol("automatic")
    setStartOnBoot(true)
    setMinimizeToTray(true)
    setShowResetDialog(false)
    setTimezone("utc-8")
    setDateFormat("mdy")
    setPrivacySettings({
      analytics: true,
      cookieConsent: true,
      dataSharing: false,
    })
  }

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!")
  }

  return (
    <div className="container p-0 mx-auto space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center">
            <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-1.5 sm:mr-2" />
            <h2 className="text-base sm:text-lg font-medium">Settings</h2>
          </div>
          <Button 
            variant="default"
            size="sm" 
            className="h-7 sm:h-8 text-2xs sm:text-xs rounded-md bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSaveSettings}
          >
            Save Changes
          </Button>
        </div>
        
        <div className="p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 flex items-center">
              <SunMoon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 mr-1.5 sm:mr-2" />
              Appearance
            </h3>
            <div className="p-3 sm:p-4 rounded-lg bg-gray-50 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <div className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">Theme</div>
                  <p className="text-2xs sm:text-xs text-gray-500">Choose how the dashboard looks to you</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    className={`h-7 sm:h-8 text-2xs sm:text-xs ${theme === 'light' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    className={`h-7 sm:h-8 text-2xs sm:text-xs ${theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    className={`h-7 sm:h-8 text-2xs sm:text-xs ${theme === 'system' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                    System
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div>
            <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 flex items-center">
              <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 mr-1.5 sm:mr-2" />
              Notifications
            </h3>
            <div className="p-3 sm:p-4 rounded-lg bg-gray-50 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-medium">Enable Notifications</div>
                  <p className="text-2xs sm:text-xs text-gray-500">Receive notifications about updates and activity</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>
              
              {notifications && (
                <div className="pt-2 sm:pt-3 border-t border-gray-200 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-medium">Email Notifications</div>
                      <p className="text-2xs sm:text-xs text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={updates} 
                      onCheckedChange={setUpdates}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-medium">Push Notifications</div>
                      <p className="text-2xs sm:text-xs text-gray-500">Receive notifications in the browser</p>
                    </div>
                    <Switch 
                      checked={notifications} 
                      onCheckedChange={setNotifications}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Regional Settings */}
          <div>
            <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 flex items-center">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 mr-1.5 sm:mr-2" />
              Regional Settings
            </h3>
            <div className="p-3 sm:p-4 rounded-lg bg-gray-50 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="space-y-0.5 sm:w-1/3">
                  <div className="text-xs sm:text-sm font-medium">Language</div>
                  <p className="text-2xs sm:text-xs text-gray-500">Select your preferred language</p>
                </div>
                <div className="w-full sm:w-2/3">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="space-y-0.5 sm:w-1/3">
                  <div className="text-xs sm:text-sm font-medium">Timezone</div>
                  <p className="text-2xs sm:text-xs text-gray-500">Set your timezone for accurate time display</p>
                </div>
                <div className="w-full sm:w-2/3">
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-full h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-12">UTC-12:00</SelectItem>
                      <SelectItem value="utc-11">UTC-11:00</SelectItem>
                      <SelectItem value="utc-10">UTC-10:00</SelectItem>
                      <SelectItem value="utc-9">UTC-09:00</SelectItem>
                      <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                      <SelectItem value="utc-7">UTC-07:00 (MST)</SelectItem>
                      <SelectItem value="utc-6">UTC-06:00 (CST)</SelectItem>
                      <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                      <SelectItem value="utc-4">UTC-04:00</SelectItem>
                      <SelectItem value="utc-3">UTC-03:00</SelectItem>
                      <SelectItem value="utc-2">UTC-02:00</SelectItem>
                      <SelectItem value="utc-1">UTC-01:00</SelectItem>
                      <SelectItem value="utc">UTC±00:00</SelectItem>
                      <SelectItem value="utc+1">UTC+01:00</SelectItem>
                      <SelectItem value="utc+2">UTC+02:00</SelectItem>
                      <SelectItem value="utc+3">UTC+03:00</SelectItem>
                      <SelectItem value="utc+4">UTC+04:00</SelectItem>
                      <SelectItem value="utc+5">UTC+05:00</SelectItem>
                      <SelectItem value="utc+6">UTC+06:00</SelectItem>
                      <SelectItem value="utc+7">UTC+07:00</SelectItem>
                      <SelectItem value="utc+8">UTC+08:00</SelectItem>
                      <SelectItem value="utc+9">UTC+09:00</SelectItem>
                      <SelectItem value="utc+10">UTC+10:00</SelectItem>
                      <SelectItem value="utc+11">UTC+11:00</SelectItem>
                      <SelectItem value="utc+12">UTC+12:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="space-y-0.5 sm:w-1/3">
                  <div className="text-xs sm:text-sm font-medium">Date Format</div>
                  <p className="text-2xs sm:text-xs text-gray-500">Choose how dates should be displayed</p>
                </div>
                <div className="w-full sm:w-2/3">
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger className="w-full h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Privacy & Data */}
          <div>
            <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 flex items-center">
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 mr-1.5 sm:mr-2" />
              Privacy & Data
            </h3>
            <div className="p-3 sm:p-4 rounded-lg bg-gray-50 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-medium">Usage Analytics</div>
                  <p className="text-2xs sm:text-xs text-gray-500">Help us improve by sending anonymous usage data</p>
                </div>
                <Switch 
                  checked={analytics} 
                  onCheckedChange={setAnalytics}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-medium">Cookie Consent</div>
                  <p className="text-2xs sm:text-xs text-gray-500">Allow cookies to enhance your experience</p>
                </div>
                <Switch 
                  checked={privacySettings.cookieConsent} 
                  onCheckedChange={(value) => setPrivacySettings({...privacySettings, cookieConsent: value})}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-medium">Data Sharing</div>
                  <p className="text-2xs sm:text-xs text-gray-500">Share data with our trusted partners</p>
                </div>
                <Switch 
                  checked={privacySettings.dataSharing} 
                  onCheckedChange={(value) => setPrivacySettings({...privacySettings, dataSharing: value})}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>
            </div>
          </div>
          
          {/* Data Export */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-medium flex items-center">
                <PieChart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 mr-1.5 sm:mr-2" />
                Data Export
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-7 sm:h-8 text-2xs sm:text-xs"
              >
                Request Data Export
              </Button>
            </div>
            <p className="text-2xs sm:text-xs text-gray-500 mt-1">Download all your data and activity history.</p>
            <p className="text-2xs sm:text-xs mt-1 flex items-center text-amber-600">
              <Info className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
              Data exports are processed within 24-48 hours and sent via email.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Settings Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="max-w-md rounded-sm p-0 border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-medium">Reset all settings?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-gray-500 mt-1">
                This will restore all settings to their default values. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-4 flex-row justify-end gap-2">
            <AlertDialogCancel className="text-xs h-8 px-3 rounded-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-xs h-8 px-3 rounded-sm"
              onClick={handleResetSettings}
            >
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Data Dialog */}
      <AlertDialog open={showClearDataDialog} onOpenChange={setShowClearDataDialog}>
        <AlertDialogContent className="max-w-md rounded-sm p-0 border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-medium">Clear application data?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-gray-500 mt-1">
                This will remove all locally stored data, including saved preferences, connection history, and cached
                credentials. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-4 flex-row justify-end gap-2">
            <AlertDialogCancel className="text-xs h-8 px-3 rounded-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-xs h-8 px-3 rounded-sm">
              Clear Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
