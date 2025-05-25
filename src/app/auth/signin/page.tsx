'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import React, { Suspense } from 'react'

export default function SignIn() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-white">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}

function SignInContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push(callbackUrl)
    }
  }, [status, session, router, callbackUrl])

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/90 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated backgrounds and card for md+ */}
      <div className="hidden md:block">
        {/* Mesh gradient background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 50% 0%, rgb(30 58 138 / 0.15) 0px, transparent 50%),
              radial-gradient(at 0% 50%, rgb(30 58 138 / 0.15) 0px, transparent 50%),
              radial-gradient(at 50% 100%, rgb(30 58 138 / 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 50%, rgb(30 58 138 / 0.15) 0px, transparent 50%)
            `
          }}
        />
        {/* Floating orbs effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] bg-blue-950/20 rounded-full"
            style={{
              filter: 'blur(100px)',
              top: '20%',
              left: '10%',
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bg-blue-950/15 rounded-full"
            style={{
              filter: 'blur(100px)',
              top: '60%',
              right: '10%',
            }}
            animate={{
              x: [0, -50, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: 5,
            }}
          />
        </div>
        {/* Background elements */}
        <div className="absolute inset-0">
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-25"
            animate={{
              background: [
                'radial-gradient(circle at 20% 40%, rgba(37, 99, 235, 0.12) 0%, transparent 45%)',
                'radial-gradient(circle at 80% 60%, rgba(37, 99, 235, 0.12) 0%, transparent 45%)'
              ],
              transition: {
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }
            }}
          />
          {/* Dot pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(37_99_235_/_0.08)_1px,_transparent_0)] [background-size:24px_24px] opacity-25" />
          {/* Gradient overlays for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/80 pointer-events-none" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all duration-150 ease-in-out mb-8 group hover:gap-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Card className="relative p-8 rounded-2xl border-blue-900/50 bg-gradient-to-b from-blue-950/30 to-blue-950/10 backdrop-blur-sm shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:border-blue-800/50">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-2xl pointer-events-none" />
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">
                  Welcome to BidMe
                </h1>
                <p className="text-blue-300/80">
                  Sign in to start posting requests or making offers
                </p>
              </div>
              <div className="pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => signIn("google", { callbackUrl })}
                    className="w-full h-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center gap-3 text-base font-medium shadow-md transition-all duration-150 ease-in-out rounded-xl border border-slate-800/50 hover:scale-[1.02] hover:shadow-lg hover:border-blue-800/50 active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </motion.div>
              </div>
              <div className="text-sm text-blue-300/60">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      {/* Static backgrounds and card for mobile */}
      <div className="md:hidden w-full max-w-md mx-auto z-10">
        {/* Static mesh gradient background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: `
            radial-gradient(at 50% 0%, rgb(30 58 138 / 0.15) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgb(30 58 138 / 0.15) 0px, transparent 50%),
            radial-gradient(at 50% 100%, rgb(30 58 138 / 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 50%, rgb(30 58 138 / 0.15) 0px, transparent 50%)
          `
        }} />
        {/* Static dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(37_99_235_/_0.08)_1px,_transparent_0)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        {/* Gradient overlays for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/80 pointer-events-none" />
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all duration-150 ease-in-out mb-8 group hover:gap-3 mt-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Card className="relative p-8 rounded-2xl border-blue-900/50 bg-gradient-to-b from-blue-950/30 to-blue-950/10 backdrop-blur-sm shadow-lg transition-all duration-200 ease-in-out">
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">
                Welcome to BidMe
              </h1>
              <p className="text-blue-300/80">
                Sign in to start posting requests or making offers
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={() => signIn("google", { callbackUrl })}
                className="w-full h-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center gap-3 text-base font-medium shadow-md transition-all duration-150 ease-in-out rounded-xl border border-slate-800/50 hover:scale-[1.02] hover:shadow-lg hover:border-blue-800/50 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
            <div className="text-sm text-blue-300/60">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
