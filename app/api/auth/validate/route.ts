import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Define a type for the JWT payload
interface JwtPayload {
  id: string;
  email: string;
  name?: string;
  iat: number;
  exp: number;
}

export async function POST(request: NextRequest) {
  try {
    // Set a short timeout for this response
    const responseTimeoutMs = 3000;
    const responseTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Response timeout')), responseTimeoutMs);
    });

    const validationPromise = async () => {
      try {
        // Get the token from the request
        const body = await request.json();
        const token = body.token;
        
        // Also check Authorization header as fallback
        const authHeader = request.headers.get('Authorization');
        const bearerToken = authHeader?.startsWith('Bearer ') 
          ? authHeader.substring(7) 
          : null;
          
        // Use token from body or header
        const finalToken = token || bearerToken;
  
        if (!finalToken) {
          return NextResponse.json({
            status: 'error', 
            message: 'No token provided',
            data: { valid: false }
          }, { status: 401 });
        }
  
        // Verify token using environment variable secret
        const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
        
        try {
          const decoded = jwt.verify(finalToken, secret) as JwtPayload;
          
          // If token verification succeeds, token is valid
          return NextResponse.json({
            status: 'success',
            data: {
              valid: true,
              user: {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name || ''
              }
            }
          });
        } catch (jwtError) {
          // JWT verification failed - token invalid or expired
          return NextResponse.json({
            status: 'error',
            message: 'Invalid or expired token',
            data: { valid: false }
          }, { status: 401 });
        }
      } catch (error) {
        // Request processing error
        return NextResponse.json({
          status: 'error',
          message: 'Error validating token',
          data: { valid: false }
        }, { status: 500 });
      }
    };

    // Race the validation promise against the timeout
    return Promise.race([validationPromise(), responseTimeout]);
  } catch (error) {
    // Catch-all error handler
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error in token validation',
      data: { valid: false }
    }, { status: 500 });
  }
} 