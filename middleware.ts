import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  // console.log("Middleware processing path:", path)
  
  // Check if we're in a potential redirect loop by checking URL parameters
  const url = new URL(request.url)
  const callbackUrl = url.searchParams.get('callbackUrl')
  // console.log("Callback URL:", callbackUrl)
  
  // Check for logout in progress
  const isLoggingOut = request.cookies.get('logging-out')?.value === 'true'
  
  // If we're on the login page with a callbackUrl to dashboard, we may be in a loop
  const potentialLoop = path === '/login' && callbackUrl === '/dashboard'
  if (potentialLoop) {
    console.log("Detected potential redirect loop, proceeding to dashboard")
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If logging out, let the request proceed without redirects
  if (isLoggingOut && path === '/login') {
    console.log("Logout in progress, allowing navigation to login")
    return NextResponse.next()
  }

  // Redirect from /dashboard main route to /dashboard/downloads
  if (path === '/dashboard') {
    console.log("Redirecting from dashboard to dashboard/downloads")
    return NextResponse.redirect(new URL('/dashboard/downloads', request.url))
  }

  // Define which paths are considered public (no auth required)
  const isPublicPath = path === '/login' || path === '/signup' || path === '/' || path === '/pricing' || path === '/checkout' || path === '/coming-soon'
  
  // Check if user has a token
  const token = request.cookies.get('auth-token')?.value || ''
  const lsToken = request.cookies.get('ls-auth-token')?.value || '' // Check localStorage backup if exists
  // console.log("Auth token exists:", token ? "Yes" : "No", "Length:", token.length)
  // console.log("All cookies:", [...request.cookies.getAll()].map(c => c.name))

  // If we have a token in localStorage but not in cookies, skip auth check for this request
  // This helps prevent redirect loops during auth setup
  const hasLocalStorageToken = lsToken && !token
  
  // If the user is on a protected path but doesn't have a token, redirect to login
  if (!isPublicPath && !token && !hasLocalStorageToken) {
    // Store the original URL to redirect back after login
    console.log("No auth token found, redirecting to login")
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(url)
  }
  
  // Redirect authenticated users from pricing or checkout to dashboard/upgrade
  if ((path === '/pricing' || path === '/checkout') && token) {
    return NextResponse.redirect(new URL('/dashboard/upgrade', request.url))
  }
  
  // If the user is on a public path but already has a token, redirect to dashboard
  if (isPublicPath && token && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more about path matching
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
} 