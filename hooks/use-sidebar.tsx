"use client"

import { create } from "zustand"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useEffect } from "react"

interface SidebarState {
  isOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  openSidebar: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set({ isOpen: false }),
  openSidebar: () => set({ isOpen: true }),
}))

export function useSidebar() {
  const { isOpen, toggleSidebar, closeSidebar, openSidebar } = useSidebarStore()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Set initial state based on screen size
  useEffect(() => {
    if (isDesktop) {
      openSidebar()
    } else {
      closeSidebar()
    }
  }, [isDesktop, openSidebar, closeSidebar])

  return { isOpen, toggleSidebar, closeSidebar, openSidebar }
}
