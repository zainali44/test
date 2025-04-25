import { NextRequest, NextResponse } from "next/server"
import { verifyToken, ApiResponse } from "@/app/utils/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    // Validate request body
    if (!token) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Token is required" 
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Verify token
    const payload = verifyToken(token)

    // If token is invalid or expired
    if (!payload) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Invalid token", 
          data: { valid: false } 
        } as ApiResponse,
        { status: 401 }
      )
    }

    // Return success response
    return NextResponse.json(
      { 
        status: "success", 
        data: { 
          valid: true,
          message: "Token is valid",
          user: {
            id: payload.id,
            email: payload.email
          }
        } 
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json(
      { 
        status: "error", 
        message: "Internal server error" 
      } as ApiResponse,
      { status: 500 }
    )
  }
} 