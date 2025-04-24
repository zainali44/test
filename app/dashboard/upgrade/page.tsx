"use client"

import { useState } from "react"
import {
    Check,
    Clock,
    CreditCard,
    Calendar,
    Package,
    Zap,
    Globe,
    Key,
    AlertTriangle,
    Database,
    Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function UpgradePage() {
    const [selectedPlan, setSelectedPlan] = useState<"2years" | "5years" | "3years">("5years")
    const [addMaxPlan, setAddMaxPlan] = useState(false)

    const plans = {
        "2years": {
            name: "2 Years Plan",
            discount: "84% OFF",
            originalPrice: "$358.00",
            price: "$57.95",
            expiry: "Oct 27, 2027",
            isPopular: false,
        },
        "5years": {
            name: "5 Years Plan",
            discount: "87% OFF",
            originalPrice: "$897.00",
            price: "$119.95",
            expiry: "Oct 27, 2030",
            isPopular: true,
        },
        "3years": {
            name: "3 Years Plan",
            discount: "86% OFF",
            originalPrice: "$538.00",
            price: "$76.95",
            expiry: "Oct 27, 2028",
            isPopular: false,
        },
    }

    const maxPlan = {
        name: "PureMax",
        discount: "85% OFF",
        originalPrice: "$1257.00",
        price: "$189.95",
        perMonth: "/ 5 years",
    }

    const addOns = [{ name: "Port Forwarding", price: "$0.99/Month", total: "$59.40" }]

    const calculateTotal = () => {
        const planPrice = Number.parseFloat(plans[selectedPlan].price.replace("$", ""))
        const addOnsTotal = addOns.reduce((acc, addon) => acc + Number.parseFloat(addon.total.replace("$", "")), 0)
        const maxPlanPrice = addMaxPlan ? Number.parseFloat(maxPlan.price.replace("$", "")) : 0
        return (planPrice + addOnsTotal + maxPlanPrice).toFixed(2)
    }

    return (
        <div className="max-w-[1000px] mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-medium text-gray-900">Upgrade Plan</h1>
                    <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="text-xs h-8 px-3 rounded-sm text-gray-600 hover:bg-gray-100">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            Billing History
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-8 px-3 rounded-sm text-gray-600 hover:bg-gray-100">
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                            Payment Methods
                        </Button>
                    </div>
                </div>
                <p className="text-gray-500 text-xs mt-1">Upgrade your plan to get more features and longer protection.</p>
            </div>

            {/* Current Plan Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Current Billing Cycle</div>
                    <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                        <span className="text-sm font-medium">12 Months</span>
                    </div>
                </div>

                <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Current Plan Type</div>
                    <div className="flex items-center">
                        <Package className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                        <span className="text-sm font-medium">Standard</span>
                    </div>
                </div>

                <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Connected Add-ons</div>
                    <div className="flex items-center">
                        <Zap className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                        <span className="text-sm font-medium">Port Forwarding, CREST VPN</span>
                    </div>
                </div>
            </div>

            {/* Upgrade Offer */}
            <div className="mb-10">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-center py-2 px-4 rounded-t-lg text-sm font-medium">
                    The Great Upgrade Offer!
                </div>
                <div className="bg-white border-x border-b border-gray-200 rounded-b-sm p-6 text-center shadow-sm">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Grab 5 years of CREST VPN at 86% OFF</h2>
                    <p className="text-gray-600 text-sm">**That means you just pay 14% and the rest is our treat**</p>
                </div>
            </div>

            {/* Plan Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* 2 Years Plan */}
                <div
                    className={`border rounded-sm shadow-sm overflow-hidden transition-all duration-200 ${selectedPlan === "2years"
                        ? "border-emerald-500 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:border-emerald-200"
                        }`}
                >
                    <div className="bg-white p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-2">84% OFF</Badge>
                                <h3 className="text-lg font-medium text-gray-900">2 Years Plan</h3>
                            </div>
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPlan === "2years" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                    }`}
                                onClick={() => setSelectedPlan("2years")}
                            >
                                {selectedPlan === "2years" && <Check className="h-3 w-3 text-white" />}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-gray-500 line-through text-sm">{plans["2years"].originalPrice}</div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">{plans["2years"].price}</span>
                                <span className="text-gray-500 ml-1 text-sm">($2.42/mo)</span>
                            </div>
                        </div>

                        <Button
                            className={`w-full ${selectedPlan === "2years"
                                ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-lg"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            onClick={() => setSelectedPlan("2years")}
                        >
                            {selectedPlan === "2years" ? "Selected" : "Upgrade to 2 Years Plan"}
                        </Button>

                        <div className="text-xs text-gray-500 mt-3 text-center">
                            After upgrade your plan will expire on {plans["2years"].expiry}
                        </div>
                    </div>
                </div>

                {/* 5 Years Plan */}
                <div
                    className={`border rounded-md shadow-sm overflow-hidden transition-all duration-200 ${selectedPlan === "5years"
                        ? "border-emerald-500 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:border-emerald-200"
                        }`}
                >
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white text-center py-1 text-xs font-medium">
                        MOST POPULAR
                    </div>
                    <div className="bg-white p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-2">87% OFF</Badge>
                                <h3 className="text-lg font-medium text-gray-900">5 Years Plan</h3>
                            </div>
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPlan === "5years" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                    }`}
                                onClick={() => setSelectedPlan("5years")}
                            >
                                {selectedPlan === "5years" && <Check className="h-3 w-3 text-white" />}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-gray-500 line-through text-sm">{plans["5years"].originalPrice}</div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">{plans["5years"].price}</span>
                                <span className="text-gray-500 ml-1 text-sm">($1.99/mo)</span>
                            </div>
                        </div>

                        <Button
                            className={`w-full ${selectedPlan === "5years"
                                ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            onClick={() => setSelectedPlan("5years")}
                        >
                            {selectedPlan === "5years" ? "Selected" : "Upgrade to 5 Years Plan"}
                        </Button>

                        <div className="text-xs text-gray-500 mt-3 text-center">
                            After upgrade your plan will expire on {plans["5years"].expiry}
                        </div>
                    </div>
                </div>

                {/* 3 Years Plan */}
                <div
                    className={`border rounded-sm shadow-sm overflow-hidden transition-all duration-200 ${selectedPlan === "3years"
                        ? "border-emerald-500 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:border-emerald-200"
                        }`}
                >
                    <div className="bg-white p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-2">86% OFF</Badge>
                                <h3 className="text-lg font-medium text-gray-900">3 Years Plan</h3>
                            </div>
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPlan === "3years" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                    }`}
                                onClick={() => setSelectedPlan("3years")}
                            >
                                {selectedPlan === "3years" && <Check className="h-3 w-3 text-white" />}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-gray-500 line-through text-sm">{plans["3years"].originalPrice}</div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">{plans["3years"].price}</span>
                                <span className="text-gray-500 ml-1 text-sm">($2.14/mo)</span>
                            </div>
                        </div>

                        <Button
                            className={`w-full ${selectedPlan === "3years"
                                ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            onClick={() => setSelectedPlan("3years")}
                        >
                            {selectedPlan === "3years" ? "Selected" : "Upgrade to 3 Years Plan"}
                        </Button>

                        <div className="text-xs text-gray-500 mt-3 text-center">
                            After upgrade your plan will expire on {plans["3years"].expiry}
                        </div>
                    </div>
                </div>
            </div>

            {/* Max Plan */}
            <div className="mb-12">
                <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">
                    Super charge your internet freedom with Max Plan
                </h2>

                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">PureMax</h3>
                                    <Badge className="bg-emerald-100 text-emerald-800 border-0">85% OFF</Badge>
                                </div>
                                <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${addMaxPlan ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                        }`}
                                    onClick={() => setAddMaxPlan(!addMaxPlan)}
                                >
                                    {addMaxPlan && <Check className="h-3 w-3 text-white" />}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-gray-500 line-through text-sm">{maxPlan.originalPrice}</div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-gray-900">{maxPlan.price}</span>
                                    <span className="text-gray-500 ml-1 text-sm">{maxPlan.perMonth}</span>
                                </div>
                            </div>

                            <Button
                                className={`${addMaxPlan
                                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                    }`}
                                onClick={() => setAddMaxPlan(!addMaxPlan)}
                            >
                                {addMaxPlan ? "Added" : "Add"}
                            </Button>
                        </div>

                        <div className="p-6 bg-white">
                            <ul className="space-y-4">
                                <li className="flex">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <Globe className="h-3 w-3 text-purple-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Full featured VPN:</p>
                                        <p className="text-xs text-gray-600">
                                            Bring internet freedom at your fingertips. Encrypt your internet connection, access everything
                                        </p>
                                    </div>
                                </li>

                                <li className="flex">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <Database className="h-3 w-3 text-purple-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Remove my Data:</p>
                                        <p className="text-xs text-gray-600">
                                            Get your personal information removed from data brokers across the globe.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <AlertTriangle className="h-3 w-3 text-purple-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Dark Web Monitoring:</p>
                                        <p className="text-xs text-gray-600">
                                            Receive instant alerts if your personal data is compromised on the Dark Web.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <Key className="h-3 w-3 text-purple-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Password Manager:</p>
                                        <p className="text-xs text-gray-600">
                                            Safely store, manage, access and autofill passwords from anywhere.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h2 className="text-xl font-medium text-gray-900 mb-4">Order Confirmation</h2>

                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Upgrade to {plans[selectedPlan].name} At {plans[selectedPlan].discount}
                                        </p>
                                        <p className="text-xs text-gray-500">This plan will expire on: {plans[selectedPlan].expiry}</p>
                                    </div>
                                    <span className="text-sm font-medium">{plans[selectedPlan].price}</span>
                                </div>

                                {addOns.map((addon, index) => (
                                    <div key={index} className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {addon.name}: {addon.price}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium">{addon.total}</span>
                                    </div>
                                ))}

                                {addMaxPlan && (
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">PureMax: Premium Security Suite</p>
                                        </div>
                                        <span className="text-sm font-medium">{maxPlan.price}</span>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between items-center">
                                <span className="text-base font-medium text-gray-900">Total:</span>
                                <span className="text-xl font-bold text-gray-900">${calculateTotal()}</span>
                            </div>

                            <Button
                                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                                size="lg"
                            >
                                Upgrade to {plans[selectedPlan].name}
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-medium text-gray-900 mb-4">CREST VPN plan includes:</h2>

                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                        <div className="p-4">
                            <ul className="space-y-3">
                                <li className="flex items-center py-2 border-b border-gray-100">
                                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                                    <span className="text-sm text-gray-700">All future updates and releases</span>
                                </li>
                                <li className="flex items-center py-2 border-b border-gray-100">
                                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                                    <span className="text-sm text-gray-700">All premium features & apps</span>
                                </li>
                                <li className="flex items-center py-2 border-b border-gray-100">
                                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                                    <span className="text-sm text-gray-700">Access to 6500+ VPN servers</span>
                                </li>
                                <li className="flex items-center py-2 border-b border-gray-100">
                                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                                    <span className="text-sm text-gray-700">Login up to 10 devices at a time</span>
                                </li>
                                <li className="flex items-center py-2 border-b border-gray-100">
                                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                                    <span className="text-sm text-gray-700">24/7 customer support</span>
                                </li>
                                <li className="flex items-center py-2">
                                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                                    <span className="text-sm text-gray-700">31-day money-back guarantee</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-sm p-4">
                        <div className="flex">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                                <Info className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-amber-800 mb-1">Satisfaction Guaranteed</p>
                                <p className="text-xs text-amber-700">
                                    Try our service risk-free. If you're not 100% satisfied, simply request a refund within 31 days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
