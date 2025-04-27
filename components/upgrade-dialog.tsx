"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, Star, Check, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

interface UpgradeDialogProps {
  isOpen: boolean
  onClose: () => void
  downloadType: string
}

export function UpgradeDialog({ isOpen, onClose, downloadType }: UpgradeDialogProps) {
  const router = useRouter()
  
  const handleUpgrade = () => {
    router.push('/dashboard/upgrade')
    onClose()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">Upgrade Required</DialogTitle>
          <DialogDescription className="text-center">
            {downloadType ? `${downloadType} download` : 'This feature'} is available for paid plans only
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
            <h3 className="font-medium text-amber-900 flex items-center mb-2">
              <Star className="h-4 w-4 text-amber-500 mr-2" />
              Premium Plan Benefits
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-800">Download apps for all platforms</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-800">Up to 5 simultaneous device connections</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-800">Premium servers with faster speeds</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-800">Advanced security features</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            onClick={handleUpgrade}
          >
            <Shield className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 