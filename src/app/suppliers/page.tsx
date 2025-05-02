"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Seller {
  id: string
  company: string
  email: string
  phone: string
  website: string
  createdAt: string
}

export default function SuppliersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSellers() {
      try {
        const res = await fetch("/api/sellers")
        const data = await res.json()
        setSellers(data)
      } catch (err) {
        setSellers([])
      } finally {
        setLoading(false)
      }
    }
    fetchSellers()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0d12] flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Our Suppliers</h1>
      {loading ? (
        <div className="text-gray-400">Loading suppliers...</div>
      ) : sellers.length === 0 ? (
        <div className="text-gray-400">No suppliers have signed up yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {sellers.map(seller => (
            <Card key={seller.id} className="p-6 bg-[#0f1318] border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-2">{seller.company}</h2>
              <div className="text-gray-300 space-y-1">
                <div>
                  <span className="font-medium">Email: </span>
                  <a href={`mailto:${seller.email}`} className="text-blue-400 hover:underline">{seller.email}</a>
                </div>
                <div>
                  <span className="font-medium">Phone: </span>{seller.phone}
                </div>
                <div>
                  <span className="font-medium">Website: </span>
                  <a href={seller.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {seller.website}
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 