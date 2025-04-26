"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, Edit2, ExternalLink, Lock, Mail, Shield, Upload, X, User, UserCircle, Zap, Settings, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [showConfetti, setShowConfetti] = useState(false)

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
    setShowConfetti(true)
    
    // Hide confetti after animation
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-6 pb-20">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Simple CSS confetti effect would go here */}
        </div>
      )}
      
      <div className="flex flex-col space-y-8">
        <div className="relative">
          {/* Background header decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-emerald-600/5 rounded-xl h-32 -z-10 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/10 rounded-full blur-xl"></div>
            <div className="absolute left-20 top-10 w-20 h-20 bg-emerald-600/10 rounded-full blur-lg"></div>
          </div>
          
          <div className="pt-6 pb-12 px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 p-1">
                    <div className="h-full w-full rounded-full overflow-hidden bg-white">
                      <Image
                        src="/diverse-group-city.png"
                        alt="Profile"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                    <div className="bg-emerald-500 rounded-full p-1.5">
                      <Shield className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-500">@johndoe</p>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Premium
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient shadow-md self-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </div>
        </div>

        {!emailVerified && (
          <div className="card-shadow bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="p-6 border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-amber-50/50">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 rounded-full p-2.5 mt-0.5">
                  <Mail className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-amber-800 text-lg">Verify your email address</h3>
                  <p className="text-amber-700 mt-1">For account security, please confirm your email address with the 6-digit verification code we sent to john.doe@example.com</p>

                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                          className="w-10 h-12 text-center p-0 text-lg font-medium border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                        />
                      ))}
                    </div>
                    <Button
                      onClick={handleVerifyEmail}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white btn-gradient shadow-sm"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Verify Email
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-amber-700 text-sm">
                    <button className="text-amber-800 hover:text-amber-900 underline underline-offset-2 font-medium">
                      Resend code
                    </button>
                    {" or "}
                    <button className="text-amber-800 hover:text-amber-900 underline underline-offset-2 font-medium">
                      Change email address
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm card-shadow overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-emerald-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle className="h-6 w-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm">
                <Zap className="h-3 w-3 mr-1" /> Premium User
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Profile Photo</h3>
                <p className="text-xs text-gray-400 mt-1">This will be displayed on your account</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-0.5">
                    <Image
                      src="/diverse-group-city.png"
                      alt="Profile"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-200 shadow-sm">
                    <div className="bg-emerald-500 rounded-full p-1">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-gray-600 hover:text-red-600 hover:border-red-200 focus-ring">
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Username */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Username</h3>
                <p className="text-xs text-gray-400 mt-1">Your unique identifier on our platform</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">securevpn.com/johndoe</span>
                {isEditing === "username" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue="johndoe"
                      className="w-40 h-8 text-sm border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(null)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 focus-ring"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing("username")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus-ring"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Full Name */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Full Name</h3>
                <p className="text-xs text-gray-400 mt-1">Your name as it appears on billing documents</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">John Doe</span>
                {isEditing === "name" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue="John Doe"
                      className="w-40 h-8 text-sm border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(null)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 focus-ring"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing("name")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus-ring"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Email */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Email Address</h3>
                <p className="text-xs text-gray-400 mt-1">Your primary contact email</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">john.doe@example.com</span>
                  <Badge
                    variant="outline"
                    className={
                      emailVerified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                        : "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
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
                        className="w-48 h-8 text-sm border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(null)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 focus-ring"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsEditing(null)}
                        className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing("email")}
                      className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus-ring"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-500">backup.email@example.com</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 shadow-sm">
                    Backup
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Billing Address */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Billing Address</h3>
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
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 focus-ring"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="h-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing("address")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus-ring"
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm card-shadow overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-emerald-500/5">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Current Plan</h3>
                <p className="text-xl font-semibold text-emerald-700">Premium 5-Year</p>
                <div className="mt-2 flex items-center">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 shadow-sm">
                    <Zap className="h-3 w-3 mr-1" /> 87% Savings
                  </Badge>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Next Billing Date</h3>
                <p className="text-xl font-semibold text-gray-900">October 27, 2030</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                    Auto-renewal enabled
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Payment Method</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-white p-1.5 rounded-md border border-gray-200 shadow-sm">
                    <svg className="h-6 w-9" viewBox="0 0 32 20" fill="none">
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
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 focus-ring shadow-sm"
              >
                Manage Payment Methods
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white btn-gradient shadow-sm">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm card-shadow overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-emerald-500/5">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy Preferences</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Data Collection</h3>
                <p className="text-xs text-gray-400 mt-1">Control how we collect and use your data</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm">
                  <Shield className="h-3 w-3 mr-1" /> Minimal Collection
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 focus-ring shadow-sm"
                >
                  Manage Settings
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Marketing Preferences</h3>
                <p className="text-xs text-gray-400 mt-1">Control which communications you receive</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 shadow-sm">
                  Security Updates Only
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 focus-ring shadow-sm"
                >
                  Manage Settings
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Account Data</h3>
                <p className="text-xs text-gray-400 mt-1">Download or delete your account data</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 focus-ring shadow-sm"
                >
                  Download Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300 focus-ring shadow-sm"
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
