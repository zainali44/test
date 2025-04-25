import { NextRequest, NextResponse } from "next/server"
import { removeAuthCookie, ApiResponse } from "@/app/utils/auth"

export async function POST(request: NextRequest) {
  try {
    // Remove the auth cookie
    removeAuthCookie()

    // Return success response
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