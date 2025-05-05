import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { getApiBaseUrl } from '@/app/utils/profileApi';

interface JWTPayload {
  id?: string | number;
  userId?: string | number;
  email?: string;
  name?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  // Get token from various sources
  const cookieStore = cookies();
  const cookieToken = cookieStore.get('token')?.value;
  const authHeader = request.headers.get('Authorization');
  let token = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieToken) {
    token = cookieToken;
  } else {
    token = request.nextUrl.searchParams.get('token');
  }
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required', message: 'No token provided' },
      { status: 401 }
    );
  }

  try {
    // Check if token is actually near expiration
    let decodedToken: JWTPayload = {};
    let needsRefresh = false;
    
    try {
      decodedToken = jwtDecode(token);
      
      // Check if token will expire in the next 15 minutes
      const now = Math.floor(Date.now() / 1000);
      const fifteenMinutes = 15 * 60; // in seconds
      
      if (decodedToken.exp && (decodedToken.exp - now < fifteenMinutes)) {
        needsRefresh = true;
      } else if (!decodedToken.exp) {
        // If we can't determine expiration time, refresh as a precaution
        needsRefresh = true;
      }
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
      // If we can't decode the token, try to refresh it anyway
      needsRefresh = true;
    }
    
    if (!needsRefresh) {
      // Token is still valid with more than 15 minutes left
      return NextResponse.json(
        { 
          message: 'Token still valid', 
          refreshed: false,
          tokenInfo: {
            expiresAt: decodedToken.exp,
            currentTime: Math.floor(Date.now() / 1000),
            timeRemaining: decodedToken.exp ? decodedToken.exp - Math.floor(Date.now() / 1000) : null
          }
        },
        { status: 200 }
      );
    }
    
    // Try to refresh the token with the backend
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // If backend doesn't support token refresh or any other error
      return NextResponse.json(
        { 
          error: 'Token refresh failed', 
          message: 'Unable to refresh authentication token. Please log in again.' 
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const newToken = data.token;
    
    if (!newToken) {
      return NextResponse.json(
        { error: 'Invalid response', message: 'Backend did not provide a new token' },
        { status: 500 }
      );
    }
    
    // Set the new token as a cookie
    const cookieOptions = {
      // Set cookie to expire in 30 days by default
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };
    
    // Create response with new token
    const jsonResponse = NextResponse.json(
      { message: 'Token refreshed successfully', refreshed: true },
      { status: 200 }
    );
    
    // Add the refreshed token as a cookie
    jsonResponse.cookies.set('token', newToken, cookieOptions);
    
    return jsonResponse;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'An unexpected error occurred during token refresh' 
      },
      { status: 500 }
    );
  }
} 