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
    
    try {
      // Decode the JWT token to get the payload
      const decoded = jwtDecode<JWTPayload>(token);
      
      // Extract user information from the decoded token
      const user = {
        id: decoded.id || decoded.userId || 0,
        name: decoded.name || "",
        email: decoded.email || "",
        isVerifiedEmail: true,
        isVerified: true,
        profilePicture: decoded.profilePicture || "/avatar.png",
        created_at: decoded.created_at || new Date().toISOString(),
        updated_at: decoded.updated_at || new Date().toISOString(),
        role: decoded.role || "user",
        subscription_plan: decoded.subscription_plan || "basic"
      };
      
      // Return success with decoded user data
      return NextResponse.json({
        valid: true,
        message: "Token is valid",
        user: user
      });
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
      return NextResponse.json(
        { valid: false, message: "Invalid token format" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Error validating token:", error);
    
    return NextResponse.json(
      { valid: false, message: error.message || "An error occurred during token validation" },
      { status: 500 }
    );
  }
} 