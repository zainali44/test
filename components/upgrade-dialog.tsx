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
      <DialogContent className="sm:max-w-md bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border-0 shadow-xl max-h-[90vh] overflow-y-auto w-[calc(100%-32px)] sm:w-auto">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center">
            <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold">Upgrade Required</DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            The <span className="font-medium text-amber-600">{feature}</span> is available for paid plans only
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-5 py-3 sm:py-5">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-5 rounded-lg sm:rounded-xl">
            <h3 className="font-medium text-sm sm:text-base text-amber-900 flex items-center mb-2 sm:mb-3">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 mr-1.5 sm:mr-2" />
              Premium Plan Benefits
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start">
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-amber-200 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm text-amber-800">Download apps for all platforms</span>
              </li>
              <li className="flex items-start">
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-amber-200 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm text-amber-800">Up to 5 simultaneous device connections</span>
              </li>
              <li className="flex items-start">
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-amber-200 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm text-amber-800">Premium servers with faster speeds</span>
              </li>
              <li className="flex items-start">
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-amber-200 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm text-amber-800">Advanced security features</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-2 sm:gap-3 mt-1 sm:mt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-lg border-gray-200 hover:bg-gray-50 text-xs sm:text-sm h-9 sm:h-10"
          >
            Maybe Later
          </Button>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg text-xs sm:text-sm h-9 sm:h-10"
            onClick={handleUpgrade}
          >
            <Shield className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 