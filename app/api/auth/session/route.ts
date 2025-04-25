import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, ApiResponse } from "@/app/utils/auth"

export async function GET(request: NextRequest) {
  try {
    // Get current user from auth cookie
    const user = getCurrentUser()

    // If no active session
    if (!user) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "No active session", 
          data: { authenticated: false } 
        } as ApiResponse,
        { status: 401 }
      )
    }

    // Return user data without sensitive information
    return NextResponse.json(
      { 
        status: "success", 
        data: { 
          authenticated: true,
          user: {
            id: user.id,
            email: user.email
          }
        } 
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(
      { 
        status: "error", 
        message: "Internal server error" 
      } as ApiResponse,
      { status: 500 }
    )
  }
} 