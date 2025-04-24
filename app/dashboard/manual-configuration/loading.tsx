import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading configuration options...</p>
      </div>
    </div>
  )
}
