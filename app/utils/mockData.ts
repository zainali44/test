export interface Image {
    id: number
    src: string
    clientCategories: {
      [clientId: string]: string[]
    }
    status: "pending" | "approved" | "rejected" | "hold"
    feedback?: string
  }
  
  export interface Client {
    id: string
    name: string
    categories: string[]
  }
  
  export const mockImages: Image[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1738468054992-56653d21a0a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      clientCategories: {
        client1: ["Summer Collection"],
        client2: ["Outdoor"],
      },
      status: "pending",},
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1738468054992-56653d21a0a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      clientCategories: {
        client1: ["Winter Collection"],
        client3: ["Indoor"],
      },
      status: "approved",
      feedback: "Great image for our winter campaign!",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1738468054992-56653d21a0a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      clientCategories: {
        client1: ["Summer Collection"],
      },
      status: "rejected",
      feedback: "Image quality is too low.",
    },
    {
      id: 4,
      src: "/placeholder.svg",
      clientCategories: {
        client1: ["Accessories"],
      },
      status: "hold",
      feedback: "Need to discuss pricing before approval.",
    },
    {
      id: 5,
      src: "/placeholder.svg",
      clientCategories: {
        client1: ["Summer Collection"],
      },
      status: "pending",
    },
  ]
  
  export const mockClients: Client[] = [
    {
      id: "client1",
      name: "Fashion Co.",
      categories: ["Summer Collection", "Winter Collection", "Accessories"],
    },
    {
      id: "client2",
      name: "Outdoor Adventures",
      categories: ["Outdoor", "Camping", "Hiking"],
    },
    {
      id: "client3",
      name: "Home Decor Inc.",
      categories: ["Indoor", "Kitchen", "Living Room"],
    },
  ]
  
  