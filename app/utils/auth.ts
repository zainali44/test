import { jwtDecode } from "jwt-decode"

export interface JWTPayload {
  id: string
  email: string
  name?: string
  iat: number
  exp: number
}

export interface Plan {
  plan_id: number
  name: string
  description: string
  price: string
  billing_cycle: string
  created_at: string
}

export interface Subscription {
  subscription_id: number
  user_id: number
  plan_id: number
  status: string
  start_date: string
  end_date: string
  next_billing_date: string
  created_at: string
  plan?: Plan
}

export interface User {
  [x: string]: any
  id: string
  email: string
  name?: string
  subscriptions?: Subscription[]
}

// Function to get cookie by name
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null; // Return null if running server-side
  }
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Client-side functions to store and retrieve user data

export function storeUserData(userData: User): void {
  if (typeof window !== 'undefined') {
    try {
      // Create a safe copy of user data without large image data
      const safeUserData = { ...userData };
      
      // Remove large image data fields to avoid exceeding localStorage quota
      if (safeUserData.profilePicture && (
          safeUserData.profilePicture.startsWith('data:image') || 
          safeUserData.profilePicture.length > 1000
      )) {
        // Store a flag that image exists but don't store the actual data
        safeUserData.profilePicture = '[IMAGE_DATA_EXISTS]';
      }
      
      // Remove other potential large data fields
      if (safeUserData.imageBase64) {
        delete safeUserData.imageBase64;
      }
      
      // Store the safe version of user data
      localStorage.setItem('user-data', JSON.stringify(safeUserData));
    } catch (error) {
      console.error('Error storing user data in localStorage:', error);
      
      // If storage fails, try with even less data
      try {
        // Minimal user data with only essential fields
        const minimalUserData = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          isVerifiedEmail: userData.isVerifiedEmail
        };
        
        localStorage.setItem('user-data', JSON.stringify(minimalUserData));
      } catch (fallbackError) {
        console.error('Failed to store even minimal user data:', fallbackError);
      }
    }
  }
}

export function getUserData(): User | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user-data')
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error('Error parsing user data from storage:', error)
        return null
      }
    }
  }
  return null
}

export function clearUserData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user-data')
  }
}

export function storeAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', token)
  }
}

export function getAuthToken(): string | null {
  // Try to get token from localStorage first
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('auth-token');
    if (localToken) {
      return localToken;
    }
    
    // If not in localStorage, try to get from cookie
    const cookieToken = getCookie('auth-token') || getCookie('ls-auth-token');
    if (cookieToken) {
      // Save to localStorage for future use
      localStorage.setItem('auth-token', cookieToken);
      return cookieToken;
    }
  }
  return null;
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token')
  }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000)
    if (decoded.exp < currentTime) {
      return null
    }
    
    return decoded
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export interface ApiResponse<T = any> {
  status: "success" | "error"
  data?: T
  message?: string
}