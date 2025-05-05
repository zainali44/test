"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw, Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useAuth } from "@/app/contexts/auth-context"
import Link from "next/link"

export default function TokenRenewalPage() {
  const { token, user, checkAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)
  const [tokenInfo, setTokenInfo] = useState<{
    valid: boolean
    timeRemaining?: string
    expiresAt?: string
  } | null>(null)
  
  // Get token expiration info on page load
  useEffect(() => {
    const checkToken = async () => {
      if (!token) return
      
      try {
        const res = await fetch('/api/auth-status', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        
        if (data.validation?.local_decode?.success) {
          const expInfo = data.validation.local_decode.expiration
          setTokenInfo({
            valid: !expInfo.expired,
            timeRemaining: expInfo.time_remaining,
            expiresAt: expInfo.expires_at
          })
        }
      } catch (error) {
        console.error('Error checking token:', error)
      }
    }
    
    checkToken()
  }, [token])
  
  const handleRefreshToken = async () => {
    if (loading || !token) return
    
    try {
      setLoading(true)
      setResult(null)
      
      const res = await fetch('/api/auth/refresh-token', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setResult({
          success: true,
          message: data.message || 'Token refreshed successfully',
          details: data
        })
        
        // Refresh auth context
        await checkAuth()
        
        // Update token info
        if (data.tokenInfo) {
          setTokenInfo({
            valid: true,
            timeRemaining: data.tokenInfo.timeRemaining,
            expiresAt: data.tokenInfo.expiresAt
          })
        }
      } else {
        setResult({
          success: false,
          message: data.message || 'Failed to refresh token',
          details: data
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Authentication Maintenance</h1>
      
      <Card className="p-4 sm:p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="mr-2 h-5 w-5 text-indigo-500" />
          <h2 className="text-lg sm:text-xl font-medium">Session Management</h2>
        </div>
        
        <div className="mb-6">
          <h3 className="text-base font-medium mb-2">Current Token Status</h3>
          {token ? (
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm">
                <span className="font-medium mr-2">Token:</span>
                <span className="bg-gray-100 py-1 px-2 rounded text-xs">
                  {token.substring(0, 12)}...{token.substring(token.length - 8)}
                </span>
              </div>
              
              {tokenInfo && (
                <>
                  <div className="flex items-center text-sm">
                    <span className="font-medium mr-2">Status:</span>
                    {tokenInfo.valid ? (
                      <span className="text-emerald-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" /> Valid
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <XCircle className="h-4 w-4 mr-1" /> Expired
                      </span>
                    )}
                  </div>
                  
                  {tokenInfo.timeRemaining && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Time Remaining:</span>
                      <span>{tokenInfo.timeRemaining}</span>
                    </div>
                  )}
                  
                  {tokenInfo.expiresAt && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Expires At:</span>
                      <span>{new Date(tokenInfo.expiresAt).toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}
              
              <div className="mt-4">
                <Button 
                  onClick={handleRefreshToken} 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Token
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Not authenticated</p>
                <p className="text-sm mt-1">Please log in to manage your session.</p>
                <Link href="/login" className="mt-2 inline-block text-sm text-amber-800 underline">
                  Go to login
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {result && (
          <div className={`mt-4 p-3 rounded-md ${
            result.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-start">
              {result.success ? (
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{result.success ? 'Success' : 'Error'}</p>
                <p className="text-sm mt-1">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer">View details</summary>
                    <pre className="mt-2 text-xs whitespace-pre-wrap bg-white/50 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600 mb-2">
          Having issues with your account?
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm">
            Return to Dashboard
          </Link>
          <Link href="/dashboard/profile" className="text-indigo-600 hover:text-indigo-700 text-sm">
            Go to Profile
          </Link>
        </div>
      </div>
    </div>
  )
} 