"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Search,
  ChevronDown,
  Clock,
  Info,
  Download,
  Globe,
  Shield,
  Server,
  ChevronRight,
  Filter,
  Users,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ManualConfigurationPage() {
  // Simple state management
  const [activeTab, setActiveTab] = useState("servers")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [expandedCountries, setExpandedCountries] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Toggle country expansion
  const toggleCountry = (countryName: string) => {
    if (expandedCountries.includes(countryName)) {
      setExpandedCountries(expandedCountries.filter((name) => name !== countryName))
    } else {
      setExpandedCountries([...expandedCountries, countryName])
    }
  }

  const filters = ["All", "QR", "P2P", "OBF", "PF"]

  const countries = [
    {
      name: "United States",
      code: "us",
      locations: 13,
      protocols: ["OpenVPN", "WireGuard", "IKEv2"],
      ping: 45,
      servers: [
        { id: 1, name: "New York", ping: 45, load: 32 },
        { id: 2, name: "Los Angeles", ping: 78, load: 45 },
        { id: 3, name: "Chicago", ping: 52, load: 28 },
      ],
    },
    {
      name: "United Kingdom",
      code: "gb",
      locations: 2,
      protocols: ["OpenVPN", "WireGuard"],
      ping: 72,
      servers: [
        { id: 1, name: "London", ping: 72, load: 56 },
        { id: 2, name: "Manchester", ping: 85, load: 41 },
      ],
    },
    {
      name: "Australia",
      code: "au",
      locations: 2,
      protocols: ["OpenVPN", "WireGuard"],
      ping: 120,
      servers: [
        { id: 1, name: "Sydney", ping: 120, load: 38 },
        { id: 2, name: "Melbourne", ping: 135, load: 42 },
      ],
    },
    {
      name: "Germany",
      code: "de",
      locations: 1,
      protocols: ["OpenVPN"],
      ping: 65,
      servers: [{ id: 1, name: "Frankfurt", ping: 65, load: 47 }],
    },
  ]

  // Filter countries based on search query
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-base font-medium text-gray-900">Manual Configuration</h1>
            <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-600 border-0 text-[9px] px-1.5 py-0">
              Advanced
            </Badge>
          </div>
          <p className="mt-1 text-gray-500 text-xs">
            Set up VPN manually on your operating system by downloading these configuration files.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs h-8 px-3 rounded-sm"
        >
          <Download className="mr-1.5 h-3 w-3" />
          Download App
        </Button>
      </div>

      {/* Simple Tabs */}
      <div className="mb-6">
        <div className="inline-flex h-8 items-center justify-center rounded-sm bg-gray-50 p-0.5">
          <button
            onClick={() => setActiveTab("servers")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "servers" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Servers
          </button>
          <button
            onClick={() => setActiveTab("protocols")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "protocols" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Protocols
          </button>
          <button
            onClick={() => setActiveTab("wireguard")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "wireguard" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            WireGuard
          </button>
        </div>
      </div>

      {/* Servers Tab Content */}
      {activeTab === "servers" && (
        <div className="mt-4">
          {/* Notification */}
          <div className="bg-gray-50 border border-gray-100 rounded-sm p-3 mb-6">
            <div className="flex items-start">
              <div className="bg-amber-50 rounded-sm p-1 mr-3">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-xs font-medium text-gray-900">Extend WireGuard Configuration Time</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <Info className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="text-[10px] p-2 max-w-[200px]">
                        <p>
                          WireGuard configurations expire after a certain period for security reasons. Extend your time
                          to complete setup.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  Need more time? Get up to 24 hours for uninterrupted VPN setup with this add-on.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-gray-900 hover:bg-gray-100">
                Learn More
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by Location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-white border-gray-200 focus:border-emerald-500 rounded-sm"
                />
              </div>
            </div>

            <div>
              <select className="h-8 w-full text-xs bg-white border-gray-200 rounded-sm px-3 focus:border-emerald-500 focus:outline-none">
                <option value="popularity">Sort By: Popularity</option>
                <option value="name-asc">Sort By: Name (A-Z)</option>
                <option value="name-desc">Sort By: Name (Z-A)</option>
                <option value="locations">Sort By: Locations</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex items-center bg-gray-50 rounded-sm p-1 h-7">
                <Filter className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                <span className="text-[10px] text-gray-500">Filter:</span>
              </div>
              <div className="flex flex-wrap gap-1 ml-2">
                {filters.map((filter) => (
                  <Badge
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    className={`cursor-pointer text-[9px] px-1.5 py-0 h-5 ${
                      selectedFilter === filter
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-gray-500">
              {filteredCountries.length} {filteredCountries.length === 1 ? "country" : "countries"} found
            </div>
          </div>

          {/* Countries List */}
          <div className="border border-gray-200">
            {filteredCountries.map((country, index) => (
              <div key={country.code}>
                <div className="relative">
                  <div
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCountry(country.name)}
                  >
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-sm overflow-hidden mr-3 border border-gray-100">
                        <Image
                          src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                          alt={country.name}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-900">{country.name}</h3>
                        <div className="flex items-center text-[10px] text-gray-500 mt-0.5">
                          <span>
                            {country.locations} {country.locations === 1 ? "Location" : "Locations"}
                          </span>
                          <span className="mx-1.5">•</span>
                          <div className="flex items-center">
                            {country.protocols.map((protocol, i) => (
                              <Badge
                                key={protocol}
                                variant="outline"
                                className="text-[8px] h-3.5 px-1 mr-1 bg-gray-50 border-gray-100 text-gray-600"
                              >
                                {protocol}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
                        <span className="text-[10px] text-gray-600">{country.ping}ms</span>
                      </div>
                      <button
                        className={`flex items-center justify-center h-6 w-6 rounded-sm transition-colors ${
                          expandedCountries.includes(country.name)
                            ? "bg-gray-100 text-gray-700"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            expandedCountries.includes(country.name) ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Country Content */}
                  {expandedCountries.includes(country.name) && (
                    <div className="px-3 pb-3">
                      <div className="mt-1 space-y-1">
                        {country.servers.map((server) => (
                          <div
                            key={server.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-sm bg-gray-100 flex items-center justify-center mr-2">
                                <Server className="h-3 w-3 text-gray-600" />
                              </div>
                              <div>
                                <span className="text-[10px] font-medium text-gray-900">{server.name}</span>
                                <div className="flex items-center text-[9px] text-gray-500 mt-0.5">
                                  <span className="flex items-center">
                                    <span className="h-1 w-1 rounded-full bg-green-500 mr-1"></span>
                                    {server.ping}ms
                                  </span>
                                  <span className="mx-1.5">•</span>
                                  <span>Load: {server.load}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-[9px] h-6 px-2 text-gray-900 hover:bg-gray-200 rounded-sm"
                              >
                                <Globe className="h-3 w-3 mr-1" />
                                OpenVPN
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-[9px] h-6 px-2 text-gray-900 hover:bg-gray-200 rounded-sm"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                WireGuard
                              </Button>
                              <Button
                                size="sm"
                                className="text-[9px] h-6 px-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-sm"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {index < filteredCountries.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCountries.length === 0 && (
            <div className="border border-gray-200 p-6 text-center">
              <div className="flex justify-center mb-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No results found</h3>
              <p className="text-xs text-gray-500">
                We couldn't find any locations matching your search. Try different keywords.
              </p>
            </div>
          )}

          {/* Teams Upgrade */}
          <div className="mt-8 border border-gray-200 rounded-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-sm bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xs font-medium text-gray-900">Need VPN for your team?</h2>
                  <p className="text-[10px] text-gray-600 mt-0.5 max-w-md">
                    Enhance network security and allow your team to access online resources efficiently with dedicated
                    business VPN.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[10px] h-7 px-2.5 rounded-sm"
              >
                Upgrade to Teams
                <ArrowUpRight className="h-3 w-3 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Protocols Tab Content */}
      {activeTab === "protocols" && (
        <div className="mt-4">
          <div className="border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* OpenVPN */}
              <div className="border border-gray-100 rounded-sm p-3">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 rounded-sm bg-gray-50 flex items-center justify-center mr-2">
                    <Globe className="h-3.5 w-3.5 text-gray-700" />
                  </div>
                  <h3 className="text-xs font-medium">OpenVPN</h3>
                </div>
                <p className="text-[10px] text-gray-600 mb-3">
                  Industry standard protocol with excellent security and compatibility across platforms.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-0 text-[9px] px-1.5 py-0">
                    Recommended
                  </Badge>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-[9px] h-6 px-2 rounded-sm"
                  >
                    <Download className="h-2.5 w-2.5 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              {/* WireGuard */}
              <div className="border border-gray-100 rounded-sm p-3">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 rounded-sm bg-gray-50 flex items-center justify-center mr-2">
                    <Shield className="h-3.5 w-3.5 text-gray-700" />
                  </div>
                  <h3 className="text-xs font-medium">WireGuard</h3>
                </div>
                <p className="text-[10px] text-gray-600 mb-3">
                  Modern protocol with improved performance and reduced battery consumption.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-0 text-[9px] px-1.5 py-0">
                    Fastest
                  </Badge>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-[9px] h-6 px-2 rounded-sm"
                  >
                    <Download className="h-2.5 w-2.5 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              {/* IKEv2 */}
              <div className="border border-gray-100 rounded-sm p-3">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 rounded-sm bg-gray-50 flex items-center justify-center mr-2">
                    <Server className="h-3.5 w-3.5 text-gray-700" />
                  </div>
                  <h3 className="text-xs font-medium">IKEv2</h3>
                </div>
                <p className="text-[10px] text-gray-600 mb-3">
                  Excellent for mobile devices with ability to reconnect when changing networks.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-0 text-[9px] px-1.5 py-0">
                    Mobile-friendly
                  </Badge>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-[9px] h-6 px-2 rounded-sm"
                  >
                    <Download className="h-2.5 w-2.5 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WireGuard Tab Content */}
      {activeTab === "wireguard" && (
        <div className="mt-4">
          <div className="border border-gray-200 p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-900">WireGuard Configuration</h3>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  Generate and download WireGuard configuration files for your devices.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-sm mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 text-amber-500 mr-2" />
                  <span className="text-[10px] font-medium">
                    Configuration expires in: <span className="text-amber-600">23:45:12</span>
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-[9px] h-6 px-2 rounded-sm"
                >
                  Extend Time
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-sm p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-gray-500">QR Code</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-0 text-[9px] px-1.5 py-0">
                    Mobile
                  </Badge>
                </div>
                <div className="bg-white border border-gray-100 p-4 flex justify-center">
                  <Image
                    src="/abstract-qr-code.png"
                    alt="WireGuard QR Code"
                    width={150}
                    height={150}
                    className="h-[150px] w-[150px]"
                  />
                </div>
                <p className="text-[10px] text-gray-600 mt-3 text-center">
                  Scan with your mobile device's WireGuard app
                </p>
              </div>

              <div className="border border-gray-100 rounded-sm p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-gray-500">Configuration File</h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-0 text-[9px] px-1.5 py-0">
                    Desktop
                  </Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-sm mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-sm bg-gray-100 flex items-center justify-center mr-2">
                        <Server className="h-3 w-3 text-gray-600" />
                      </div>
                      <div>
                        <span className="text-[10px] font-medium text-gray-900">wireguard-config.conf</span>
                        <div className="text-[9px] text-gray-500">2.4 KB</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-[9px] h-6 px-2 rounded-sm"
                    >
                      <Download className="h-2.5 w-2.5 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600">Import this file into your WireGuard desktop application</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
