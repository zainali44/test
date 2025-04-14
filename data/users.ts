export interface User {
  id: number
  name: string
  category: "Guest" | "Host"
  joinDate: string
  email: string
  date: string // Changed from Date to string (ISO format)
}

// Generate dates within the last 30 days
const generateRandomDate = () => {
  const today = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  const date = new Date(today)
  date.setDate(today.getDate() - daysAgo)
  // Return ISO string for consistency
  return date.toISOString()
}

// Format date to string like "Jan 13, 2022"
const formatDate = (date: Date): string => {
  // Create a stable date format that doesn't depend on timezone
  // By using UTC methods we ensure consistent output between server and client
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[date.getUTCMonth()]
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  return `${month} ${day}, ${year}`
}

import { parseISO } from "date-fns"

export const users: User[] = [
  {
    id: 1,
    name: "Olivia Daddarrio",
    category: "Guest",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "olivia.d@example.com",
    date: generateRandomDate(),
  },
  {
    id: 2,
    name: "Jack Paul",
    category: "Host",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "jack.paul@example.com",
    date: generateRandomDate(),
  },
  {
    id: 3,
    name: "Mr Aaleexandar",
    category: "Guest",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "alex@example.com",
    date: generateRandomDate(),
  },
  {
    id: 4,
    name: "Arnold Archer",
    category: "Host",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "arnold.a@example.com",
    date: generateRandomDate(),
  },
  {
    id: 5,
    name: "Jack Paul",
    category: "Guest",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "jack.p@example.com",
    date: generateRandomDate(),
  },
  {
    id: 6,
    name: "Emma Watson",
    category: "Host",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "emma.w@example.com",
    date: generateRandomDate(),
  },
  {
    id: 7,
    name: "Michael Jordan",
    category: "Guest",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "michael.j@example.com",
    date: generateRandomDate(),
  },
  {
    id: 8,
    name: "Sophia Miller",
    category: "Host",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "sophia.m@example.com",
    date: generateRandomDate(),
  },
  {
    id: 9,
    name: "Daniel Smith",
    category: "Guest",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "daniel.s@example.com",
    date: generateRandomDate(),
  },
  {
    id: 10,
    name: "Olivia Brown",
    category: "Host",
    joinDate: formatDate(parseISO(generateRandomDate())),
    email: "olivia.b@example.com",
    date: generateRandomDate(),
  },
]
