import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define which paths are considered public (no auth required)
  const isPublicPath = path === '/login' || path === '/signup' || path === '/' || path === '/pricing' || path === '/checkout' || path === '/coming-soon'
  
  // Check if user has a token
  const token = request.cookies.get('auth-token')?.value || ''
  
  // If the user is on a protected path but doesn't have a token, redirect to login
  if (!isPublicPath && !token) {
    // Store the original URL to redirect back after login
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