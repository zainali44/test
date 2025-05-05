import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/app/utils/auth"
import { cookies } from "next/headers"

// Server-side function to remove auth cookie
function removeAuthCookie(): void {
  // Delete with explicit options to ensure proper deletion
  cookies().delete({
    name: "auth-token",
    path: "/",
    // Don't set secure: true for development
    // secure: true, 
    httpOnly: true
  })
  
  // Also delete any backup cookie
  cookies().delete({
    name: "ls-auth-token",
    path: "/",
    httpOnly: true
  })
}

export async function POST(request: NextRequest) {
  try {
    // Remove auth cookie
    removeAuthCookie()
    
    // Set a clear cookie header as additional measure
    const response = NextResponse.json(
      { 
        status: "success", 
        message: "Logged out successfully" 
      } as ApiResponse,
      { status: 200 }
    )
    
    // Add explicit cookie clearing to response headers
    response.cookies.delete({
      name: "auth-token",
      path: "/",
      httpOnly: true
    })
    
    return response
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