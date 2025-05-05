import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/app/utils/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    // Validate request body
    if (!token || !newPassword) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Token and new password are required"
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Call backend API to reset password
    try {
      const response = await fetch(`${process.env.NEXTAPI_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { 
            status: "error", 
            message: data.error || "Failed to reset password"
          } as ApiResponse,
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { 
          status: "success", 
          message: "Password reset successfully",
          passwordChangedAt: data.passwordChangedAt || new Date().toISOString()
        } as ApiResponse,
        { status: 200 }
      );
    } catch (error) {
      console.error("External API password reset error:", error);
      
      return NextResponse.json(
        { 
          status: "error", 
          message: "Failed to reset password. Please try again."
        } as ApiResponse,
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { 
        status: "error", 
        message: "Internal server error"
      } as ApiResponse,
      { status: 500 }
    )
  }
} 