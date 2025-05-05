import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { validateToken } from '@/app/utils/profileApi';

interface JWTPayload {
  id?: string | number;
  userId?: string | number;
  email?: string;
  name?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

// Define the type returned by validateToken for better type checking
interface TokenValidationResponse {
  valid: boolean;
  message: any;
  user: {
    id: any;
    email: any;
    name: any;
    isVerified: any;
    imageBase64: any;
    profilePicture: any;
    created_at: any;
    passwordChangedAt: any;
  } | null;
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
      { error: 'No token found', message: 'No authentication token found in cookies, headers, or URL' },
      { status: 401 }
    );
  }

  // Response object to collect all validation information
  const response: any = {
    token_source: cookieToken ? 'cookie' : (authHeader ? 'header' : 'url'),
    token_preview: token ? `${token.substring(0, 5)}...${token.substring(token.length - 5)}` : null,
    token_length: token.length,
    decoded: null,
    server_validation: null,
    validation_errors: []
  };

  // 1. Try to decode the token locally
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    
    response.decoded = {
      raw: decoded,
      id: decoded.id || decoded.userId || decoded.sub,
      email: decoded.email,
      name: decoded.name,
      issued_at: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : null,
      expires_at: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
      is_expired: decoded.exp ? decoded.exp < now : null,
      time_remaining: decoded.exp ? decoded.exp - now : null,
      current_time: now,
      current_time_iso: new Date(now * 1000).toISOString()
    };
    
    if (decoded.exp && decoded.exp < now) {
      response.validation_errors.push({
        source: 'local_expiration_check',
        error: 'Token has expired locally',
        details: {
          expired_at: new Date(decoded.exp * 1000).toISOString(),
          seconds_ago: now - decoded.exp
        }
      });
    }
  } catch (decodeError: any) {
    response.validation_errors.push({
      source: 'local_decode',
      error: decodeError.message || 'Failed to decode token',
    });
  }

  // 2. Try to validate the token with the server
  try {
    const validationResult = await validateToken(token) as TokenValidationResponse;
    // Use flexible type with 'as any' for additional potential properties
    const flexibleValidation = validationResult as any;
    
    response.server_validation = validationResult;
    
    // Check the response structure to identify common issues
    if (!validationResult) {
      response.validation_errors.push({
        source: 'server_validation',
        error: 'No response from validation server'
      });
    } else if (flexibleValidation.error) {
      response.validation_errors.push({
        source: 'server_validation',
        error: flexibleValidation.error
      });
    } else if (flexibleValidation.data && !flexibleValidation.data.valid) {
      response.validation_errors.push({
        source: 'server_validation_data',
        error: flexibleValidation.data.message || 'Token invalid according to server'
      });
    } else if (!validationResult.valid && !flexibleValidation.data) {
      response.validation_errors.push({
        source: 'server_validation_direct',
        error: 'Token validation failed'
      });
    }
  } catch (validationError: any) {
    response.validation_errors.push({
      source: 'server_validation_request',
      error: validationError.message || 'Failed to validate token with server'
    });
  }

  // 3. Attempt a direct JWT local validation with expiration check
  try {
    const decodedToken = jwtDecode<JWTPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    const gracePeriod = 60; // 1 minute
    
    if (decodedToken.exp) {
      response.jwt_validation = {
        now,
        token_exp: decodedToken.exp,
        time_remaining: decodedToken.exp - now,
        expired: decodedToken.exp < now,
        expired_with_grace: decodedToken.exp < (now - gracePeriod),
      };
    }
  } catch (jwtError) {
    // JWT error already recorded in first step
  }

  // 4. Print all cookies for debugging (sanitized)
  response.cookies = cookieStore.getAll().map(cookie => ({
    name: cookie.name,
    value_length: cookie.value.length,
    preview: cookie.value.length > 10 ? 
      `${cookie.value.substring(0, 5)}...${cookie.value.substring(cookie.value.length - 5)}` : 
      '[short value]'
  }));

  // 5. Add a utility link to refresh the token if it's expired
  if (response.decoded && response.decoded.is_expired) {
    response.refresh_token_url = `${request.nextUrl.origin}/api/auth/refresh-token`;
  }

  return NextResponse.json(response, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Get token from request body
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Get results from all validation methods
    const results = {
      // 1. Decode locally
      decodedToken: null as any,
      // 2. Validate with our API
      validationResult: null as any,
      // Final assessment
      assessment: {
        isValid: false,
        reasons: [] as string[]
      }
    };

    // 1. Try to decode token locally
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      
      results.decodedToken = {
        decoded,
        exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
        iat: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : null,
        isExpired: decoded.exp ? decoded.exp < now : null,
        timeRemaining: decoded.exp ? (decoded.exp - now) + ' seconds' : null,
        currentTime: now,
        currentTimeISO: new Date(now * 1000).toISOString()
      };
      
      if (decoded.exp && decoded.exp > now) {
        results.assessment.reasons.push('Token is valid according to JWT expiration');
      } else if (decoded.exp) {
        results.assessment.reasons.push('Token has expired according to JWT expiration');
      }
    } catch (error) {
      results.decodedToken = { error: 'Failed to decode token: ' + (error instanceof Error ? error.message : 'Unknown error') };
      results.assessment.reasons.push('Token could not be decoded (invalid format)');
    }

    // 2. Validate with API
    try {
      const validationResult = await validateToken(token) as TokenValidationResponse;
      const flexibleValidation = validationResult as any;
      
      results.validationResult = validationResult;
      
      if (validationResult.valid) {
        results.assessment.reasons.push('Token is valid according to validation API');
        results.assessment.isValid = true;
      } else {
        results.assessment.reasons.push('Token is invalid according to validation API: ' + 
          (flexibleValidation.error || validationResult.message || 'Unknown reason'));
      }
    } catch (error) {
      results.validationResult = { error: 'Failed to validate token: ' + (error instanceof Error ? error.message : 'Unknown error') };
      results.assessment.reasons.push('Token validation request failed');
    }

    // Generate final assessment
    results.assessment.isValid = results.assessment.reasons.some(reason => 
      reason.includes('valid according to validation API'));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in test-token route:', error);
    return NextResponse.json(
      { error: 'Failed to test token: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 