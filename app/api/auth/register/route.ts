import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/app/utils/auth"
import { cookies } from "next/headers"

// Server-side function to set auth cookie
function setAuthCookie(token: string): void {
  cookies().set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log("Register API called with method:", request.method);
    
    const body = await request.json()
    console.log("Request body:", { name: body.name, email: body.email, password: "***" });
    
    const { name, email, password } = body

    // Validate request body
    if (!name || !email || !password) {
      console.log("Validation failed: Missing required fields");
      return NextResponse.json(
        { 
          status: "error", 
          message: "Name, email, and password are required" 
        } as ApiResponse,
        { status: 400 }
      )
    }

    try {
      // Make sure the URL has a trailing slash before appending 'users'
      const apiUrl = process.env.NEXTAPI_URL || '';
      const formattedApiUrl = apiUrl.endsWith('/') ? apiUrl + 'users/create' : apiUrl + '/users/create';
      
      // Call external registration API
      console.log("Attempting to call external API at:", formattedApiUrl);
      const response = await fetch(formattedApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("API Registration Response status:", response.status);
      
      const data = await response.json();
      console.log("API Registration Response data:", data);

      // Handle error response
      if (!response.ok) {
        return NextResponse.json(
          { 
            status: "error", 
            message: data.error || "Error creating user" 
          } as ApiResponse,
          { status: response.status || 400 }
        )
      }

      try {
        // After successful registration, call login API to get token
        console.log("Registration successful. Attempting login...");
        
        // Ensure the login URL is properly formatted
        const loginUrl = apiUrl.endsWith('/') ? apiUrl + 'login' : apiUrl + '/login';
        console.log("Login URL:", loginUrl);
        
        const loginResponse = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
          body: JSON.stringify({ email, password }),
        });

        console.log("Login API Response status:", loginResponse.status);
        
        const loginData = await loginResponse.json();
        console.log("Login API Response data:", loginData);

        if (!loginResponse.ok) {
          // Registration succeeded but login failed
          console.log("Login failed after successful registration");
          return NextResponse.json(
            { 
              status: "success", 
              message: "User created successfully. Please check your email for a verification link.",
              data: { user: { id: data.id, name, email } } 
            } as ApiResponse,
            { status: 201 }
          )
        }

        // Get token from login response
        const token = loginData.token;
        if (!token) {
          console.error("No token received from login API");
          return NextResponse.json(
            { 
              status: "success", 
              message: "User created successfully. Please check your email for a verification link.",
              data: { user: { id: data.id, name, email } } 
            } as ApiResponse,
            { status: 201 }
          )
        }
        
        console.log("Token received successfully");

        // Set auth cookie
        setAuthCookie(token)

        // Return success response with token and user data
        console.log("Registration and login process completed successfully");
        const response = NextResponse.json(
          { 
            status: "success", 
            message: "Registration successful. Please check your email for a verification link.",
            data: { token, user: { id: data.id, name, email } } 
          } as ApiResponse,
          { status: 201 }
        );
        
        console.log("Final response:", { 
          status: "success", 
          message: "Registration successful. Please check your email for a verification link.",
          data: { token: "***", user: { id: data.id, name, email } } 
        });
        
        return response;
      } catch (loginError) {
        console.error("Error during automatic login:", loginError);
        return NextResponse.json(
          { 
            status: "success", 
            message: "User created successfully. Please check your email for a verification link.",
            data: { user: { id: data.id, name, email } } 
          } as ApiResponse,
          { status: 201 }
        )
      }
    } catch (apiError) {
      console.error("External API error:", apiError);
      return NextResponse.json(
        { 
          status: "error", 
          message: "Failed to connect to registration service" 
        } as ApiResponse,
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Internal server error" 
      } as ApiResponse,
      { status: 500 }
    )
  }
} 