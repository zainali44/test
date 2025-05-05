import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Keep track of recent redirects to prevent loops
const redirectTracker = new Map<string, number>();

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Check if we're in a potential redirect loop by checking URL parameters
  const url = new URL(request.url)
  const callbackUrl = url.searchParams.get('callbackUrl')
  
  // Get client IP or another identifier for tracking redirects
  const clientId = request.ip || request.headers.get('user-agent') || 'unknown';
  const redirectKey = `${clientId}-${path}`;
  
  // Check if we've recently redirected this client from this path
  const now = Date.now();
  const lastRedirect = redirectTracker.get(redirectKey) || 0;
  
  // If we've redirected this client in the last 5 seconds, just proceed without redirect
  if (now - lastRedirect < 5000) {
    console.log("Recent redirect detected, skipping redirect to prevent loop");
    return NextResponse.next();
  }
  
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

  // Redirect from /dashboard main route to /dashboard/downloads with delayed execution
  // Only do this after successfully validating the user is authenticated
  if (path === '/dashboard') {
    const token = request.cookies.get('auth-token')?.value || request.cookies.get('ls-auth-token')?.value || ''
    
    // If user has a token, proceed with redirect
    if (token) {
      console.log("Redirecting from dashboard to dashboard/downloads")
      redirectTracker.set(redirectKey, now); // Record this redirect
      return NextResponse.redirect(new URL('/dashboard/downloads', request.url))
    } else {
      // If no token, let the auth check below handle the redirect to login
      console.log("No token for dashboard redirect, will fall through to auth check")
    }
  }

  // Define which paths are considered public (no auth required)
  const isPublicPath = path === '/login' || 
                       path === '/signup' || 
                       path === '/' || 
                       path === '/pricing' || 
                       path === '/checkout' || 
                       path === '/coming-soon' || 
                       path === '/forgot-password' || 
                       path === '/reset-password' ||
                       path.startsWith('/api/') // API paths are handled separately
  
  // Check if user has a token
  const token = request.cookies.get('auth-token')?.value || ''
  const lsToken = request.cookies.get('ls-auth-token')?.value || '' // Check localStorage backup if exists
  
  // If we have a token in localStorage but not in cookies, 
  // we may be in a state transition during auth setup
  const hasLocalStorageToken = lsToken && !token
  
  // If the user is on a protected path but doesn't have a token
  if (!isPublicPath && !token && !hasLocalStorageToken) {
    // Verify we haven't redirected this client recently to prevent loops
    if (now - lastRedirect < 10000) {
      console.log("Multiple redirects detected in short period, letting request proceed");
      return NextResponse.next();
    }
    
    // Store the original URL to redirect back after login
    console.log("No auth token found, redirecting to login")
    
    // Record this redirect
    redirectTracker.set(redirectKey, now);
    
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(url)
  }
  
  // Redirect authenticated users from pricing or checkout to dashboard/upgrade
  if ((path === '/pricing' || path === '/checkout') && token) {
    redirectTracker.set(redirectKey, now); // Record this redirect
    return NextResponse.redirect(new URL('/dashboard/upgrade', request.url))
  }
  
  // If the user is on a public path but already has a token, redirect to dashboard
  if (isPublicPath && token && (path === '/login' || path === '/signup')) {
    // Verify we haven't redirected this client recently to prevent loops
    if (now - lastRedirect < 10000) {
      console.log("Multiple redirects detected in short period, letting request proceed");
      return NextResponse.next();
    }
    
    redirectTracker.set(redirectKey, now); // Record this redirect
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Clean up old entries in the redirect tracker every few minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of redirectTracker.entries()) {
      if (now - timestamp > 60000) { // Remove entries older than 1 minute
        redirectTracker.delete(key);
      }
    }
  }, 60000);
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