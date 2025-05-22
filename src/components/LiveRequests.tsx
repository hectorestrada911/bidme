"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { RequestWithUser, RequestStatus } from "@/types"
import Link from "next/link"

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.OPEN:
      return 'bg-green-500 text-green-900'
    case RequestStatus.PENDING:
      return 'bg-orange-500 text-orange-900'
    case RequestStatus.ACCEPTED:
      return 'bg-blue-500 text-blue-900'
    case RequestStatus.CANCELLED:
      return 'bg-red-500 text-red-900'
    case RequestStatus.COMPLETED:
      return 'bg-blue-500 text-blue-900'
    default:
      return 'bg-gray-500 text-gray-900'
  }
}

export function LiveRequests() {
  const [requests, setRequests] = useState<RequestWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.75 // Scroll 75% of viewport
    const targetScroll = container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/requests?all=true")
        if (!res.ok) {
          throw new Error('Failed to fetch requests')
        }
        const data = await res.json()
        if (Array.isArray(data)) {
          setRequests(data)
        } else {
          setRequests([])
        }
      } catch (err) {
        console.error('Error fetching requests:', err)
        setRequests([])
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  if (loading) {
    return (
      <div className="w-full py-12 space-y-6">
        <div className="grid grid-rows-2 grid-flow-col gap-6 px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[300px] sm:w-[350px] h-[220px] rounded-xl bg-blue-950/10 border border-blue-900/50 animate-pulse">
              <div className="h-full p-6 flex flex-col gap-4">
                <div className="h-6 bg-blue-900/20 rounded w-2/3" />
                <div className="space-y-3 flex-grow">
                  <div className="h-4 bg-blue-900/20 rounded w-full" />
                  <div className="h-4 bg-blue-900/20 rounded w-full" />
                  <div className="h-4 bg-blue-900/20 rounded w-full" />
                </div>
                <div className="h-10 bg-blue-900/20 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="text-gray-400 text-center">No live requests—be the first to post!</div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Two-row horizontal scroll layout */}
      <div className="relative group">
        {/* Gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0d12] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0d12] to-transparent z-10" />

        {/* Scroll buttons */}
        <button 
          onClick={() => scrollTo('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-blue-950/90 border border-blue-800/50 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-900/90 hover:text-blue-300 disabled:opacity-0"
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => scrollTo('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-blue-950/90 border border-blue-800/50 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-900/90 hover:text-blue-300 disabled:opacity-0"
          disabled={loading}
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Scrolling container */}
        <div 
          ref={scrollContainerRef}
          className="grid grid-rows-2 auto-cols-[300px] sm:auto-cols-[350px] grid-flow-col gap-6 overflow-x-auto pb-4 px-4 scrollbar-thin scrollbar-track-blue-950/20 scrollbar-thumb-blue-900/50 hover:scrollbar-thumb-blue-800/50 scroll-smooth"
        >
          {requests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="snap-start"
            >
              <Link href={`/requests/${req.id}`} className="block h-full group">
                <Card className="h-full rounded-xl border-blue-900/50 bg-blue-950/10 p-6 flex flex-col gap-4 shadow-lg hover:shadow-xl hover:bg-blue-950/30 transition-all duration-300 hover:scale-[1.02] hover:border-blue-800/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold truncate">{req.title}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`capitalize ${getStatusColor(req.status)}`}
                      >
                        {req.status.toLowerCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {req.description}
                        </p>
                        <Badge variant="outline">{req.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {req.quantity} items needed
                        </p>
                        <p className="text-sm font-medium">
                          ${req.budget.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Deadline: {new Date(req.deadline).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium">
                          {req._count.offers} offers
                        </p>
                      </div>
                      {req.statusHistory && req.statusHistory.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Last updated: {new Date(req.statusHistory[0].timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10 mt-4 group-hover:border-blue-300 group-hover:text-blue-300 transition-colors"
                  >
                    Make an Offer
                  </Button>
                </Card>
              </Link>
            </motion.div>
          ))}

          {/* Add Request Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="snap-start row-span-2 flex items-center"
          >
            <Link href="/post-request" className="h-full flex items-center px-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Post a Request
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>


    </div>
  )
}