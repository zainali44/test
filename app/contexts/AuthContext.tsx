"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

type User = {
  id: string
  role: "admin" | "client"
  name: string
  username: string
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userId: string, updates: Partial<User>) => void
  generateClientToken: (clientId: string) => string
  verifyClientToken: (token: string) => User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string) => {
    // This is a mock login. In a real app, you'd validate against a backend.
    if (username === "admin" && password === "admin") {
      const adminUser: User = { id: "1", role: "admin", name: "Admin User", username: "admin" }
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
    } else if (username === "client" && password === "client") {
      const clientUser: User = { id: "2", role: "client", name: "Client User", username: "client" }
      setUser(clientUser)
      localStorage.setItem("user", JSON.stringify(clientUser))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (userId: string, updates: Partial<User>) => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
    // In a real application, you would also make an API call to update the user on the backend
  }

  const generateClientToken = (clientId: string) => {
    // In a real application, you would use a proper JWT library and a crest secret
    const token = btoa(JSON.stringify({ clientId, exp: Date.now() + 3600000 })) // 1 hour expiration
    return token
  }

  const verifyClientToken = (token: string): User | null => {
    try {
      const decoded = jwtDecode(token) as { clientId: string; exp: number }
      if (decoded.exp < Date.now()) {
        return null // Token has expired
      }
      // In a real application, you would fetch the user data from your backend
      const clientUser: User = { id: decoded.clientId, role: "client", name: "Client User", username: "client" }
      return clientUser
    } catch (error) {
      console.error("Invalid token:", error)
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, generateClientToken, verifyClientToken }}>
      {children}
    </AuthContext.Provider>
  )
}

