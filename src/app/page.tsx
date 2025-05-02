"use client"

import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
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