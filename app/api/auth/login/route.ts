import { NextRequest, NextResponse } from "next/server"
import { createToken, ApiResponse } from "@/app/utils/auth"

// Mock user database - in a real app, you would use a database
const USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate request body
    if (!email || !password) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Email and password are required" 
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Find user in the mock database
    const user = USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    // If user not found, return 404
    if (!user) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "User not found" 
        } as ApiResponse,
        { status: 404 }
      )
    }

    // Validate password (in a real app, you would compare hash)
    if (user.password !== password) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Invalid credentials" 
        } as ApiResponse,
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken({
      id: user.id,
      email: user.email,
    })

    // Return success response with token
    return NextResponse.json(
      { 
        status: "success", 
        data: { token } 
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { 
        status: "error", 
        message: "Internal server error" 
      } as ApiResponse,
      { status: 500 }
    )
  }
} 