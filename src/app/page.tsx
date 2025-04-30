"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Lock, Star, Shield } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-40 pb-32 bg-gradient-to-b from-background via-background to-muted">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center space-y-6 text-center px-4"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Connect with Suppliers<br />at Lightning Speed
        </h1>
        <h2 className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
          Simply post your request—see top <span className="font-semibold text-white">verified</span> suppliers deliver their best price, terms and delivery estimates instantly.
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/post-request">Tell Us What You Want</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/seller-signup">Start Selling Now</Link>
          </Button>
        </div>
        
        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground/80"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Lock className="h-4 w-4 text-blue-500" />
            <span>1,200+ Transactions Secured</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-blue-500" />
              <span>4.8/5 Average Rating</span>
              <span className="text-xs opacity-60">(300+ reviews)</span>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Shield className="h-4 w-4 text-blue-500" />
            <span>24/7 Support</span>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <ChevronRight className="h-6 w-6 rotate-90 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
} 