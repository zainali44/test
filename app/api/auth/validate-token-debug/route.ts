import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/app/utils/profileApi';

// Define a type for the response from validateToken
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

// This is a debug endpoint to troubleshoot token validation response format
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Test token validation with different methods
    // Direct call to the original validateToken function
    const directValidation = await validateToken(token) as TokenValidationResponse;
    
    // We also need a more flexible type to handle additional properties that might exist
    const anyValidation = directValidation as any;
    
    // Log the response structure
    console.log('=== Token Validation Debug ===');
    console.log('Original response:', directValidation);
    console.log('Response type:', typeof directValidation);
    console.log('JSON structure:', JSON.stringify(directValidation));
    console.log('Keys:', Object.keys(directValidation));
    console.log('Has valid property:', directValidation.hasOwnProperty('valid'));
    console.log('Has user property:', directValidation.hasOwnProperty('user'));
    
    // Check for user object directly - removed nested .data check
    const user = directValidation.user;
                
    if (user) {
      console.log('User data:', user);
      console.log('User verified field:', user.isVerified);
    }
    
    // Create normalized structure for client
    const normalizedResponse = {
      original: directValidation,
      normalized: {
        valid: directValidation.valid === true || 
              (anyValidation.isValid === true),
        user: user,
        // Include all possible verification fields
        verification: {
          isVerified: user ? (
            user.isVerified === true ||
            (user as any).is_verified === true || 
            (user as any).verified === true || 
            (user as any).isVerifiedEmail === true || 
            (user as any).emailVerified === true
          ) : false,
          // Add special case for API response format
          specialCase: (anyValidation.isValid === true) && (anyValidation.userDataExists === true),
          combinedVerification: false // Will be set below
        }
      }
    };
    
    // Set the combined verification status
    normalizedResponse.normalized.verification.combinedVerification = 
      normalizedResponse.normalized.verification.isVerified ||
      normalizedResponse.normalized.verification.specialCase;
    
    return NextResponse.json(normalizedResponse);
  } catch (error) {
    console.error('Token validation debug error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 