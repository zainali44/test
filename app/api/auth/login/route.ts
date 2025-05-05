import { NextRequest, NextResponse } from "next/server"
import { ApiResponse, User, Subscription } from "@/app/utils/auth"
import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"

interface JWTPayload {
  id?: string | number;
  email?: string;
  name?: string;
  [key: string]: any;           
}

// Server-side function to set auth cookie
function setAuthCookie(token: string): void {
  // Primary HTTP-only cookie for security
  cookies().set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: false, // Disable secure flag to work on both HTTP and HTTPS
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax"
  })
  
  // Secondary non-HTTP-only cookie as backup for client-side access
  // This can help diagnose issues with cookie handling
  cookies().set({
    name: "ls-auth-token",
    value: token,
    httpOnly: false,
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax"
  })
}

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
    console.log(process.env.NEXTAPI_URL)

    // Call external login API
    const response = await fetch(`${process.env.NEXTAPI_URL}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({ email, password }),
    });

    // console.log(response) 

    const data = await response.json();

    // Handle different response statuses
    if (response.status === 404) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "User not found" 
        } as ApiResponse,
        { status: 404 }
      )
    }

    if (response.status === 401) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Invalid credentials" 
        } as ApiResponse,
        { status: 401 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: response.status === 406 
            ? "You need to verify your Email. If not received, check your spam folder"
            : data.error || "Authentication failed"
        } as ApiResponse,
        { status: response.status }
      )
    }

    console.log(data)

    // API returns a token directly
    const token = data.token;

    if (!token) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "No token received from authentication server" 
        } as ApiResponse,
        { status: 500 }
      )
    }

    // Remove localStorage usage since this is server-side code
    // The token will be sent to the client via the auth cookie set below

    // Try to decode the token to extract user information
    let userData: User = { id: "1", email: email };
    
    try {
      const decoded = jwtDecode<JWTPayload>(token);

      console.log(decoded)
      
      // Update user data with information from token if available
      if (decoded) {
        userData = {
          id: decoded.id?.toString() || "1",
          email: decoded.email || email,
          name: decoded.name
        };
      }
    } catch (decodeError) {
      console.error("Error decoding token, using fallback user data:", decodeError);
    }

    // Include subscriptions from login response if available
    if (data.subscriptions) {
      userData.subscriptions = data.subscriptions as Subscription[];
    } else {
      // If no subscriptions data, add a default Free plan subscription
      userData.subscriptions = [{
        subscription_id: 1,
        user_id: parseInt(userData.id),
        plan_id: 1,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        plan: {
          plan_id: 1,
          name: 'Free',
          description: 'A free plan',
          price: '0.00',
          billing_cycle: '0',
          created_at: new Date().toISOString()
        }
      }];
    }

    // Set auth cookie
    setAuthCookie(token)
    console.log("Auth cookie set:", token.substring(0, 10) + "...")

    // Return success response with token and user data
    return NextResponse.json(
      { 
        status: "success", 
        data: { 
          token,
          user: userData
        } 
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