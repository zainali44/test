import { useAuth } from "@/app/contexts/auth-context";
import { getCookie, getAuthToken } from "./auth";

// Cache for token validation to avoid excessive API calls
interface ValidationCache {
  result: boolean;
  timestamp: number;
  message?: string;
}

let validationCache: ValidationCache | null = null;
const CACHE_LIFETIME = 30000; // 30 seconds

/**
 * Validates the authentication token with the backend API
 * @returns An object containing validation result and any error message
 */
export async function validateAuthToken(): Promise<{ isValid: boolean; message?: string }> {
  try {
    // First check if token exists
    const token = getCookie('auth-token') || getAuthToken();
    
    if (!token) {
      return { isValid: false, message: "No authentication token found" };
    }
    
    // Check cache first
    if (validationCache && (Date.now() - validationCache.timestamp < CACHE_LIFETIME)) {
      console.log("Using cached token validation result:", validationCache.result);
      return { 
        isValid: validationCache.result, 
        message: validationCache.message 
      };
    }
    
    console.log("Calling external API to validate token");
    
    try {
      // Call the backend validation endpoint
      const response = await fetch('http://localhost:8000/users/validate-token', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      
      // Parse the response
      const data = await response.json();
      
      // Check for valid response structure
      if (typeof data.valid === 'undefined') {
        console.error("Invalid API response format:", data);
        return { isValid: false, message: "Invalid API response format" };
      }
      
      // Cache the result
      const result = !!data.valid;
      const message = data.message || (result ? undefined : "Invalid or expired token");
      
      console.log("Token validation result:", result, message);
      
      validationCache = {
        result,
        message,
        timestamp: Date.now()
      };
      
      return { 
        isValid: result,
        message
      };
    } catch (fetchError) {
      console.error("API call failed:", fetchError);
      // Don't cache failed API calls
      return { isValid: false, message: "Token validation API call failed" };
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return { 
      isValid: false, 
      message: "Error validating token" 
    };
  }
}

/**
 * Checks if the authentication token is valid and logs out the user if not
 * @returns A promise that resolves to true if the token is valid, false otherwise
 */
export async function checkTokenAndLogoutIfInvalid(): Promise<boolean> {
  // Get the auth context for logout functionality
  const auth = useAuth();
  
  try {
    const { isValid, message } = await validateAuthToken();
    
    if (!isValid) {
      console.log(`Token validation failed: ${message}. Logging out...`);
      // Log the user out
      await auth.logout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking token:", error);
    // Log the user out on error as a precaution
    await auth.logout();
    return false;
  }
} 