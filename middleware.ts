import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Global redirect tracker with improved memory management
const redirectTracker = new Map<string, {count: number, timestamp: number}>();

// Clean up old entries every 15 minutes
const CLEANUP_INTERVAL = 900000; // 15 minutes
const REDIRECT_THRESHOLD = 3; // Maximum redirects allowed in a short period
const REDIRECT_WINDOW = 10000; // 10 seconds window for counting redirects

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Get client identifier for tracking redirects (IP + path)
  const clientId = request.ip || request.headers.get('user-agent') || 'unknown';
  const redirectKey = `${clientId}-${path}`;
  
  // Check if we're in a potential redirect loop
  const now = Date.now();
  const clientRecord = redirectTracker.get(redirectKey);
  const recentRedirects = clientRecord?.count || 0;
  
  // If this client/path has been redirected too many times recently, block further redirects
  if (clientRecord && now - clientRecord.timestamp < REDIRECT_WINDOW && recentRedirects >= REDIRECT_THRESHOLD) {
    console.log(`Too many redirects detected for ${redirectKey}, allowing request to proceed`);
    return NextResponse.next();
  }
  
  // Check for logout in progress
  const isLoggingOut = request.cookies.get('logging-out')?.value === 'true';
  if (isLoggingOut) {
    console.log("Logout in progress, allowing request to proceed");
    return NextResponse.next();
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
                       path.startsWith('/api/');  // API paths are handled separately
  
  // Check if user has a token (either from cookies or ls-cookie backup)
  const token = request.cookies.get('auth-token')?.value || request.cookies.get('ls-auth-token')?.value || '';
  
  // Handle redirect from dashboard to dashboard/downloads more simply
  if (path === '/dashboard' && token) {
    // Track this redirect
    updateRedirectTracker(redirectKey, now);
    return NextResponse.redirect(new URL('/dashboard/downloads', request.url));
  }
  
  // If user is on a protected path but doesn't have a token
  if (!isPublicPath && !token) {
    console.log("No auth token found, redirecting to login");
    
    // Track this redirect
    updateRedirectTracker(redirectKey, now);
    
    // Store the original URL to redirect back after login
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }
  
  // If user is on login/signup but already has a token, redirect to dashboard
  if ((path === '/login' || path === '/signup') && token) {
    console.log("User already authenticated, redirecting to dashboard");
    
    // Track this redirect
    updateRedirectTracker(redirectKey, now);
    
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // For all other cases, let the request proceed
  return NextResponse.next();
}

// Helper function to update the redirect tracker
function updateRedirectTracker(key: string, timestamp: number) {
  const existing = redirectTracker.get(key);
  
  if (existing) {
    // If the last redirect was more than REDIRECT_WINDOW ms ago, reset the counter
    if (timestamp - existing.timestamp > REDIRECT_WINDOW) {
      redirectTracker.set(key, { count: 1, timestamp });
    } else {
      // Otherwise increment the counter
      redirectTracker.set(key, { 
        count: existing.count + 1, 
        timestamp: existing.timestamp // Keep the original timestamp to maintain the window
      });
    }
  } else {
    // First redirect for this key
    redirectTracker.set(key, { count: 1, timestamp });
  }
  
  // Clean up old entries if needed
  cleanupRedirectTracker(timestamp);
}

// Helper function to clean up old entries
function cleanupRedirectTracker(now: number) {
  // Only clean up occasionally to reduce overhead
  const shouldCleanup = Math.random() < 0.1; // 10% chance on each redirect
  
  if (shouldCleanup) {
    for (const [key, record] of redirectTracker.entries()) {
      if (now - record.timestamp > CLEANUP_INTERVAL) {
        redirectTracker.delete(key);
      }
    }
  }
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