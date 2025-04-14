// Generate dates within the last 30 days
const generateRandomDate = () => {
  const today = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  // Create a date object based on a fixed string to ensure stability
  const date = new Date(today)
  date.setDate(today.getDate() - daysAgo)
  // Convert to ISO string to make it stable across server/client
  return date.toISOString()
}

export interface Booking {
  id: number
  name: string
  status: "Completed" | "In Progress" | "Cancelled"
  price: string
  capacity: string
  duration: string
  date: string // Changed from Date to string (ISO format)
}

export const bookings: Booking[] = [
  {
    id: 1,
    name: "Olivia Daddarrio",
    status: "Completed",
    price: "$633.00",
    capacity: "60 (Seated)",
    duration: "24 May - 28 May 2024",
    date: generateRandomDate(),
  },
  {
    id: 2,
    name: "Jack Paul",
    status: "In Progress",
    price: "$231.00",
    capacity: "60 (Seated)",
    duration: "24 May - 28 May 2024",
    date: generateRandomDate(),
  },
  {
    id: 3,
    name: "Mr Aaleexandar",
    status: "Cancelled",
    price: "$260.00",
    capacity: "60 (Seated)",
    duration: "24 May - 28 May 2024",
    date: generateRandomDate(),
  },
  {
    id: 4,
    name: "Arnold Archer",
    status: "Completed",
    price: "$900.00",
    capacity: "60 (Seated)",
    duration: "24 May - 28 May 2024",
    date: generateRandomDate(),
  },
  {
    id: 5,
    name: "Emma Thompson",
    status: "Completed",
    price: "$450.00",
    capacity: "40 (Seated)",
    duration: "15 May - 18 May 2024",
    date: generateRandomDate(),
  },
  {
    id: 6,
    name: "Michael Johnson",
    status: "In Progress",
    price: "$550.00",
    capacity: "80 (Seated)",
    duration: "10 May - 15 May 2024",
    date: generateRandomDate(),
  },
  {
    id: 7,
    name: "Sophia Williams",
    status: "Cancelled",
    price: "$320.00",
    capacity: "30 (Seated)",
    duration: "5 May - 8 May 2024",
    date: generateRandomDate(),
  },
  {
    id: 8,
    name: "Daniel Brown",
    status: "Completed",
    price: "$780.00",
    capacity: "70 (Seated)",
    duration: "1 May - 5 May 2024",
    date: generateRandomDate(),
  },
]
