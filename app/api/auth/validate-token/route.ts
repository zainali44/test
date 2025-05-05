import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/app/utils/auth"
import { jwtDecode } from "jwt-decode"

interface JWTPayload {
  id?: string | number;
  userId?: string | number;
  email?: string;
  name?: string;
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { valid: false, message: "No token provided" },
        { status: 400 }
      );
    }
    
    // In a real app, we would verify the token with an external service
    // For this example, assume a simple validation based on token format
    // In production, you should integrate with your real validation service
    const isValidToken = token && token.length > 20;
    
    // If token is invalid, return error
    if (!isValidToken) {
      return NextResponse.json(
        { valid: false, message: "Invalid token format" },
        { status: 401 }
      );
    }
    
    // Mock user data - in a real app, you would fetch this from your user service
    const mockUser = {
      id: 5,
      name: "Test User",
      email: "user@example.com",
      isVerifiedEmail: true,
      isVerified: true,
      profilePicture: "/avatar.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: "user",
      subscription_plan: "basic"
    };
    
    // Return success with user data
    return NextResponse.json({
      valid: true,
      message: "Token is valid",
      user: mockUser
    });
    
  } catch (error: any) {
    console.error("Error validating token:", error);
    
    return NextResponse.json(
      { valid: false, message: error.message || "An error occurred during token validation" },
      { status: 500 }
    );
  }
} 