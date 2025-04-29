"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, Star, Check, Lock, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface UpgradeDialogProps {
  open: boolean
  onClose: () => void
  feature: string
}

export function UpgradeDialog({ open, onClose, feature }: UpgradeDialogProps) {
  const router = useRouter()
  
  const handleUpgrade = () => {
    router.push('/dashboard/upgrade')
    onClose()
  }
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl border-0 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">Upgrade Required</DialogTitle>
          <DialogDescription className="text-center text-base">
            The <span className="font-medium text-amber-600">{feature}</span> is available for paid plans only
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-5">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl">
            <h3 className="font-medium text-amber-900 flex items-center mb-3">
              <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
              Premium Plan Benefits
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-amber-700" />
                </div>
                <span className="text-sm text-amber-800">Download apps for all platforms</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-amber-700" />
                </div>
                <span className="text-sm text-amber-800">Up to 5 simultaneous device connections</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-amber-700" />
                </div>
                <span className="text-sm text-amber-800">Premium servers with faster speeds</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-amber-700" />
                </div>
                <span className="text-sm text-amber-800">Advanced security features</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 sm:gap-2 mt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-lg border-gray-200 hover:bg-gray-50"
          >
            Maybe Later
          </Button>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg"
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