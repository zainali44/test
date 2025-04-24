"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, Edit2, ExternalLink, Lock, Mail, Shield, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerifyEmail = () => {
    // Simulate verification
    setEmailVerified(true)
  }

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and security settings</p>
        </div>

        {!emailVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-4">
            <div className="bg-amber-100 rounded-full p-2 mt-0.5">
              <Mail className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">Please confirm your email to secure your account</h3>
              <p className="text-amber-700 text-sm mt-1">We sent a 6-digit verification code to john.doe@example.com</p>

              <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex gap-2">
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      className="w-10 h-10 text-center p-0 text-lg font-medium border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ))}
                </div>
                <Button
                  onClick={handleVerifyEmail}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                >
                  Verify email
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-600/10 to-teal-500/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Premium User
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Profile Photo</h3>
                <p className="text-xs text-gray-400 mt-1">This will be displayed on your account</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src="/diverse-group-city.png"
                      alt="Profile"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-200">
                    <div className="bg-emerald-500 rounded-full p-1">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-gray-600">
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Username */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="text-xs text-gray-400 mt-1">Your unique identifier on our platform</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">securevpn.com/johndoe</span>
                {isEditing === "username" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue="johndoe"
                      className="w-40 h-8 text-sm border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(null)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing("username")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Full Name */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="text-xs text-gray-400 mt-1">Your name as it appears on billing documents</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">John Doe</span>
                {isEditing === "name" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue="John Doe"
                      className="w-40 h-8 text-sm border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(null)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing("name")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Email */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="text-xs text-gray-400 mt-1">Your primary contact email</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">john.doe@example.com</span>
                  <Badge
                    variant="outline"
                    className={
                      emailVerified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  >
                    {emailVerified ? (
                      <>
                        <Check className="h-3 w-3 mr-1" /> Verified
                      </>
                    ) : (
                      "Pending"
                    )}
                  </Badge>
                  {isEditing === "email" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        defaultValue="john.doe@example.com"
                        className="w-48 h-8 text-sm border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(null)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsEditing(null)}
                        className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing("email")}
                      className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-500">backup.email@example.com</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                    Backup
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Billing Address */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Billing Address</h3>
                <p className="text-xs text-gray-400 mt-1">Address used for billing and receipts</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-gray-900 font-medium">123 Privacy Street</p>
                  <p className="text-gray-500">Secure City, SC 12345</p>
                  <p className="text-gray-500">United States</p>
                </div>
                {isEditing === "address" ? (
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(null)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing("address")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-600/10 to-teal-500/10">
            <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Password */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Password</h3>
                <p className="text-xs text-gray-400 mt-1">Secure your account with a strong password</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">Password Strength</span>
                    <span className="text-xs font-medium text-emerald-600">Strong</span>
                  </div>
                  <Progress value={85} className="h-1.5 w-full bg-gray-100" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                >
                  <Lock className="h-3.5 w-3.5 mr-1.5" />
                  Change Password
                </Button>
              </div>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-400 mt-1">Add an extra layer of security to your account</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Check className="h-3 w-3 mr-1" /> Enabled
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                >
                  Manage 2FA
                </Button>
              </div>
            </div>

            <Separator />

            {/* Active Sessions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
                <p className="text-xs text-gray-400 mt-1">Devices currently logged into your account</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">3 active devices</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                >
                  Manage Sessions
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-600/10 to-teal-500/10">
            <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Current Plan</h3>
                <p className="text-lg font-semibold text-emerald-700">Premium 5-Year</p>
                <Badge className="mt-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">87% Savings</Badge>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Next Billing Date</h3>
                <p className="text-lg font-semibold text-gray-900">October 27, 2030</p>
                <p className="text-xs text-gray-500 mt-2">Auto-renewal enabled</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1 rounded border border-gray-200">
                    <svg className="h-5 w-8" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="2" fill="#EEF2FF" />
                      <path d="M21.5 12.5H19.5V5.5H21.5V12.5Z" fill="#4F46E5" />
                      <path
                        d="M19 9C19 7.5 19.75 6.25 21 5.5C20.25 5 19.25 4.5 18 4.5C15.5 4.5 14 6 14 8C14 10 15.5 11.5 18 11.5C19.25 11.5 20.25 11 21 10.5C19.75 10 19 8.5 19 9Z"
                        fill="#4F46E5"
                      />
                      <path d="M25 12.5H23V5.5H25L25 12.5Z" fill="#4F46E5" />
                      <path d="M12 5.5L9.5 12.5H7.5L5 5.5H7L8.5 10.5L10 5.5H12Z" fill="#4F46E5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/25</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300"
              >
                Manage Payment Methods
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-600/10 to-teal-500/10">
            <h2 className="text-xl font-semibold text-gray-900">Privacy Preferences</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data Collection</h3>
                <p className="text-xs text-gray-400 mt-1">Control how we collect and use your data</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Shield className="h-3 w-3 mr-1" /> Minimal Collection
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                >
                  Manage Settings
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Marketing Preferences</h3>
                <p className="text-xs text-gray-400 mt-1">Control which communications you receive</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  Security Updates Only
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                >
                  Manage Settings
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Data</h3>
                <p className="text-xs text-gray-400 mt-1">Download or delete your account data</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                >
                  Download Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
