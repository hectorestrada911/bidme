"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function OfferForm({ requestId, onOfferSubmitted }: { requestId: string, onOfferSubmitted: () => void }) {
  const [sellerName, setSellerName] = useState("")
  const [amount, setAmount] = useState(1)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, sellerName, amount, message })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit offer")
      setSellerName("")
      setAmount(1)
      setMessage("")
      onOfferSubmitted()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
        <Input value={sellerName} onChange={e => setSellerName(e.target.value)} required className="bg-[#0a0d12] border-gray-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Offer Amount ($)</label>
        <Input type="number" min={1} value={amount} onChange={e => setAmount(Number(e.target.value))} required className="bg-[#0a0d12] border-gray-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
        <Textarea value={message} onChange={e => setMessage(e.target.value)} required className="bg-[#0a0d12] border-gray-700 text-white" />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Submitting..." : "Submit Offer"}</Button>
    </form>
  )
} 