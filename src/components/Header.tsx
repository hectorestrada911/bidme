"use client"
import Link from 'next/link'
import { Button } from './ui/button'
import { useSession, signIn, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Menu } from "lucide-react"
import Image from "next/image"
import React from "react"

export default function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  return (
    <header className="w-full bg-[#0a0d12]/80 backdrop-blur-sm border-b border-blue-900/50 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-1 group">
          <span className="bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text group-hover:to-blue-400 transition-all duration-300">BidMe</span>
          <span className="text-blue-400 text-sm font-normal">beta</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/suppliers">
            <Button 
              variant="outline"
              size="sm"
              className="text-blue-400 hover:text-blue-300"
            >
              Browse Requests
            </Button>
          </Link>
          <Link href="/post-request">
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02]"
            >
              Post Request
            </Button>
          </Link>
          {status === "loading" ? null : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative h-8 w-8 rounded-full"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-blue-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0a0d12] border-blue-900/50">
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-950/50 focus:bg-blue-950/50">
                    <User className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-blue-950/50 focus:bg-blue-950/50"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4 text-blue-400" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                <Menu className="h-6 w-6 text-blue-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#0a0d12] border-blue-900/50">
              <Link href="/suppliers" onClick={() => setMobileMenuOpen(false)}>
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-950/50 focus:bg-blue-950/50">
                  Browse Requests
                </DropdownMenuItem>
              </Link>
              <Link href="/post-request" onClick={() => setMobileMenuOpen(false)}>
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-950/50 focus:bg-blue-950/50">
                  Post Request
                </DropdownMenuItem>
              </Link>
              {status === "loading" ? null : session ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <DropdownMenuItem className="cursor-pointer hover:bg-blue-950/50 focus:bg-blue-950/50">
                      <User className="mr-2 h-4 w-4 text-blue-400" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-blue-950/50 focus:bg-blue-950/50"
                    onClick={() => { setMobileMenuOpen(false); signOut(); }}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-950/50 focus:bg-blue-950/50">
                    Login
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}