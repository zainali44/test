/**
 * Utility functions for authentication
 */

/**
 * Validates a token with the server
 * @param token - The authentication token to validate
 * @returns The validation result containing user data if valid
 */
export async function validateTokenWithServer(token: string) {
  try {
    // Get the full URL for API requests
    let baseUrl = '';
    
    // Check if we're running on the client side
    if (typeof window !== 'undefined') {
      // Use current window location for client-side requests
      baseUrl = window.location.origin;
    } else {
      // For server-side, use environment variable or default
      baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    }
    
    // Use absolute URL to avoid parsing errors
    const validationUrl = `${baseUrl}/api/auth/validate-token`;
    console.log("Calling token validation endpoint:", validationUrl);
    
    const response = await fetch(validationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to validate token');
    }

    const data = await response.json();
    
    return {
      valid: data.valid || false,
      user: data.user || data.data?.user || null,
      message: data.message || ''
    };
  } catch (error: any) {
    console.error('Error validating token:', error);
    return {
      valid: false,
      user: null,
      message: error.message || 'Failed to validate token'
    };
  }
}

/**
 * Fetches user profile data directly from validate-token endpoint
 * This is a workaround to avoid creating a separate endpoint
 * @param token - The authentication token
 * @returns The user profile data
 */
export async function fetchUserProfile(token: string) {
  try {
    // Use the validate-token endpoint directly to get user data
    const validationResult = await validateTokenWithServer(token);
    
    if (!validationResult.valid) {
      throw new Error(validationResult.message || 'Failed to fetch user profile: Invalid token');
    }
    
    return {
      success: true,
      data: validationResult.user,
      message: 'User profile fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch user profile'
    };
  }
}

/**
 * Updates user profile data
 * @param token - The authentication token
 * @param profileData - The new profile data to save
 * @returns The updated user profile
 */
export async function updateUserProfile(token: string, profileData: any) {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user profile');
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data || null,
      message: data.message || ''
    };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to update user profile'
    };
  }
} 