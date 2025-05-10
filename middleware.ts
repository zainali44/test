import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // CRITICAL: Check for login failure flags or bypass flags
  // If any of these are present, NEVER modify the request or redirect
  const loginFailed = request.cookies.get('login-failed')?.value === 'true';
  const bypassAuth = request.cookies.get('_bypass_auth_during_error')?.value === 'true';
  const loginInProgress = request.cookies.get('login-in-progress')?.value === 'true';
  const loggingOut = request.cookies.get('logging-out')?.value === 'true';
  const urlHasLoginFailed = request.nextUrl.searchParams.get('login_failed') === 'true';
  
  // If any auth bypass flag is present, never redirect
  if (loginFailed || bypassAuth || urlHasLoginFailed || loginInProgress || loggingOut) {
    console.log("Auth bypass flags detected - letting request pass through");
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
                     path.startsWith('/api/auth/') ||  // Auth API endpoints
                     path.startsWith('/api/public/');  // Other public APIs
  
  // Always allow access to public paths without any auth checks
  if (isPublicPath) {
    // Get auth state only if we need to check for redirects to dashboard
    const authToken = request.cookies.get('auth-token')?.value || '';
    const authValidated = request.cookies.get('auth-validated')?.value === 'true';
    
    // For login/signup pages with active auth, redirect to dashboard
    if ((path === '/login' || path === '/signup') && authToken && authValidated) {
      console.log("Valid auth detected on login/signup page, redirecting to dashboard");
      const response = NextResponse.redirect(new URL('/dashboard/downloads', request.url));
      return response;
    }
    
    // For all other public paths, just continue
    return NextResponse.next();
  }
  
  // Check if path is a protected dashboard route
  const isDashboardRoute = path.startsWith('/dashboard') || 
                          path.startsWith('/account') || 
                          path.startsWith('/settings');
  
  // For protected routes, check auth status
  if (isDashboardRoute) {
    // Get auth state
    const authToken = request.cookies.get('auth-token')?.value || '';
    const authValidated = request.cookies.get('auth-validated')?.value === 'true';
    
    // Protect dashboard routes - require both token AND validation
    if (!authToken || !authValidated) {
      console.log("Missing/invalid auth for protected route, redirecting to login");
      // Simple redirect without query parameters to avoid complexities
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // For all other cases, let the request proceed
  return NextResponse.next();
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