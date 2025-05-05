import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  id?: string | number;
  sub?: string;
  userId?: string | number;
  email?: string;
  name?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

// This is a diagnostic endpoint to check token validity
export async function GET(request: NextRequest) {
  // Get token from various sources
  const cookieStore = cookies();
  const cookieToken = cookieStore.get('token')?.value;
  const authHeader = request.headers.get('Authorization');
  let headerToken = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    headerToken = authHeader.substring(7);
  }
  
  const urlToken = request.nextUrl.searchParams.get('token');
  
  // Response object
  const response: {
    tokenSources: {
      cookie: { present: boolean; token?: string; };
      header: { present: boolean; token?: string; };
      url: { present: boolean; token?: string; };
    };
    decodedTokens: {
      cookie?: JWTPayload | null;
      header?: JWTPayload | null;
      url?: JWTPayload | null;
    };
    tokenStatus: {
      cookie?: { valid: boolean; expired?: boolean; error?: string; };
      header?: { valid: boolean; expired?: boolean; error?: string; };
      url?: { valid: boolean; expired?: boolean; error?: string; };
    };
  } = {
    tokenSources: {
      cookie: { present: !!cookieToken },
      header: { present: !!headerToken },
      url: { present: !!urlToken }
    },
    decodedTokens: {},
    tokenStatus: {}
  };
  
  // Sanitize token for display (show only first and last few chars)
  const sanitizeToken = (token: string) => {
    if (!token) return '';
    if (token.length <= 10) return '***';
    return `${token.substring(0, 5)}...${token.substring(token.length - 5)}`;
  };
  
  // Add sanitized token versions
  if (cookieToken) response.tokenSources.cookie.token = sanitizeToken(cookieToken);
  if (headerToken) response.tokenSources.header.token = sanitizeToken(headerToken);
  if (urlToken) response.tokenSources.url.token = sanitizeToken(urlToken);
  
  // Decode tokens
  const decodeToken = (token: string | null): { decoded: JWTPayload | null; error?: string } => {
    if (!token) return { decoded: null };
    
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      const expired = decoded.exp ? decoded.exp < now : false;
      
      return { 
        decoded, 
        error: expired ? 'Token has expired' : undefined
      };
    } catch (error) {
      return { 
        decoded: null, 
        error: error instanceof Error ? error.message : 'Invalid token format'
      };
    }
  };
  
  // Process each token
  if (cookieToken) {
    const { decoded, error } = decodeToken(cookieToken);
    response.decodedTokens.cookie = decoded;
    response.tokenStatus.cookie = { 
      valid: !!decoded, 
      expired: decoded?.exp ? decoded.exp < Math.floor(Date.now() / 1000) : false,
      error
    };
  }
  
  if (headerToken) {
    const { decoded, error } = decodeToken(headerToken);
    response.decodedTokens.header = decoded;
    response.tokenStatus.header = { 
      valid: !!decoded,
      expired: decoded?.exp ? decoded.exp < Math.floor(Date.now() / 1000) : false,
      error
    };
  }
  
  if (urlToken) {
    const { decoded, error } = decodeToken(urlToken);
    response.decodedTokens.url = decoded;
    response.tokenStatus.url = { 
      valid: !!decoded,
      expired: decoded?.exp ? decoded.exp < Math.floor(Date.now() / 1000) : false,
      error
    };
  }
  
  return new NextResponse(JSON.stringify(response, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
} 