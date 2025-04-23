"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"


export default function IpStatusBanner() {
  const [ipData, setIpData] = useState({
    ip: "",
    isp: "",
    status: "",
  })

//   In a real implementation, you would fetch the actual IP data
  useEffect(() => {
    const fetchIpData = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ispResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
        const ispData = await ispResponse.json();
        setIpData({
          ip: data.ip,
          isp: ispData.org || "Unknown ISP",
          status: "Unprotected"
        });
      } catch (error) {
        console.error('Error fetching IP data:', error);
      }
    };
    fetchIpData();
  }, []);

  return (
    <div className="bg-gray-900 text-white py-2 px-4 text-center text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center">
          <span className="font-medium mr-1">Your IP:</span>
          <span>{ipData.ip}</span>
        </div>

        <div className="hidden sm:flex items-center">
          <span className="mx-1">·</span>
        </div>

        <div className="flex items-center">
          <span className="font-medium mr-1">Your ISP:</span>
          <span>{ipData.isp}</span>
        </div>

        <div className="hidden sm:flex items-center">
          <span className="mx-1">·</span>
        </div>

        <div className="flex items-center">
          <span className="font-medium mr-1">Your Status:</span>
          <span className="text-red-500 flex items-center">
            {ipData.status}
            <AlertTriangle className="h-3 w-3 ml-1" />
          </span>
        </div>
      </div>
    </div>
  )
}
