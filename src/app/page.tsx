"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Lock, Star, Shield, Quote } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] bg-gradient-to-b from-background to-muted">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center space-y-8 text-center px-4 max-w-[1200px] mx-auto"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Connect with Suppliers<br />at Lightning Speed
        </h1>
        <p className="max-w-xl mx-auto text-lg text-muted-foreground/80 sm:text-xl">
          Simply post your request—see top <span className="font-semibold text-white">verified</span> suppliers<br className="hidden sm:block" /> deliver their best price, terms and delivery estimates instantly.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="px-8 hover:scale-105 transition-transform">
            <Link href="/post-request">Tell Us What You Want</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/seller-signup">Start Selling Now</Link>
          </Button>
        </div>
        
        {/* Trust Indicators */}
        <div className="w-full max-w-3xl mx-auto pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground/80"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-blue-500" />
              <span>1,200+ Transactions Secured</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4 text-blue-500" />
              <span>4.8/5 Average Rating</span>
              <span className="text-xs opacity-60">(300+ reviews)</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-blue-500" />
              <span>24/7 Support</span>
            </motion.div>
          </motion.div>

          {/* Micro-testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-sm text-muted-foreground/60 flex items-center justify-center gap-2"
          >
            <Quote className="h-3 w-3 text-blue-500/70" />
            <p className="italic">
              BidMe cut our sourcing time by 80% and saved us $50K in Q1 alone.
              <span className="ml-1 font-medium not-italic">– TechCorp Industries</span>
            </p>
          </motion.div>
        </div>

        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="mt-8"
        >
          <ChevronRight className="h-6 w-6 rotate-90 text-muted-foreground/60" />
        </motion.div>
      </motion.div>
    </section>
  )
} 