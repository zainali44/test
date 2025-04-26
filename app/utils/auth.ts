import { jwtDecode } from "jwt-decode"

export interface JWTPayload {
  id: string
  email: string
  name?: string
  iat: number
  exp: number
}

export interface User {
  id: string
  email: string
  name?: string
}

// Client-side functions to store and retrieve user data

export function storeUserData(userData: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user-data', JSON.stringify(userData))
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
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token')
  }
  return null
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