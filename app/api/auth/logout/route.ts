import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/app/utils/auth"
import { cookies } from "next/headers"

// Server-side function to remove auth cookie
function removeAuthCookie(): void {
  cookies().delete("auth-token")
}

export async function POST(request: NextRequest) {
  try {
    // Remove auth cookie
    removeAuthCookie()
    
    return NextResponse.json(
      { 
        status: "success", 
        message: "Logged out successfully" 
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { 
        status: "error", 
        message: "Internal server error" 
      } as ApiResponse,
      { status: 500 }
    )
  }
} 