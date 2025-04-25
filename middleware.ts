import { NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

interface JWTPayload {
  id: string
  email: string
  exp: number
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Math.floor(Date.now() / 1000)
    
    return decoded.exp < currentTime
  } catch {
    return true
  }
}

// Paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/dashboard/settings",
  "/dashboard/profile",
  "/dashboard/upgrade",
  "/dashboard/downloads",
  "/dashboard/subscriptions",
  "/dashboard/manual-configuration",
]

// Paths that should redirect to dashboard if user is already logged in
const authPaths = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  // Check if the path is an auth path (like login or signup)
  const isAuthPath = authPaths.some(path => pathname === path)
  
  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value
  
  // If path requires authentication and token is missing or expired
  if (isProtectedPath && (!token || isTokenExpired(token))) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }
  
  // If user is already logged in and tries to access login or signup
  if (isAuthPath && token && !isTokenExpired(token)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all protected paths
    "/dashboard/:path*",
    // Match auth paths
    "/login",
    "/signup",
  ],
} 