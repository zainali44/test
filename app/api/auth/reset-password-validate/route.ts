import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/app/utils/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    // Validate request body
    if (!token) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Token is required",
          valid: false
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Call backend API to validate reset token
    try {
      const response = await fetch(`${process.env.NEXTAPI_URL}/users/reset-password-validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { 
            status: "error", 
            message: errorData.error || "Invalid token", 
            valid: false
          } as ApiResponse,
          { status: response.status }
        );
      }

      const data = await response.json();
      
      return NextResponse.json(
        { 
          status: "success", 
          message: "Token is valid",
          valid: true
        } as ApiResponse,
        { status: 200 }
      );
    } catch (error) {
      console.error("External API token validation error:", error);
      
      return NextResponse.json(
        { 
          status: "error", 
          message: "Invalid or expired token", 
          valid: false
        } as ApiResponse,
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json(
      { 
        status: "error", 
        message: "Internal server error",
        valid: false
      } as ApiResponse,
      { status: 500 }
    )
  }
} 