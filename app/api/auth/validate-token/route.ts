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

    // Try to decode the token to extract user information
    let decodedToken: JWTPayload = {};
    try {
      decodedToken = jwtDecode(token);
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
    }

    // Call backend API to validate token
    try {
      const response = await fetch(`${process.env.NEXTAPI_URL}/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Response:", response)

      const data = await response.json();

      console.log("Validate data:", data)
      
      // Extract user information, with fallbacks
      const userId = data.id || data.userId || decodedToken.id || decodedToken.userId || "1";
      const email = data.email || decodedToken.email || "";
      const name = data.name || decodedToken.name || undefined;
      const isVerified = data.isVerified || data.is_verified || data.verified || data.isVerifiedEmail || data.emailVerified || false;
      const imageBase64 = data.imageBase64 || data.profileImageBase64 || null;
      const profilePicture = data.profilePicture || data.profile_picture || data.avatar || data.imageBase64 || null;
      const createdAt = data.created_at || data.createdAt || null;
      const passwordChangedAt = data.passwordChangedAt || data.password_changed_at || null;
      
      return NextResponse.json(
        { 
          status: "success", 
          data: { 
            valid: true,
            message: "Token is valid",
            user: data.user || {
              id: userId.toString(),
              email: email,
              name: name,
              isVerified: isVerified,
              imageBase64: imageBase64,
              profilePicture: profilePicture,
              createdAt: createdAt,
              passwordChangedAt: passwordChangedAt
            }
          } 
        } as ApiResponse,
        { status: 200 }
      );
      
    } catch (error) {
      console.error("External API token validation error:", error);
      
      // If API fails but we have token data, use it as a fallback
      if (decodedToken && (decodedToken.id || decodedToken.userId || decodedToken.email)) {
        const userId = (decodedToken.id || decodedToken.userId || "unknown").toString();
        const email = decodedToken.email || "";
        const name = decodedToken.name || undefined;
        const isVerified = decodedToken.isVerified || decodedToken.is_verified || decodedToken.verified || decodedToken.isVerifiedEmail || decodedToken.emailVerified || false;
        const imageBase64 = decodedToken.imageBase64 || decodedToken.profileImageBase64 || null;
        const profilePicture = decodedToken.profilePicture || decodedToken.profile_picture || decodedToken.avatar || decodedToken.imageBase64 || null;
        const createdAt = decodedToken.created_at || decodedToken.createdAt || null;
        const passwordChangedAt = decodedToken.passwordChangedAt || decodedToken.password_changed_at || null;
        
        
        return NextResponse.json(
          { 
            status: "success", 
            data: { 
              valid: true,
              message: "Token contains valid user data",
              user: {
                id: userId,
                email: email,
                name: name,
                isVerified: isVerified,
                imageBase64: imageBase64,
                profilePicture: profilePicture,
                createdAt: createdAt,
                passwordChangedAt: passwordChangedAt
              }
            } 
          } as ApiResponse,
          { status: 200 }
        );
      }
      
      // If external validation fails, return invalid token response
      return NextResponse.json(
        { 
          status: "error", 
          message: "Invalid token", 
          data: { valid: false } 
        } as ApiResponse,
        { status: 401 }
      );
    }
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