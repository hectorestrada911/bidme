"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

interface Request {
  id: string
  item: string
  quantity: number
  budget: number
  neededBy: string
  createdAt: string
}

export function LiveRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/requests")
        const data = await res.json()
        setRequests(data)
      } catch (err) {
        setRequests([])
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

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
        {loading ? (
          <div className="text-gray-400 text-center">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-gray-400 text-center">No live requests—be the first to post!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {requests.map((req) => (
              <Card key={req.id} className="rounded-lg border border-gray-800 bg-[#0f1318] p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="text-lg font-semibold text-white mb-2">{req.item}</h3>
                <div className="text-gray-400 text-sm space-y-1">
                  <div>Quantity: {req.quantity}</div>
                  <div>Budget: ${req.budget}</div>
                  <div>Needed by: {new Date(req.neededBy).toLocaleDateString()}</div>
                </div>
                <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10 mt-4">
                  Make an Offer
                </Button>
              </Card>
            ))}
          </div>
        )}
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