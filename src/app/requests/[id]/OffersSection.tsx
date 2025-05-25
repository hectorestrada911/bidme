"use client"

import { useEffect, useState } from "react"
import OfferForm from "./OfferForm"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function OffersSection({ requestId }: { requestId: string }) {
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession();
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return;
      if (!session?.user?.id) {
        toast.error('Please sign in to view offers')
        router.push('/auth/signin')
      }
  }, [session, status, router]);

  const fetchOffers = async () => {
    setLoading(true)
    const res = await fetch(`/api/offers?requestId=${requestId}`)
    const data = await res.json()
    setOffers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOffers()
    // eslint-disable-next-line
  }, [requestId])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Offers</h2>
        {loading ? (
          <div className="text-gray-400 mb-4">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-gray-400 mb-4">No offers yet. Be the first to make one!</div>
        ) : (
          <div className="space-y-4 mb-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="border border-gray-700 rounded-md p-4 bg-[#10151c]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-blue-400">{offer.sellerName}</span>
                  <span className="font-bold text-green-400">${offer.amount}</span>
                </div>
                <div className="text-gray-300 mb-1">{offer.message}</div>
                <div className="text-xs text-gray-500">{new Date(offer.createdAt).toLocaleString()}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Make an Offer</h2>
        {session?.user?.id ? (
          <OfferForm requestId={requestId} onOfferSubmitted={fetchOffers} />
        ) : (
          <div className="text-gray-400">
            Please sign in to make an offer
          </div>
        )}
      </div>
    </div>
  )
} 