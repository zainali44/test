import { jwtDecode } from "jwt-decode"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key" // Use environment variable in production

export interface JWTPayload {
  id: string
  email: string
  iat: number
  exp: number
}

export async function createToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  // In a real application, you would use a proper JWT library
  // This is a simplified version for demonstration
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 60 * 24 * 7 // 7 days
  
  const encodedPayload = Buffer.from(
    JSON.stringify({
      ...payload,
      iat,
      exp,
    })
  ).toString("base64")
  
  const signature = await createSignature(`${encodedPayload}`, JWT_SECRET)
  
  return `${encodedPayload}.${signature}`
}

async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  )
  
  return Buffer.from(signature).toString("base64")
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

export function setAuthCookie(token: string): void {
  cookies().set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export function getAuthCookie(): string | undefined {
  return cookies().get("auth-token")?.value
}

export function removeAuthCookie(): void {
  cookies().delete("auth-token")
}

export function getCurrentUser(): JWTPayload | null {
  const token = getAuthCookie()
  if (!token) return null
  
  return verifyToken(token)
}

export function requireAuth(): JWTPayload {
  const user = getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export interface ApiResponse<T = any> {
  status: "success" | "error"
  data?: T
  message?: string
} 