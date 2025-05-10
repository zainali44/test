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
  
  // Also delete the logging-out cookie
  cookies().delete({
    name: "logging-out",
    path: "/",
    httpOnly: true
  })
  
  // Set a cookie to indicate recent logout
  cookies().set({
    name: "recently-logged-out",
    value: "true",
    path: "/",
    maxAge: 60, // 1 minute (changed from 5 minutes to reduce interference)
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
    
    response.cookies.delete({
      name: "ls-auth-token",
      path: "/",
      httpOnly: true
    })
    
    response.cookies.delete({
      name: "logging-out",
      path: "/",
      httpOnly: true
    })
    
    // Set recently-logged-out cookie in response
    response.cookies.set({
      name: "recently-logged-out",
      value: "true",
      path: "/",
      maxAge: 60, // 1 minute
      httpOnly: true
    })
    
    // Set explicit cookies with past expiration as a fallback approach
    response.headers.append('Set-Cookie', 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
    response.headers.append('Set-Cookie', 'ls-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
    response.headers.append('Set-Cookie', 'logging-out=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
    response.headers.append('Set-Cookie', 'recently-logged-out=true; Path=/; Max-Age=60; HttpOnly');
    
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