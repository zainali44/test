import { getAuthToken } from './auth';
import { jwtDecode } from 'jwt-decode';

// Define JWTPayload interface for token decoding
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

// Get base API URL from environment
export const getApiBaseUrl = () => {
  return process.env.NEXT_API || 'http://localhost:8000';
};

// Helper function to get token either from parameter or from auth utility
const getToken = (passedToken?: string | null) => {
  if (passedToken && passedToken.length > 0) return passedToken;
  return getAuthToken();
};

// Helper function to extract error messages from API responses
const extractErrorMessage = (data: any, defaultMessage: string): string => {
  // Handle string error
  if (typeof data === 'string') {
    return data;
  }
  
  // Handle common error formats
  if (data && typeof data === 'object') {
    // Direct error or message fields
    if (data.error) return data.error;
    if (data.message) return data.message;
    
    // Validation errors
    if (data.details && Array.isArray(data.details) && data.details.length > 0) {
      return data.details[0].message;
    }
    
    // Try to find any error-like field
    const errorKeys = Object.keys(data).filter(k => 
      k.toLowerCase().includes('error') || 
      k.toLowerCase().includes('message') ||
      k.toLowerCase() === 'reason'
    );
    
    if (errorKeys.length > 0) {
      return data[errorKeys[0]];
    }
    
    // Last resort: stringify the object
    if (Object.keys(data).length > 0) {
      try {
        return JSON.stringify(data);
      } catch (e) {
        // If JSON stringify fails
        return defaultMessage;
      }
    }
  }
  
  // Default message if all else fails
  return defaultMessage;
};

// Update user profile (name and email)
export async function updateUserProfile(name: string, email: string, token?: string | null) {
  const authToken = getToken(token);
  if (!authToken) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ name, email })
    });

    const data = await response.json();
    console.log('Profile update API response:', data);

    if (!response.ok) {
      // For 401, check if it's actually session expired
      if (response.status === 401) {
        if (data.error && !data.error.includes('expired')) {
          throw new Error(data.error);
        }
        throw new Error('Your session has expired. Please login again.');
      }
      
      // Extract error message directly from API response with thorough checks
      let errorMessage;
      
      if (typeof data === 'string') {
        // Handle case where API returns string error
        errorMessage = data;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.details && Array.isArray(data.details) && data.details.length > 0) {
        errorMessage = data.details[0].message;
      } else if (typeof data === 'object' && Object.keys(data).length > 0) {
        // Try to extract any error-like field from the response
        const errorKeys = Object.keys(data).filter(k => 
          k.toLowerCase().includes('error') || 
          k.toLowerCase().includes('message') ||
          k.toLowerCase() === 'reason'
        );
        
        if (errorKeys.length > 0) {
          errorMessage = data[errorKeys[0]];
        } else {
          // Last resort: stringified object
          errorMessage = JSON.stringify(data);
        }
      } else {
        errorMessage = 'Failed to update profile';
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}

// Update user password
export async function updateUserPassword(currentPassword: string, newPassword: string, token?: string | null) {
  const authToken = getToken(token);
  if (!authToken) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();
    console.log('Password update API response:', data);

    if (!response.ok) {
      // For 401, check if it's an actual auth error or just wrong password
      if (response.status === 401) {
        // Look for specific error about incorrect password
        if (data.error && data.error.includes('incorrect')) {
          throw new Error(data.error);
        }
        throw new Error('Your session has expired. Please login again.');
      }
      
      // Extract error message directly from API response with thorough checks
      let errorMessage;
      
      if (typeof data === 'string') {
        // Handle case where API returns string error
        errorMessage = data;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.details && Array.isArray(data.details) && data.details.length > 0) {
        errorMessage = data.details[0].message;
      } else if (typeof data === 'object' && Object.keys(data).length > 0) {
        // Try to extract any error-like field from the response
        const errorKeys = Object.keys(data).filter(k => 
          k.toLowerCase().includes('error') || 
          k.toLowerCase().includes('message') ||
          k.toLowerCase() === 'reason'
        );
        
        if (errorKeys.length > 0) {
          errorMessage = data[errorKeys[0]];
        } else {
          // Last resort: stringified object
          errorMessage = JSON.stringify(data);
        }
      } else {
        errorMessage = 'Failed to update password';
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
}

// Request password reset
export async function requestPasswordReset(email: string) {
  const response = await fetch(`${getApiBaseUrl()}/users/reset-password-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract error message directly from API response
    const errorMessage = data.error || data.message || data.details?.[0]?.message || 'Failed to request password reset';
    throw new Error(errorMessage);
  }

  return data;
}

// Upload profile image
export async function uploadProfileImage(file: File, token?: string | null) {
  const authToken = getToken(token);
  if (!authToken) {
    throw new Error('Authentication required');
  }

  try {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await fetch(`${getApiBaseUrl()}/users/profile-image`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    const data = await response.json();
    console.log('Profile image upload API response:', data);

    if (!response.ok) {
      // For 401, check if it's actually session expired
      if (response.status === 401 && data.error && !data.error.includes('expired')) {
        throw new Error(data.error);
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please login again.');
      }
      
      const errorMessage = extractErrorMessage(data, 'Failed to upload profile image');
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Profile image upload error:', error);
    throw error;
  }
}

// Request email verification
export async function requestEmailVerification(token?: string | null) {
  const authToken = getToken(token);
  if (!authToken) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/users/verify-email`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    console.log('Email verification API response:', data);

    if (!response.ok) {
      // For 401, check if it's actually session expired
      if (response.status === 401 && data.error && !data.error.includes('expired')) {
        throw new Error(data.error);
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please login again.');
      }
      
      const errorMessage = extractErrorMessage(data, 'Failed to verify email');
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
}

// Validate auth token
export async function validateToken(token: string) {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const apiBaseUrl = getApiBaseUrl();
    
    // Skip local API validation and use server endpoint directly
    console.log("Directly validating token with server API");
    const serverApiUrl = `${apiBaseUrl}/users/validate-token`;
    console.log("Calling server endpoint:", serverApiUrl);
    
    try {
      const serverResponse = await fetch(serverApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      });
      
      console.log("Server API response status:", serverResponse.status);
      const data = await serverResponse.json();
      console.log('Server token validation response:', data);
      
      if (!serverResponse.ok) {
        console.log("Server validation failed with status:", serverResponse.status);
        throw new Error(extractErrorMessage(data, 'Token validation failed'));
      }
      
      // Normalize user data from server response
      const userData = data.user || {};
      const normalizedUser = {
        id: userData.id || userData.userId || userData.user_id,
        email: userData.email,
        name: userData.name,
        isVerified: userData.isVerified || userData.is_verified || userData.verified || userData.isVerifiedEmail || userData.emailVerified || false,
        imageBase64: userData.imageBase64 || userData.profileImageBase64 || null,
        profilePicture: userData.profilePicture || userData.profile_picture || userData.avatar || userData.imageBase64 || null,
        created_at: userData.created_at || userData.createdAt || null,
        passwordChangedAt: userData.passwordChangedAt || userData.password_changed_at || null
      };
      
      // Handle different response formats from server API
      // Normalize to a standard structure
      const normalized = {
        valid: data.valid === true || data.status === 'success',
        message: data.message || 'Token valid',
        user: normalizedUser
      };
      
      return normalized;
    } catch (serverError) {
      console.error('Server token validation failed:', serverError);
      
      // If server validation fails, fall back to local validation
      console.log("Falling back to local validation");
      
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
      
      const localApiUrl = `${baseUrl}/api/auth/validate-token`;
      console.log("Trying local API endpoint:", localApiUrl);
      
      const response = await fetch(localApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({ token }),
        credentials: 'include' // Include cookies in the request
      });
      
      console.log("Local API response status:", response.status);
      
      if (!response.ok) {
        throw serverError; // If local also fails, throw original server error
      }
      
      const data = await response.json();
      console.log('Local token validation response:', data);
      
      // Helper function to normalize user data
      const normalizeUserData = (userData: any) => {
        if (!userData) return null;
        return {
          id: userData.id || userData.userId || userData.user_id,
          email: userData.email,
          name: userData.name,
          isVerified: userData.isVerified || userData.is_verified || userData.verified || userData.isVerifiedEmail || userData.emailVerified || false,
          imageBase64: userData.imageBase64 || userData.profileImageBase64 || null,
          profilePicture: userData.profilePicture || userData.profile_picture || userData.avatar || userData.imageBase64 || null,
          created_at: userData.created_at || userData.createdAt || null,
          passwordChangedAt: userData.passwordChangedAt || userData.password_changed_at || null
        };
      };
      
      // Normalize response structure for different API formats
      if (data.status === 'success' && data.data) {
        // Our API format with nested data
        return {
          valid: data.data.valid === true,
          message: data.data.message || 'Token validated',
          user: normalizeUserData(data.data.user)
        };
      } else if (data.valid !== undefined) {
        // Direct format with valid field at top level
        return {
          valid: data.valid === true,
          message: data.message || 'Token validated',
          user: normalizeUserData(data.user)
        };
      }
      
      // If we have user data at the top level
      if (data.user) {
        return {
          valid: true,
          message: 'Token validated',
          user: normalizeUserData(data.user)
        };
      }
      
      // Default structure if we can't determine the format
      return {
        valid: false,
        message: 'Invalid response format',
        user: null
      };
    }
  } catch (error) {
    console.error('Token validation error:', error);
    throw error;
  }
}

// Reset password with token
export async function resetPasswordWithToken(token: string, newPassword: string) {
  try {
    const response = await fetch(`${getApiBaseUrl()}/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({ token, newPassword })
    });

    const data = await response.json();
    console.log('Password reset API response:', data);

    if (!response.ok) {
      const errorMessage = extractErrorMessage(data, 'Failed to reset password');
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

// Get user transactions
export async function getUserTransactions(userId: string, token?: string | null) {
  const authToken = getToken(token);
  if (!authToken) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/users/transactions/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    console.log('User transactions API response:', data);

    if (!response.ok) {
      // For 401, check if it's actually session expired
      if (response.status === 401 && data.error && !data.error.includes('expired')) {
        throw new Error(data.error);
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please login again.');
      }
      
      const errorMessage = extractErrorMessage(data, 'Failed to get user transactions');
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('User transactions error:', error);
    throw error;
  }
}

// Get user's active subscription plan
export async function getActivePlan(userId: string, token?: string | null) {
  const authToken = getToken(token);
  if (!authToken) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/users/active-plan/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    console.log('Active plan API response:', data);

    // 404 is acceptable for active plan (user might not have a plan)
    if (!response.ok && response.status !== 404) {
      // For 401, check if it's actually session expired
      if (response.status === 401 && data.error && !data.error.includes('expired')) {
        throw new Error(data.error);
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please login again.');
      }
      
      const errorMessage = extractErrorMessage(data, 'Failed to get active plan');
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Active plan error:', error);
    throw error;
  }
}

// Utility function to check if a user is verified, handling all possible response structures
export function isUserVerified(userData: any, validationData?: any): boolean {
  // No user data means not verified
  if (!userData && !validationData) return false;
  
  // Special case for the API response structure:
  // { "resultHasData": false, "validationData": ["valid", "message", "user"], "isValid": true, "userDataExists": true }
  if (validationData && validationData.isValid === true && validationData.userDataExists === true) {
    return true;
  }
  
  // Check all possible field names for verification status
  if (userData) {
    return (
      userData.isVerified === true ||
      userData.is_verified === true ||
      userData.verified === true ||
      userData.isVerifiedEmail === true ||
      userData.emailVerified === true
    );
  }
  
  return false;
}

// Debug verification status and return result
export function debugVerificationStatus(userData: any, validationData?: any): { isVerified: boolean, details: any } {
  // Collect detailed information for debugging
  const details = {
    userDataExists: !!userData,
    validationDataExists: !!validationData,
    userFields: userData ? Object.keys(userData) : [],
    validationFields: validationData ? Object.keys(validationData) : [],
    userVerificationFields: {
      isVerified: userData?.isVerified,
      is_verified: userData?.is_verified,
      verified: userData?.verified,
      isVerifiedEmail: userData?.isVerifiedEmail,
      emailVerified: userData?.emailVerified
    },
    specialCaseApplies: validationData?.isValid === true && validationData?.userDataExists === true
  };
  
  // Calculate verification status
  const isVerified = isUserVerified(userData, validationData);
  
  return { isVerified, details };
} 