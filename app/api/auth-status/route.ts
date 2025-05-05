import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  id?: string | number;
  userId?: string | number;
  sub?: string;
  email?: string;
  name?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

interface TokenValidationInfo {
  valid: boolean;
  expired?: boolean;
  timeRemaining?: number;
  expiresIn?: string;
  user?: {
    id: string | number | null;
    email: string | null;
  };
  issued?: string | null;
  expires?: string | null;
  error?: string;
}

interface ResponseObject {
  request: {
    headers: {
      cookie: boolean;
      authorization: boolean;
    };
    url: string;
  };
  cookies: Array<{
    name: string;
    present: boolean;
    value: string | null;
  }>;
  auth: {
    token_preview: string | null;
    token_length: number;
    token_sources: {
      header: boolean;
      cookie: boolean;
      url: boolean;
    };
  };
  validation: any;
  localstorage_check: {
    note: string;
  };
}

// This endpoint is for diagnostic purposes only, to check auth status
export async function GET(request: NextRequest) {
  // Get auth tokens from various sources
  const cookieStore = cookies();
  
  // Get all cookies
  const allCookies = cookieStore.getAll();
  const cookieNames = ['token', 'auth-token', 'ls-auth-token'];
  const cookieTokens = cookieNames.map(name => {
    const cookie = cookieStore.get(name);
    return {
      name,
      present: !!cookie,
      value: cookie ? `${cookie.value.substring(0, 5)}...${cookie.value.substring(cookie.value.length - 5)}` : null
    };
  });
  
  // Auth header token
  const authHeader = request.headers.get('Authorization');
  const headerToken = authHeader && authHeader.startsWith('Bearer ') ? 
    authHeader.substring(7) : null;
  
  // URL param token
  const urlToken = request.nextUrl.searchParams.get('token');
  
  // Get the token to validate
  const token = headerToken || 
                cookieStore.get('token')?.value || 
                cookieStore.get('auth-token')?.value || 
                cookieStore.get('ls-auth-token')?.value || 
                urlToken;
  
  // Response object
  const response: ResponseObject = {
    request: {
      headers: {
        cookie: request.headers.has('cookie'),
        authorization: request.headers.has('Authorization')
      },
      url: request.url
    },
    cookies: cookieTokens,
    auth: {
      token_preview: token ? `${token.substring(0, 5)}...${token.substring(token.length - 5)}` : null,
      token_length: token ? token.length : 0,
      token_sources: {
        header: !!headerToken,
        cookie: cookieTokens.some(c => c.present),
        url: !!urlToken
      }
    },
    validation: token ? await validateTokenComprehensive(token) : { 
      error: "No token found to validate"
    },
    localstorage_check: {
      note: "Check browser console for localStorage.getItem('auth-token')"
    }
  };
  
  return NextResponse.json(response);
}

// Comprehensive token validation with multiple methods
async function validateTokenComprehensive(token: string): Promise<any> {
  const results: any = {
    local_decode: null,
    local_validation: null,
    api_validation: null,
    external_validation: null
  };
  
  // 1. Local decode
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    
    results.local_decode = {
      success: true,
      payload: {
        id: decoded.id || decoded.userId || decoded.sub,
        email: decoded.email,
        name: decoded.name,
        issued_at: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : null,
        expires_at: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
      },
      expiration: {
        expired: decoded.exp ? decoded.exp < now : null,
        current_time: now,
        current_time_iso: new Date(now * 1000).toISOString(),
        time_remaining_seconds: decoded.exp ? decoded.exp - now : null,
        time_remaining: decoded.exp ? formatTimeRemaining(decoded.exp - now) : null
      }
    };
  } catch (error) {
    results.local_decode = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
  
  // 2. Direct JWT validation
  if (results.local_decode?.success) {
    const decoded = results.local_decode.payload;
    const expInfo = results.local_decode.expiration;
    
    results.local_validation = {
      valid: !expInfo.expired,
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      },
      expiration: expInfo
    };
  }
  
  // 3. Internal API validation 
  try {
    const baseUrl = typeof window !== 'undefined' ? 
      window.location.origin : 
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
    const response = await fetch(`${baseUrl}/api/auth/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    const data = await response.json();
    results.api_validation = {
      success: response.ok,
      status: response.status,
      data: data
    };
  } catch (error) {
    results.api_validation = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
  
  // 4. External API validation (if configured)
  try {
    const apiUrl = process.env.NEXTAPI_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/users/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });
    
    if (response.ok) {
      const data = await response.json();
      results.external_validation = {
        success: true,
        data: data
      };
    } else {
      results.external_validation = {
        success: false,
        status: response.status,
        statusText: response.statusText
      };
    }
  } catch (error) {
    // This is expected to fail if external API isn't configured
    results.external_validation = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
  
  // Conclusion based on all checks
  let isValid = false;
  let user = null;
  
  // Prioritize API validation if available
  if (results.api_validation?.success && results.api_validation?.data?.data?.valid) {
    isValid = true;
    user = results.api_validation.data.data.user;
  } 
  // Then external API validation
  else if (results.external_validation?.success && results.external_validation?.data?.valid) {
    isValid = true;
    user = results.external_validation.data.user;
  }
  // Fall back to local validation
  else if (results.local_validation?.valid) {
    isValid = true;
    user = results.local_validation.user;
  }
  
  results.conclusion = {
    valid: isValid,
    user: user,
    time_remaining: results.local_decode?.expiration?.time_remaining || "unknown",
    validation_sources: {
      local: results.local_validation?.valid === true,
      api: results.api_validation?.success === true && results.api_validation?.data?.data?.valid === true,
      external: results.external_validation?.success === true && results.external_validation?.data?.valid === true
    }
  };
  
  return results;
}

// Helper function to format time remaining in a human-readable way
function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) {
    return 'Expired';
  }
  
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  const days = Math.floor(seconds / 86400);
  return `${days} day${days !== 1 ? 's' : ''}`;
} 