"use client"

import { useState } from "react"
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
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center">
          <h1 className="text-base font-medium text-gray-900">Settings</h1>
          <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-600 border-0 text-[9px] px-1.5 py-0">
            v2.4.1
          </Badge>
        </div>
        <p className="mt-1 text-gray-500 text-xs">
          Configure your VPN client preferences, security options, and application behavior.
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <div className="space-y-6">
            {/* Appearance Section */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Monitor className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Appearance</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Theme Setting */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      {theme === "light" && <Sun className="h-4 w-4 text-amber-500" />}
                      {theme === "dark" && <Moon className="h-4 w-4 text-gray-700" />}
                      {theme === "system" && <Monitor className="h-4 w-4 text-gray-700" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Theme</div>
                      <div className="text-xs text-gray-500 mt-0.5">Choose your preferred appearance</div>
                    </div>
                  </div>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="h-8 rounded-sm border-gray-200 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                {/* Language Setting */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Languages className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Language</div>
                      <div className="text-xs text-gray-500 mt-0.5">Select your preferred language</div>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="h-8 rounded-sm border-gray-200 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="japanese">Japanese</option>
                    <option value="chinese">Chinese</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Application Behavior */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <SettingsIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Application Behavior</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Start on Boot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Power className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Start on Boot</div>
                      <div className="text-xs text-gray-500 mt-0.5">Launch application when system starts</div>
                    </div>
                  </div>
                  <Switch
                    checked={startOnBoot}
                    onCheckedChange={setStartOnBoot}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>

                {/* Minimize to Tray */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Monitor className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Minimize to Tray</div>
                      <div className="text-xs text-gray-500 mt-0.5">Keep running in system tray when closed</div>
                    </div>
                  </div>
                  <Switch
                    checked={minimizeToTray}
                    onCheckedChange={setMinimizeToTray}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Notifications</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Connection Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Bell className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Connection Notifications</div>
                      <div className="text-xs text-gray-500 mt-0.5">Show alerts for connection status changes</div>
                    </div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>

                {/* Update Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <RefreshCw className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Update Notifications</div>
                      <div className="text-xs text-gray-500 mt-0.5">Notify when new versions are available</div>
                    </div>
                  </div>
                  <Switch
                    checked={updates}
                    onCheckedChange={setUpdates}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* VPN Security */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">VPN Security</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Kill Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Power className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">Kill Switch</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="ml-1 text-gray-400 hover:text-gray-600">
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="text-[10px] p-2 max-w-[200px]">
                              <p>
                                Blocks all internet traffic if the VPN connection drops unexpectedly, preventing data
                                leaks.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Block internet if VPN disconnects</div>
                    </div>
                  </div>
                  <Switch
                    checked={killSwitch}
                    onCheckedChange={setKillSwitch}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>

                {/* DNS Leak Protection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Globe className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">DNS Leak Protection</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="ml-1 text-gray-400 hover:text-gray-600">
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="text-[10px] p-2 max-w-[200px]">
                              <p>
                                Ensures all DNS requests go through the VPN tunnel, preventing your ISP from seeing your
                                browsing activity.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Prevent DNS requests from leaking</div>
                    </div>
                  </div>
                  <Switch
                    checked={dnsLeak}
                    onCheckedChange={setDnsLeak}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>

                {/* IPv6 Leak Protection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Lock className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">IPv6 Leak Protection</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="ml-1 text-gray-400 hover:text-gray-600">
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="text-[10px] p-2 max-w-[200px]">
                              <p>Disables IPv6 traffic to prevent leaks when using IPv4 VPN connections.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Disable IPv6 to prevent leaks</div>
                    </div>
                  </div>
                  <Switch
                    checked={ipv6Leak}
                    onCheckedChange={setIpv6Leak}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Privacy</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Usage Analytics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <SettingsIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Usage Analytics</div>
                      <div className="text-xs text-gray-500 mt-0.5">Share anonymous usage data to improve the app</div>
                    </div>
                  </div>
                  <Switch
                    checked={analytics}
                    onCheckedChange={setAnalytics}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>

                {/* Clear Data */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Trash2 className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Clear Application Data</div>
                      <div className="text-xs text-gray-500 mt-0.5">Remove all locally stored data and preferences</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowClearDataDialog(true)}
                    className="text-red-600 border-gray-200 hover:bg-red-50 text-xs h-8 px-3 rounded-sm"
                  >
                    Clear Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Connection Settings Tab */}
        <TabsContent value="connection">
          <div className="space-y-6">
            {/* Connection Preferences */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Wifi className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Connection Preferences</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Auto-Connect */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Wifi className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Auto-Connect</div>
                      <div className="text-xs text-gray-500 mt-0.5">Connect to VPN when application starts</div>
                    </div>
                  </div>
                  <Switch
                    checked={autoConnect}
                    onCheckedChange={setAutoConnect}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-600 to-teal-500"
                  />
                </div>

                {/* Protocol Selection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Server className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Protocol</div>
                      <div className="text-xs text-gray-500 mt-0.5">Select preferred VPN protocol</div>
                    </div>
                  </div>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="h-8 rounded-sm border-gray-200 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="openvpn">OpenVPN</option>
                    <option value="wireguard">WireGuard</option>
                    <option value="ikev2">IKEv2</option>
                  </select>
                </div>

                {/* Trusted Networks */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Trusted Networks</div>
                      <div className="text-xs text-gray-500 mt-0.5">Manage networks where VPN is not required</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-900 border-gray-200 hover:bg-gray-50 text-xs h-8 px-3 rounded-sm"
                  >
                    Configure
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Connection Troubleshooting */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Troubleshooting</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Connection Test */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Wifi className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Connection Test</div>
                      <div className="text-xs text-gray-500 mt-0.5">Test VPN connection and detect issues</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs h-8 px-3 rounded-sm"
                  >
                    Run Test
                  </Button>
                </div>

                {/* Diagnostic Logs */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <HelpCircle className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Diagnostic Logs</div>
                      <div className="text-xs text-gray-500 mt-0.5">Export logs for troubleshooting</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-900 border-gray-200 hover:bg-gray-50 text-xs h-8 px-3 rounded-sm"
                  >
                    Export Logs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced">
          <div className="space-y-6">
            {/* Advanced Options */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <SettingsIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Advanced Options</h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Custom DNS */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Globe className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Custom DNS</div>
                      <div className="text-xs text-gray-500 mt-0.5">Configure custom DNS servers</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-900 border-gray-200 hover:bg-gray-50 text-xs h-8 px-3 rounded-sm"
                  >
                    Configure
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                {/* Split Tunneling */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Server className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">Split Tunneling</span>
                        <Badge
                          variant="outline"
                          className="ml-2 bg-amber-50 text-amber-700 border-0 text-[9px] px-1.5 py-0"
                        >
                          BETA
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Choose which apps use the VPN connection</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-900 border-gray-200 hover:bg-gray-50 text-xs h-8 px-3 rounded-sm"
                  >
                    Configure
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                {/* Port Forwarding */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <Server className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Port Forwarding</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Configure port forwarding for specific applications
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-900 border-gray-200 hover:bg-gray-50 text-xs h-8 px-3 rounded-sm"
                  >
                    Configure
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Reset Settings */}
            <div className="rounded-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <RefreshCw className="h-4 w-4 text-gray-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Reset Settings</h2>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center mr-3">
                      <RefreshCw className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Restore Default Settings</div>
                      <div className="text-xs text-gray-500 mt-0.5">Reset all settings to their default values</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResetDialog(true)}
                    className="text-red-600 border-gray-200 hover:bg-red-50 text-xs h-8 px-3 rounded-sm"
                  >
                    Reset All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <Button
          size="sm"
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs h-9 px-4 rounded-sm"
        >
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Changes
        </Button>
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
