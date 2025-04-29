"use client"

import React from "react"
import Image from "next/image"
import { 
  CreditCard, 
  Shield, 
  ChevronRight, 
  Check,
  Landmark,
  Wallet,
} from "lucide-react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

// Define payment methods with logos
const paymentOptions = {
  banks: [
    { id: "hbl", name: "HBL", logo: "https://images.seeklogo.com/logo-png/24/1/hbl-logo-png_seeklogo-244802.png" },
    { id: "ubl", name: "UBL", logo: "https://ilcdnstatic.investorslounge.com//ResearchImages/FullImage//d87aea10-9e88-44b4-98dd-674d46d457db.png" },
    { id: "mcb", name: "MCB", logo: "https://mcb.com.pk/assets/images/mcb-logo.svg" },
    { id: "meezan", name: "Meezan", logo: "https://crystalpng.com/wp-content/uploads/2025/01/meezan-bank-logo.png" },
    { id: "alfalah", name: "Bank Alfalah", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Bank_Alfalah_logo.png" }
  ],
  cards: [
    { id: "visa", name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { id: "mastercard", name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { id: "amex", name: "Amex", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
    { id: "unionpay", name: "UnionPay", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg" }
  ],
  wallets: [
    { id: "jazzcash", name: "JazzCash", logo: "https://images.seeklogo.com/logo-png/34/2/jazz-cash-logo-png_seeklogo-343031.png" },
    { id: "easypaisa", name: "EasyPaisa", logo: "https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" },
    { id: "sadapay", name: "SadaPay", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY8R1ZxXuEEdZ0qQSMcCEUT0uiFZ4M7_yg3Q&s" },
    { id: "nayapay", name: "NayaPay", logo: "https://i.brecorder.com/primary/2024/10/2423423568511dc.jpg" }
  ]
};

export function PaymentMethodsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs h-8 px-3 rounded-sm text-gray-600 hover:bg-gray-100">
          <CreditCard className="h-3.5 w-3.5 mr-1.5" />
          Payment Methods
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[95vh] rounded-t-xl p-0 border-0 shadow-lg bg-white">
        {/* Handle */}
        <div className="w-10 h-1 mx-auto mt-3 mb-5 bg-gray-200 rounded-full" />
        
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-6">
            <SheetHeader className="text-left p-0 m-0">
              <SheetTitle className="text-xl font-semibold">Payment Methods</SheetTitle>
            </SheetHeader>
            
          </div>

          {/* Security Badge */}
          <div className="bg-blue-50 px-4 py-3 rounded-lg mb-5 flex items-center">
            <Shield className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              All payment methods are secure and encrypted
            </p>
          </div>

          {/* Payment Method Sections */}
          <div className="space-y-6">
            {/* Bank Transfers */}
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-md mr-2.5">
                  <Landmark className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium">Bank Transfers</h3>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {paymentOptions.banks.map(bank => (
                  <div key={bank.id} className="flex flex-col items-center">
                    <div className="h-14 w-full bg-white rounded-md border border-gray-200 p-2 flex items-center justify-center hover:border-blue-200 hover:shadow-sm transition-all">
                      <img 
                        src={bank.logo} 
                        alt={bank.name} 
                        className="max-h-10 max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1.5 truncate w-full text-center">{bank.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Credit Cards */}
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-md mr-2.5">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium">Credit & Debit Cards</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {paymentOptions.cards.map(card => (
                  <div key={card.id} className="flex flex-col items-center">
                    <div className="h-14 w-full bg-white rounded-md border border-gray-200 p-2 flex items-center justify-center hover:border-purple-200 hover:shadow-sm transition-all">
                      <img 
                        src={card.logo} 
                        alt={card.name} 
                        className="max-h-10 max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1.5 truncate w-full text-center">{card.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile Wallets */}
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-2 rounded-md mr-2.5">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-medium">Mobile Wallets</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {paymentOptions.wallets.map(wallet => (
                  <div key={wallet.id} className="flex flex-col items-center">
                    <div className="h-14 w-full bg-white rounded-md border border-gray-200 p-2 flex items-center justify-center hover:border-emerald-200 hover:shadow-sm transition-all">
                      <img 
                        src={wallet.logo} 
                        alt={wallet.name} 
                        className="max-h-10 max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1.5 truncate w-full text-center">{wallet.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <ul className="space-y-2.5">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 mr-2.5 flex-shrink-0" />
                <span className="text-xs text-gray-600">All prices are in Pakistani Rupees (PKR)</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 mr-2.5 flex-shrink-0" />
                <span className="text-xs text-gray-600">30-day money-back guarantee on all plans</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 mr-2.5 flex-shrink-0" />
                <span className="text-xs text-gray-600">All transactions secured with encryption</span>
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 