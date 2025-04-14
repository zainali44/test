"use client"

import { Bell, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileSidebar } from "./mobile-sidebar"
import { motion } from "framer-motion"

export function Navbar() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4 md:px-6">
                <div className="md:hidden">
                    <MobileSidebar />
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    {/* Notification Bell */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" className="relative">
                            <svg width="33" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
                                <path d="M14 12.2737C13.5217 12.2737 13.125 11.877 13.125 11.3987V7.51367C13.125 7.03534 13.5217 6.63867 14 6.63867C14.4783 6.63867 14.875 7.03534 14.875 7.51367V11.3987C14.875 11.8887 14.4783 12.2737 14 12.2737Z" fill="black" />
                                <path d="M14.023 23.7413C11.013 23.7413 8.01468 23.263 5.15635 22.3063C4.09468 21.9563 3.28968 21.198 2.93968 20.2413C2.58968 19.2846 2.70635 18.188 3.27802 17.2313L4.75968 14.758C5.08635 14.2096 5.37802 13.183 5.37802 12.5413V10.0913C5.37802 5.31962 9.25135 1.44629 14.023 1.44629C18.7947 1.44629 22.668 5.31962 22.668 10.0913V12.5413C22.668 13.1713 22.9597 14.2096 23.2863 14.758L24.768 17.2313C25.3163 18.1413 25.4097 19.2263 25.048 20.218C24.6863 21.2096 23.893 21.968 22.8897 22.3063C20.0313 23.2746 17.033 23.7413 14.023 23.7413ZM14.023 3.20796C10.2197 3.20796 7.12802 6.29962 7.12802 10.103V12.553C7.12802 13.498 6.75468 14.863 6.26468 15.668L4.78302 18.153C4.47968 18.6546 4.40968 19.1913 4.58468 19.658C4.75968 20.1246 5.15635 20.4746 5.71635 20.6613C11.083 22.4463 16.9863 22.4463 22.353 20.6613C22.8547 20.498 23.2397 20.1246 23.4147 19.6346C23.6013 19.1446 23.543 18.608 23.2747 18.153L21.793 15.6796C21.303 14.8746 20.9297 13.5096 20.9297 12.5646V10.1146C20.918 6.29962 17.8263 3.20796 14.023 3.20796Z" fill="black" />
                                <path d="M14.0002 26.717C12.7519 26.717 11.5269 26.2037 10.6402 25.317C9.75357 24.4304 9.24023 23.2054 9.24023 21.957H10.9902C10.9902 22.7504 11.3169 23.5204 11.8769 24.0804C12.4369 24.6404 13.2069 24.967 14.0002 24.967C15.6569 24.967 17.0102 23.6137 17.0102 21.957H18.7602C18.7602 24.582 16.6252 26.717 14.0002 26.717Z" fill="black" />
                            </svg>

                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>
                    </motion.div>

                    {/* Language and Currency Selector */}
                    <motion.div
                        className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 h-8 px-2">
                                    <Globe className="h-5 w-5 text-gray-700" />
                                    <span className="font-medium text-gray-900">EN</span>
                                    <span className="text-gray-500 mx-2">|</span>
                                    <span className="font-medium text-gray-900">USD</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="cursor-pointer">English | USD</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Spanish | EUR</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">French | GBP</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>

                    {/* User Profile */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="rounded-full border-2 border-black p-0 h-10 pl-1 pr-2 flex items-center space-x-1"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://s3-alpha-sig.figma.com/img/34b4/c3f2/c4ce1c20eee6ff555a33155b5f3250c5?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=BhAKJKhe2RVcTC2qMsDYnq4GacTsMK6-u-HBDYkdDTjdgSXf71dZzqF-LVBkRXWsbP2vuOQJIvYZvi~7e~vrIXd9ivEAIP0KJeLfai2yES9g1mTqh03cjXBHESkUZUk5Q75EjHBmvFldni2WxTrA5DRG50fbi7nj4~1f2Wpkm0yvC2Q0xjpJt9l~dBYQHa~d-bAV9ti2Ubsb8VQWjjyD6SXeeFOpvIlKuX3Z3Wkhp5dybQahZeFCxORW5Z6r52eK0VTK~pPzl9jKHjL1C2Br6zSdVyFXbWjdM13ttxC0mFPGtboNUcXqIYCdv5j4k0UuT7WPOLml4QmSbR-pSms7Gw__" alt="User" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <ChevronDown className="h-4 w-4 text-gray-700" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-600">Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
