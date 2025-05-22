"use client"

import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { 
  ChevronRight, Lock, Star, Shield,
  Briefcase, ShoppingBag, Home as HomeIcon, Wrench, Camera, Laptop,
  ArrowRight, Clock, TrendingDown, Users2
} from "lucide-react"
import Link from "next/link"
import { LiveRequests } from "../components/LiveRequests"

import { CATEGORY_OPTIONS, CATEGORY_ICONS } from '@/lib/categories'

const categories = [
  { name: "Business Services", icon: Briefcase },
  { name: "Products", icon: ShoppingBag },
  { name: "Home Services", icon: HomeIcon },
  { name: "Professional Work", icon: Wrench },
  { name: "Creative Services", icon: Camera },
  { name: "Technology", icon: Laptop },
]

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950/50 via-[#0d1219] to-[#0a0d12]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
              <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" className="text-blue-400/30"/>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" className="text-blue-400/20"/>
          </svg>
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-[#0d1219]/95 to-[#0a0d12] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-600/5 pointer-events-none" />
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] pointer-events-none" />
        
        {/* Floating Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          {/* Left side features */}
          <motion.div
            initial={{ x: -100, y: '50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute left-[10%] top-1/2 transform -translate-y-1/2 bg-blue-600/5 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/10 shadow-lg shadow-blue-500/5"
          >
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-300">Quick Response Time</span>
            </div>
          </motion.div>

          {/* Right side features */}
          <motion.div
            initial={{ x: 100, y: '30%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute right-[10%] top-1/3 transform -translate-y-1/2 bg-blue-600/5 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/10 shadow-lg shadow-blue-500/5"
          >
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-300">Lower Costs</span>
            </div>
          </motion.div>

          {/* Bottom feature */}
          <motion.div
            initial={{ x: 50, y: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="absolute right-[20%] bottom-[20%] bg-blue-600/5 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/10 shadow-lg shadow-blue-500/5"
          >
            <div className="flex items-center space-x-3">
              <Users2 className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-300">Verified Suppliers</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative flex flex-col items-center space-y-6 text-center px-4 max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 rounded-full px-3 py-1">
              <span className="text-blue-300 text-sm font-medium tracking-wider">TRUSTED BY BUSINESSES</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400"></span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Your Request,
              <br className="hidden sm:block" />{" "}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-transparent bg-clip-text inline-block">Their Best Offers</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed"
          >
            Post your request once, receive multiple competitive offers, and choose the best deal for your business.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/post-request" passHref>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:to-blue-500 text-white px-8 py-6 text-lg rounded-xl relative overflow-hidden group shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02]"
              >
                <span className="relative z-10">Post Your Request</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Button>
            </Link>
            <Link href="/requests" passHref>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-400 text-blue-400 hover:bg-blue-400/10 px-8 py-6 text-lg rounded-xl group transition-colors"
              >
                Browse Requests
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Requests Section */}
      <section className="py-16 bg-[#0d1219]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white">Latest Requests</h2>
              <p className="text-sm text-gray-400 mt-1">Real-time opportunities</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/requests" className="group flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View all
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#0a0d12]/50 rounded-xl p-6"
          >
            <LiveRequests />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[#0a0d12]/80">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              <Link href={`/requests?category=${category.name}`} key={category.name}>
                <Card className="p-8 text-center hover:bg-blue-950/30 transition-all duration-300 cursor-pointer bg-blue-950/10 border-blue-900/50 h-full hover:scale-105">
                  <category.icon className="h-10 w-10 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-base font-medium text-gray-200">{category.name}</h3>
                </Card>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-[#0a0d12]/80">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6">
              <Shield className="h-8 w-8 mx-auto mb-3 text-blue-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Secure Payments</h3>
              <p className="text-sm text-gray-400">Money held in escrow until you approve</p>
            </div>

            <div className="text-center p-6">
              <Star className="h-8 w-8 mx-auto mb-3 text-blue-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Verified Sellers</h3>
              <p className="text-sm text-gray-400">All sellers are vetted and rated</p>
            </div>

            <div className="text-center p-6">
              <Lock className="h-8 w-8 mx-auto mb-3 text-blue-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Buyer Protection</h3>
              <p className="text-sm text-gray-400">100% money-back guarantee</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}