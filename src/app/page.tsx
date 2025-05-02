"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Lock, Star, Shield, Quote, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <section className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-950/50 via-[#0d1219] to-[#0a0d12] overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-background/20 to-[#0a0d12]/80 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center space-y-6 text-center px-4 max-w-[1200px] mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white"
        >
          Get the Best Deal on{" "}
          <span className="text-blue-400">Anything</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl"
        >
          Post what you want, and let sellers compete to give you the best price. 
          No more endless searching or haggling.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <Link href="/post-request" passHref>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Tell Us What You Want
            </Button>
          </Link>
          <Link href="/seller-signup" passHref>
            <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
              Start Selling Now
            </Button>
          </Link>
        </motion.div>
        
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
          <Link href="#how-it-works" className="text-blue-400 hover:text-blue-300 transition-colors">
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
} 