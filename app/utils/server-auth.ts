import { cookies } from "next/headers"
import { verifyToken, User, JWTPayload } from "./auth"

// Server-side function to get the current user from the auth cookie
export function getCurrentUser(): User | null {
  try {
    const token = cookies().get('auth-token')?.value
    
    if (!token) {
      return null
    }
    
    // Verify and decode the token
    const tokenData = verifyToken(token)
    
    if (!tokenData) {
      return null
    }
    
    // Convert token data to User format
    return {
      id: tokenData.id,
      email: tokenData.email,
      name: tokenData.name
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
} 