"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Edit, Mail, Calendar, Activity } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { loadStripe } from '@stripe/stripe-js'

interface UserStats {
  totalRequests: number
  activeRequests: number
  totalOffers: number
  offersReceived: number
}

interface Request {
  id: string
  title: string
  description: string
  createdAt: string
  user: {
    name: string
    image: string | null
  }
}

interface Offer {
  id: string
  amount: number
  message: string
  createdAt: string
  request: {
    title: string
    user: {
      name: string
      image: string | null
    }
    description?: string
    createdAt?: string
  }
  status: string
  user?: {
    name: string
    image: string | null
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()

  // Redirect if not logged in
  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  const [stats, setStats] = useState<UserStats>({
    totalRequests: 0,
    activeRequests: 0,
    totalOffers: 0,
    offersReceived: 0
  })
  const [requests, setRequests] = useState<Request[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [offersReceived, setOffersReceived] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestSort, setRequestSort] = useState<'date' | 'title'>('date')
  const [offerSort, setOfferSort] = useState<'date' | 'amount'>('date')
  const [offerActionLoading, setOfferActionLoading] = useState<string | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch stats
        const statsResponse = await fetch('/api/user/stats')
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch stats')
        }
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch requests
        const requestsResponse = await fetch('/api/user/requests')
        if (!requestsResponse.ok) {
          throw new Error('Failed to fetch requests')
        }
        const requestsData = await requestsResponse.json()
        setRequests(requestsData)

        // Fetch offers
        const offersResponse = await fetch('/api/user/offers')
        if (!offersResponse.ok) {
          throw new Error('Failed to fetch offers')
        }
        const offersData = await offersResponse.json()
        setOffers(offersData)

        // Fetch offers received
        const offersReceivedResponse = await fetch('/api/user/offers-received')
        if (offersReceivedResponse.ok) {
          const offersReceivedData = await offersReceivedResponse.json()
          setOffersReceived(offersReceivedData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load profile data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status])

  useEffect(() => {
    if (status === "loading") return
    
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [status])

  // Handler for accepting/rejecting offers
  async function handleOfferStatusChange(offerId: string, newStatus: 'ACCEPTED' | 'REJECTED') {
    setOfferActionLoading(offerId + newStatus)
    try {
      const res = await fetch(`/api/offers/${offerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to update offer status')
      }
      const updatedOffer = await res.json()
      setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, status: updatedOffer.status } : o))
      // Re-fetch offersReceived and offers to sync UI
      const offersReceivedResponse = await fetch('/api/user/offers-received')
      if (offersReceivedResponse.ok) {
        const offersReceivedData = await offersReceivedResponse.json()
        setOffersReceived(offersReceivedData)
      }
      const offersResponse = await fetch('/api/user/offers')
      if (offersResponse.ok) {
        const offersData = await offersResponse.json()
        setOffers(offersData)
      }
    } catch (err: any) {
      alert(err.message || 'Error updating offer status. Please try again.')
    } finally {
      setOfferActionLoading(null)
    }
  }

  function handleViewDetails(offer: Offer) {
    setSelectedOffer(offer)
    setShowOfferModal(true)
  }

  function handleCloseModal() {
    setShowOfferModal(false)
    setSelectedOffer(null)
  }

  async function handleAcceptWithPayment(offerId: string) {
    setPaymentLoading(offerId)
    try {
      // Call payment API to create Checkout Session
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId })
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create payment')
      }
      const { sessionId } = await res.json()
      // Load Stripe.js
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) throw new Error('Stripe failed to load')
      console.log('Stripe sessionId:', sessionId)
      // Redirect to Stripe's payment page
      const { error } = await stripe.redirectToCheckout({
        sessionId
      })
      if (error) throw new Error(error.message)
    } catch (err: any) {
      alert(err.message || 'Error starting payment. Please try again.')
    } finally {
      setPaymentLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8 space-y-8 pt-24">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-6xl py-8 space-y-8 pt-24">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8 pt-24">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-6 items-start"
      >
        {/* Avatar & Info */}
        <Card className="p-6 flex-grow bg-blue-950/10 border-blue-900/50">
          <div className="flex gap-6 items-start">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-950/50">
                {session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                )}
              </div>
            </div>
            <div className="flex-grow space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">{session?.user?.name}</h1>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{session?.user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined May 2024</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="w-full md:w-auto p-6 bg-blue-950/10 border-blue-900/50">
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{stats.totalRequests}</div>
              <div className="text-sm text-blue-400">Total Requests</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{stats.activeRequests}</div>
              <div className="text-sm text-blue-400">Active Requests</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{stats.totalOffers}</div>
              <div className="text-sm text-blue-400">Offers Made</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{stats.offersReceived}</div>
              <div className="text-sm text-blue-400">Offers Received</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Activity Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* My Requests */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">My Requests</h2>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/post-request'}>Create Request</Button>
          </div>
          {requests.length > 0 ? (
            <Card className="bg-blue-950/10 border-blue-900/50">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-blue-400">Sort by:</span>
                  <select
                    value={requestSort}
                    onChange={(e) => setRequestSort(e.target.value as 'date' | 'title')}
                    className="bg-blue-950/20 text-blue-400 border-blue-900/50 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="date">Date (Newest First)</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {requests
                    .sort((a, b) => {
                      if (requestSort === 'date') {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      }
                      return a.title.localeCompare(b.title)
                    })
                    .map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-blue-900/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-950/50">
                              {request.user.image && (
                                <Image
                                  src={request.user.image}
                                  alt={request.user.name || "User"}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-blue-400">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <p className="text-sm text-blue-400 line-clamp-2">{request.description}</p>
                              <div className="flex items-center gap-2 text-sm text-blue-400">
                                <span className="inline-flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-green-400" />
                                  <span>Active</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 bg-blue-950/10 border-blue-900/50">
              <div className="text-center py-8 text-blue-400">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No requests yet</p>
                <Button variant="link" className="mt-2" onClick={() => window.location.href = '/post-request'}>Create your first request</Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* My Offers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">My Offers</h2>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/requests'}>Browse Requests</Button>
          </div>
          {offers.length > 0 ? (
            <Card className="bg-blue-950/10 border-blue-900/50">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-blue-400">Sort by:</span>
                  <select
                    value={offerSort}
                    onChange={(e) => setOfferSort(e.target.value as 'date' | 'amount')}
                    className="bg-blue-950/20 text-blue-400 border-blue-900/50 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="date">Date (Newest First)</option>
                    <option value="amount">Amount (High to Low)</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {offers
                    .sort((a, b) => {
                      if (offerSort === 'date') {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      }
                      return b.amount - a.amount
                    })
                    .map((offer) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-blue-900/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-950/50">
                              {offer.request.user.image && (
                                <Image
                                  src={offer.request.user.image}
                                  alt={offer.request.user.name || 'User'}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center w-full">
                                <h3 className="text-lg font-semibold text-white truncate max-w-[60%]">{offer.request.title}</h3>
                                <span className="text-green-400 font-medium whitespace-nowrap min-w-[80px] max-w-[120px] text-right">${offer.amount.toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-blue-400 line-clamp-2 break-all max-w-full">{offer.message}</p>
                              <div className="flex items-center gap-2 text-sm text-blue-400">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                              </div>
                              {/* Accept/Reject buttons or status */}
                              {offer.status === 'PENDING' ? (
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    disabled={offerActionLoading === offer.id + 'ACCEPTED'}
                                    onClick={() => handleOfferStatusChange(offer.id, 'ACCEPTED')}
                                  >
                                    {offerActionLoading === offer.id + 'ACCEPTED' ? 'Accepting...' : 'Accept'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={offerActionLoading === offer.id + 'REJECTED'}
                                    onClick={() => handleOfferStatusChange(offer.id, 'REJECTED')}
                                  >
                                    {offerActionLoading === offer.id + 'REJECTED' ? 'Rejecting...' : 'Reject'}
                                  </Button>
                                </div>
                              ) : (
                                <div className={`mt-2 text-sm font-semibold ${offer.status === 'ACCEPTED' ? 'text-green-400' : 'text-red-400'}`}>
                                  {offer.status === 'ACCEPTED' ? 'Accepted' : offer.status === 'REJECTED' ? 'Rejected' : offer.status}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 bg-blue-950/10 border-blue-900/50">
              <div className="text-center py-8 text-blue-400">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No offers made yet</p>
                <Button variant="link" className="mt-2" onClick={() => window.location.href = '/requests'}>Browse requests</Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Offers Received Section */}
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-white">Offers Received</h2>
          {offersReceived.length > 0 ? (
            <Card className="bg-blue-950/10 border-blue-900/50">
              <div className="p-4 space-y-4">
                {offersReceived.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-blue-900/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-950/50">
                          {offer.user?.image && (
                            <Image
                              src={offer.user.image}
                              alt={offer.user.name || 'User'}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <h3 className="text-lg font-semibold text-white truncate max-w-[60%]">{offer.request.title}</h3>
                              <div className="text-blue-400 text-xs">From: {offer.user?.name || 'Unknown'}</div>
                            </div>
                            <span className="text-green-400 font-medium whitespace-nowrap min-w-[80px] max-w-[120px] text-right">${offer.amount.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-blue-400 line-clamp-2 break-all max-w-full">{offer.message}</p>
                          <div className="flex items-center gap-2 text-sm text-blue-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                          </div>
                          {/* Accept/Reject buttons or status */}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="default"
                              disabled={offerActionLoading === offer.id + 'ACCEPTED' || paymentLoading === offer.id}
                              onClick={() => handleAcceptWithPayment(offer.id)}
                            >
                              {paymentLoading === offer.id ? 'Redirecting...' : 'Accept & Pay'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={offerActionLoading === offer.id + 'REJECTED'}
                              onClick={() => handleOfferStatusChange(offer.id, 'REJECTED')}
                            >
                              {offerActionLoading === offer.id + 'REJECTED' ? 'Rejecting...' : 'Reject'}
                            </Button>
                            <Button
                              size="sm"
                              variant="link"
                              onClick={() => handleViewDetails(offer)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-4 bg-blue-950/10 border-blue-900/50">
              <div className="text-center py-8 text-blue-400">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No offers received yet</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {showOfferModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-blue-950 rounded-xl shadow-2xl p-8 max-w-lg w-full relative border border-blue-900">
            <button
              className="absolute top-3 right-3 text-blue-300 hover:text-white text-2xl font-bold"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-950/50 border-2 border-blue-900">
                {selectedOffer.user?.image ? (
                  <Image
                    src={selectedOffer.user.image}
                    alt={selectedOffer.user.name || 'User'}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-900 text-white text-2xl font-bold rounded-full">
                    {selectedOffer.user?.name?.[0] || '?'}
                  </div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-white leading-tight">{selectedOffer.user?.name || 'Unknown'}</div>
                <div className="text-blue-400 text-sm font-medium">Offeror</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="uppercase text-xs text-blue-400 font-semibold mb-1 tracking-wider">Request</div>
              <div className="text-lg font-semibold text-white mb-1">{selectedOffer.request.title}</div>
              <div className="text-blue-300 text-sm mb-2 whitespace-pre-line">{selectedOffer.request.description}</div>
            </div>
            <div className="border-t border-blue-900 my-4"></div>
            <div className="mb-4">
              <div className="uppercase text-xs text-blue-400 font-semibold mb-1 tracking-wider">Offer Message</div>
              <div className="text-white whitespace-pre-line break-words text-base">{selectedOffer.message}</div>
            </div>
            <div className="border-t border-blue-900 my-4"></div>
            <div className="flex gap-8 mb-2">
              <div>
                <div className="uppercase text-xs text-blue-400 font-semibold mb-1 tracking-wider">Amount</div>
                <div className="text-green-400 font-bold text-xl">${selectedOffer.amount.toLocaleString()}</div>
              </div>
              <div>
                <div className="uppercase text-xs text-blue-400 font-semibold mb-1 tracking-wider">Date</div>
                <div className="text-white text-base">{new Date(selectedOffer.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            {/* Add more details as needed, e.g., credentials, deliveryDate, etc. */}
          </div>
        </div>
      )}
    </div>
  )
}
