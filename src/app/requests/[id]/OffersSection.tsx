"use client"

import { useEffect, useState } from "react"
import OfferForm from "./OfferForm"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { BadgeCheck, Eye, User, Info, DollarSign } from "lucide-react"

export default function OffersSection({ requestId }: { requestId: string }) {
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession();
  const router = useRouter()
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null)

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
              <Card key={offer.id} className={`border rounded-md p-4 bg-[#10151c] relative ${offer.userId === session?.user?.id ? 'border-blue-500 bg-blue-950/30 shadow-lg ring-2 ring-blue-400' : 'border-gray-700'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-blue-400 flex items-center gap-2">
                    {offer.sellerName}
                    {offer.userId === session?.user?.id && (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full ml-2">
                          <User className="w-3 h-3" /> You
                        </span>
                        <span className="ml-2 text-xs text-blue-300 italic" title="You made this offer">
                          (You made this offer)
                        </span>
                      </>
                    )}
                  </span>
                  <span></span>
                </div>
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                  {offer.userId === session?.user?.id && (
                    <div className="flex items-center gap-1">
                      <Info className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-400">Your Offer</span>
                    </div>
                  )}
                  <span className="font-bold text-green-400 flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-lg">{offer.amount}</span>
                  </span>
                </div>
                <div className="text-gray-300 mb-1 line-clamp-2">{offer.message}</div>
                <div className="text-xs text-gray-500 mb-2">{new Date(offer.createdAt).toLocaleString()}</div>
                <button
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-200 text-xs underline"
                  onClick={() => { setSelectedOffer(offer); setShowOfferModal(true); }}
                >
                  <Eye className="w-4 h-4" /> View Details
                </button>
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
      {showOfferModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-blue-950 p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-white hover:text-blue-400 text-2xl font-bold"
              onClick={() => setShowOfferModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg text-white">{selectedOffer.sellerName}</span>
                {selectedOffer.userId === session?.user?.id && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full ml-2">
                    <User className="w-3 h-3" /> Your Offer
                  </span>
                )}
              </div>
              <div className="text-blue-400 text-sm mb-2">Submitted: {new Date(selectedOffer.createdAt).toLocaleString()}</div>
              <div className="flex items-center gap-2 text-green-400 font-bold text-2xl mb-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <span>{selectedOffer.amount}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-blue-300">Delivery Date:</span> {selectedOffer.deliveryDate ? new Date(selectedOffer.deliveryDate).toLocaleDateString() : '—'}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-blue-300">Credentials:</span> {selectedOffer.credentials || '—'}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-blue-300">Message:</span>
                <div className="text-blue-200 whitespace-pre-line mt-1">{selectedOffer.message}</div>
              </div>
              {selectedOffer.userId === session?.user?.id && (
                <button
                  className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                  onClick={() => { setShowOfferModal(false); router.push('/profile'); }}
                >
                  View in My Profile
                </button>
              )}
              {selectedOffer.userId === session?.user?.id && (
                <div className="text-blue-400 text-xs mb-2">You made this offer</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 