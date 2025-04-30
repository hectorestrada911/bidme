'use client'

import { Button } from "../components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

const sampleRequests = [
  {
    id: 1,
    item: "LED Bulbs",
    quantity: 500,
    deadline: "June 30, 2024",
    budget: "$2,000",
  },
  {
    id: 2,
    item: "Office Chairs",
    quantity: 50,
    deadline: "July 10, 2024",
    budget: "$4,500",
  },
  {
    id: 3,
    item: "Laptops (i5, 16GB)",
    quantity: 20,
    deadline: "July 5, 2024",
    budget: "$15,000",
  },
  {
    id: 4,
    item: "Printer Paper (A4)",
    quantity: 10000,
    deadline: "June 25, 2024",
    budget: "$1,200",
  },
  {
    id: 5,
    item: "Coffee Beans",
    quantity: 200,
    deadline: "July 1, 2024",
    budget: "$800",
  },
  {
    id: 6,
    item: "Solar Panels (400W)",
    quantity: 100,
    deadline: "July 15, 2024",
    budget: "$35,000",
  }
]

export function LiveRequests() {
  return (
    <section className="bg-[#0a0d12] py-24">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold text-center mb-8 text-white"
        >
          Live Requests
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {sampleRequests.map((req, index) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg border border-gray-800 bg-[#0f1318] p-6 flex flex-col gap-4 shadow-sm"
            >
              <div className="font-semibold text-lg text-white">{req.item}</div>
              <div className="text-gray-400 text-sm">Quantity: <span className="text-white font-medium">{req.quantity}</span></div>
              <div className="text-gray-400 text-sm">Needed by: <span className="text-white font-medium">{req.deadline}</span></div>
              <div className="text-gray-400 text-sm">Budget: <span className="text-white font-medium">{req.budget}</span></div>
              <Link href={`/request/${req.id}`}>
                <Button variant="outline" className="mt-2 w-full">View Details</Button>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center"
        >
          <Link href="/post-request">
            <Button size="lg">Tell Us What You Want</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 