"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-8 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Connect with Suppliers<br />at Lightning Speed
        </h1>
        <h2 className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
          Simply post your request—see top suppliers deliver their best price, terms and delivery estimates instantly.
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/post-request">Tell Us What You Want</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/seller-signup">Start Selling Now</Link>
          </Button>
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
        >
          <ChevronRight className="h-6 w-6 rotate-90 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
} 