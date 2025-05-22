"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from '@/components/ui/badge'
import { CATEGORY_OPTIONS } from '@/lib/categories'

interface Request {
  id: string
  title: string
  description: string
  budget: number
  deadline: string
  category: string
  quantity: number
  status: string
  userId: string
  user: {
    name: string | null
    image: string | null
  }
  _count: {
    offers: number
  }
  statusHistory: {
    id: string
    status: string
    timestamp: string
    reason?: string
  }[]
  acceptedOfferId?: string | null
}

export default function RequestBrowserPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const categories = CATEGORY_OPTIONS

  useEffect(() => {
    async function fetchRequests() {
      try {
        const url = new URL("/api/requests", window.location.origin)
        if (selectedCategory) {
          url.searchParams.append('category', selectedCategory)
        }
        url.searchParams.append('all', 'true')

        const res = await fetch(url.toString())
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch requests')
        }
        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }
        if (Array.isArray(data)) {
          setRequests(data)
        } else {
          setRequests([])
          setError('Invalid response format from server')
        }
      } catch (err) {
        console.error('Error fetching requests:', err)
        setRequests([])
        setError(err instanceof Error ? err.message : 'Failed to fetch requests')
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-[#0a0d12] flex flex-col items-center pt-24 pb-12 px-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-8">Browse Open Requests</h1>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All Requests
          </Button>
          {categories.map(category => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {error ? (
          <div className="text-red-400">Error: {error}</div>
        ) : loading ? (
          <div className="text-gray-400">Loading requests...</div>
        ) : requests?.length === 0 ? (
          <div className="text-gray-400">No open requests available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map(request => (
              <Card key={request.id} className="p-6 bg-[#0f1318] border-gray-800 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">{request.title}</h2>
                  <Badge variant="secondary">{request.category}</Badge>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">
                  {request.description.length > 100 
                    ? `${request.description.slice(0, 100)}...` 
                    : request.description
                  }
                </p>
                <div className="space-y-2 text-gray-400">
                  <div>Budget: ${request.budget}</div>
                  <div>Quantity: {request.quantity}</div>
                  <div>Deadline: {new Date(request.deadline).toLocaleDateString()}</div>
                  <div>Offers: {request._count.offers}</div>
                </div>
                <Link href={`/requests/${request.id}`} className="mt-4">
                  <Button variant="outline" className="w-full">
                    View Details & Make Offer
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}