"use client"

import { useSession } from "next-auth/react"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Edit, Mail, Calendar, Activity, X, Star, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { loadStripe } from '@stripe/stripe-js'
import { ShippingAddressForm, ShippingAddress } from '@/components/ShippingAddressForm'
import { TrackingInfoForm, TrackingInfo } from '@/components/TrackingInfoForm'
import { jsPDF } from 'jspdf'
import MessagingUI from '@/components/MessagingUI'

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
  userId: string
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
    userId: string
  }
  status: string
  userId: string
  paymentStatus?: string
  user?: {
    name: string
    image: string | null
  }
  credentials?: string
  deliveryDate?: string
  shippingAddress?: string
  trackingNumber?: string
  carrier?: string
}

function PaymentStatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  
  const statusConfig = {
    PENDING: {
      icon: <CreditCard className="w-4 h-4" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      text: "Payment Pending"
    },
    PAID: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      text: "Payment Complete"
    },
    FAILED: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      text: "Payment Failed"
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
      {config.icon}
      <span className="text-xs font-medium">{config.text}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewOffer, setReviewOffer] = useState<Offer | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [userReviews, setUserReviews] = useState<any[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [showEditOfferModal, setShowEditOfferModal] = useState(false)
  const [editOffer, setEditOffer] = useState<Offer | null>(null)
  const [editAmount, setEditAmount] = useState<number | ''>('')
  const [editMessage, setEditMessage] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editSellerName, setEditSellerName] = useState('')
  const [editCredentials, setEditCredentials] = useState('')
  const [editDeliveryDate, setEditDeliveryDate] = useState('')
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [shippingOfferId, setShippingOfferId] = useState<string | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [trackingOfferId, setTrackingOfferId] = useState<string | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceOffer, setInvoiceOffer] = useState<Offer | null>(null)
  const [openChatOfferId, setOpenChatOfferId] = useState<string | null>(null)
  const [showShippedConfirm, setShowShippedConfirm] = useState<{offerId: string | null}>({offerId: null});

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

  useEffect(() => {
    if (!session?.user?.id) return
    setReviewsLoading(true)
    fetch(`/api/reviews?userId=${session.user.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setUserReviews(data))
      .finally(() => setReviewsLoading(false))
  }, [session?.user?.id])

  const averageRating = userReviews.length
    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
    : null

  // Handler for accepting/rejecting offers
  async function handleOfferStatusChange(offerId: string, newStatus: 'ACCEPTED' | 'REJECTED' | 'DELIVERED' | 'COMPLETED') {
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
    setShippingOfferId(offerId)
    setShowShippingModal(true)
  }

  async function handleShippingSubmit(address: ShippingAddress) {
    setShippingLoading(true)
    setShippingAddress(address)
    try {
      // Call payment API to create Checkout Session, including shipping address
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: shippingOfferId, shippingAddress: address })
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create payment')
      }
      const { sessionId } = await res.json()
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) throw new Error('Stripe failed to load')
      setShowShippingModal(false)
      setShippingOfferId(null)
      setShippingLoading(false)
      // Redirect to Stripe's payment page
      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) throw new Error(error.message)
    } catch (err: any) {
      alert(err.message || 'Error starting payment. Please try again.')
      setShowShippingModal(false)
      setShippingOfferId(null)
      setShippingLoading(false)
    }
  }

  // Helper to check if user has reviewed an offer
  async function hasLeftReview(offerId: string): Promise<boolean> {
    const res = await fetch(`/api/reviews?userId=${session?.user?.id}`)
    if (!res.ok) return false
    const reviews = await res.json()
    return reviews.some((r: any) => r.offerId === offerId && r.reviewerId === session?.user?.id)
  }

  // Handler to update offer
  async function handleEditOfferSubmit() {
    if (!editOffer || !editAmount || !editMessage.trim()) return
    setEditSubmitting(true)
    try {
      const res = await fetch(`/api/offers/${editOffer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: editAmount,
          message: editMessage,
          sellerName: editSellerName,
          credentials: editCredentials,
          deliveryDate: editDeliveryDate
        })
      })
      if (!res.ok) throw new Error('Failed to update offer')
      setShowEditOfferModal(false)
      setEditOffer(null)
      setEditAmount('')
      setEditMessage('')
      setEditSellerName('')
      setEditCredentials('')
      setEditDeliveryDate('')
      // Refresh offers
      const offersResponse = await fetch('/api/user/offers')
      if (offersResponse.ok) {
        const offersData = await offersResponse.json()
        setOffers(offersData)
      }
    } catch (err) {
      alert('Error updating offer. Please try again.')
    } finally {
      setEditSubmitting(false)
    }
  }

  // Handler to withdraw offer
  async function handleWithdrawOffer(offerId: string) {
    setOfferActionLoading(offerId + 'CANCELLED')
    try {
      const res = await fetch(`/api/offers/${offerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      })
      if (!res.ok) throw new Error('Failed to withdraw offer')
      // Refresh offers
      const offersResponse = await fetch('/api/user/offers')
      if (offersResponse.ok) {
        const offersData = await offersResponse.json()
        setOffers(offersData)
      }
    } catch (err) {
      alert('Error withdrawing offer. Please try again.')
    } finally {
      setOfferActionLoading(null)
    }
  }

  async function handleTrackingSubmit(info: TrackingInfo) {
    setTrackingLoading(true)
    try {
      const res = await fetch(`/api/offers/${trackingOfferId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      })
      if (!res.ok) throw new Error('Failed to save tracking info')
      setShowTrackingModal(false)
      setTrackingOfferId(null)
      // Refresh offers
      const offersResponse = await fetch('/api/user/offers')
      if (offersResponse.ok) {
        const offersData = await offersResponse.json()
        setOffers(offersData)
      }
    } catch (err) {
      alert('Error saving tracking info. Please try again.')
    } finally {
      setTrackingLoading(false)
    }
  }

  // Add a function to handle invoice generation
  function handleGenerateInvoice(offer: Offer) {
    setInvoiceOffer(offer)
    setShowInvoiceModal(true)
  }

  // Add a function to handle invoice download
  function handleDownloadInvoice(offer: Offer) {
    const doc = new jsPDF();
    
    // Add logo or title
    doc.setFontSize(24);
    doc.setTextColor(0, 51, 102); // Dark blue
    doc.text('BidMe Invoice', 20, 20);
    
    // Add invoice details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #: ${offer.id.slice(0, 8)}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
    
    // Add seller and buyer information
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Seller Information', 20, 55);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${offer.user?.name || 'N/A'}`, 20, 62);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Buyer Information', 20, 75);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${offer.request.user.name}`, 20, 82);
    
    // Add shipping address
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Shipping Address', 20, 95);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    try {
      const addr = JSON.parse(offer.shippingAddress || '{}');
      doc.text([
        addr.name || 'N/A',
        addr.address1 || 'N/A',
        addr.address2 || '',
        `${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`,
        addr.country || 'N/A'
      ].filter(Boolean), 20, 102);
    } catch {
      doc.text('No shipping address provided', 20, 102);
    }
    
    // Add order details
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Order Details', 20, 130);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Request Title: ${offer.request.title}`, 20, 137);
    doc.text(`Amount: $${offer.amount.toLocaleString()}`, 20, 144);
    doc.text(`Delivery Date: ${offer.deliveryDate ? new Date(offer.deliveryDate).toLocaleDateString() : 'N/A'}`, 20, 151);
    
    // Add tracking information if available
    if (offer.trackingNumber) {
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('Tracking Information', 20, 164);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Carrier: ${offer.carrier}`, 20, 171);
      doc.text(`Tracking Number: ${offer.trackingNumber}`, 20, 178);
    }
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for using BidMe!', 20, 280);
    doc.text('This is an automatically generated invoice.', 20, 287);
    
    // Save the PDF
    doc.save(`invoice-${offer.id.slice(0, 8)}.pdf`);
  }

  // Add a useEffect to handle refresh query param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('refresh') === '1') {
      // Refetch offers
      (async () => {
        setLoading(true);
        try {
          const offersResponse = await fetch('/api/user/offers');
          if (offersResponse.ok) {
            const offersData = await offersResponse.json();
            setOffers(offersData);
          }
          const offersReceivedResponse = await fetch('/api/user/offers-received');
          if (offersReceivedResponse.ok) {
            const offersReceivedData = await offersReceivedResponse.json();
            setOffersReceived(offersReceivedData);
          }
        } finally {
          setLoading(false);
        }
      })();
      // Remove the refresh param from the URL
      params.delete('refresh');
      const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

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
              {reviewsLoading ? (
                <div className="text-blue-400 text-sm mt-2">Loading reviews...</div>
              ) : (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold text-lg">{averageRating || '—'}</span>
                    <div className="flex items-center">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${averageRating && parseFloat(averageRating) >= star ? 'text-yellow-400' : 'text-blue-400'}`} fill={averageRating && parseFloat(averageRating) >= star ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-blue-400 text-sm ml-2">({userReviews.length} review{userReviews.length === 1 ? '' : 's'})</span>
                  </div>
                  {userReviews.length > 0 && (
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {userReviews.slice(0, 5).map((review, idx) => (
                        <div key={review.id} className="bg-blue-900/30 rounded p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-blue-950/50">
                              {review.reviewer?.image ? (
                                <Image src={review.reviewer.image} alt={review.reviewer.name || 'User'} width={24} height={24} className="object-cover" />
                              ) : (
                                <span className="text-blue-400 font-bold text-xs flex items-center justify-center w-full h-full">{review.reviewer?.name?.[0] || '?'}</span>
                              )}
                            </div>
                            <span className="text-blue-200 text-xs font-semibold">{review.reviewer?.name || 'User'}</span>
                            <div className="flex items-center ml-2">
                              {[1,2,3,4,5].map(star => (
                                <Star key={star} className={`w-3 h-3 ${review.rating >= star ? 'text-yellow-400' : 'text-blue-400'}`} fill={review.rating >= star ? 'currentColor' : 'none'} />
                              ))}
                            </div>
                          </div>
                          <div className="text-blue-300 text-xs">{review.comment}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                              <div className={`mt-2 text-sm font-semibold ${offer.status === 'ACCEPTED' ? 'text-green-400' : offer.status === 'REJECTED' ? 'text-red-400' : 'text-blue-400'}`}>
                                {offer.status === 'PENDING' && 'Pending'}
                                {offer.status === 'ACCEPTED' && 'Accepted'}
                                {offer.status === 'REJECTED' && 'Rejected'}
                              </div>
                              {offer.status === 'PENDING' && (
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-400 text-blue-400"
                                    onClick={() => {
                                      setEditOffer(offer)
                                      setEditAmount(offer.amount)
                                      setEditMessage(offer.message)
                                      setEditSellerName(offer.user?.name || '')
                                      setEditCredentials(offer.credentials || '')
                                      setEditDeliveryDate(offer.deliveryDate ? offer.deliveryDate.split('T')[0] : '')
                                      setShowEditOfferModal(true)
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-400 text-red-400"
                                    disabled={offerActionLoading === offer.id + 'CANCELLED'}
                                    onClick={() => handleWithdrawOffer(offer.id)}
                                  >
                                    {offerActionLoading === offer.id + 'CANCELLED' ? 'Withdrawing...' : 'Withdraw'}
                                  </Button>
                                </div>
                              )}
                              {offer.userId === session?.user?.id && offer.paymentStatus === 'PAID' && offer.shippingAddress && (
                                <>
                                  <div className="mb-4 flex flex-col items-center">
                                    <div className="flex items-center gap-2 w-full max-w-md justify-center">
                                      {['PAID', 'DELIVERED', 'COMPLETED'].map((step, idx, arr) => (
                                        <>
                                          <div key={step} className={`flex flex-col items-center flex-1 ${offer.status === step || (step === 'PAID' && offer.status !== 'DELIVERED' && offer.status !== 'COMPLETED') ? 'font-bold text-green-400' : 'text-blue-300'}`}>
                                            <div className={`rounded-full w-6 h-6 flex items-center justify-center border-2 ${offer.status === step || (step === 'PAID' && offer.status !== 'DELIVERED' && offer.status !== 'COMPLETED') ? 'border-green-400 bg-green-400/20' : 'border-blue-300 bg-blue-900/30'}`}>{idx + 1}</div>
                                            <span className="text-xs mt-1">{step === 'PAID' ? 'Paid' : step === 'DELIVERED' ? 'Shipped' : 'Completed'}</span>
                                          </div>
                                          {idx < arr.length - 1 && <div className={`flex-1 h-1 ${offer.status === arr[idx + 1] || offer.status === 'COMPLETED' ? 'bg-green-400' : 'bg-blue-900'}`}></div>}
                                        </>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="mb-4 p-4 bg-blue-950/20 rounded-lg border border-blue-900/30">
                                    <div className="font-semibold text-blue-200 mb-1">Order Summary</div>
                                    <div className="text-blue-100 text-sm">
                                      <b>Item:</b> {offer.request.title}<br />
                                      <b>Amount:</b> ${offer.amount.toLocaleString()}<br />
                                      {offer.deliveryDate && (
                                        <><b>Estimated Delivery Date:</b> {new Date(offer.deliveryDate).toLocaleDateString()}<br /></>
                                      )}
                                    </div>
                                    <div className="mt-2 text-blue-300 text-xs">
                                      <b>Reminder:</b> Please ship within <b>2 business days</b> to ensure a great buyer experience.
                                    </div>
                                  </div>
                                  <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-700/50 mb-4">
                                    <div className="text-green-300 font-semibold mb-2 text-lg">Next Steps to Fulfill This Order</div>
                                    <ol className="list-decimal list-inside text-green-100 text-sm space-y-1">
                                      <li><b>Prepare the package</b> for shipment with the item(s) the buyer purchased.</li>
                                      <li><b>Ship the package</b> to the address shown below using your preferred carrier.</li>
                                      <li>After shipping, <b>enter the tracking number and carrier</b> using the button below.</li>
                                      <li>Once shipped, click <b>"Mark as Shipped"</b> to notify the buyer.</li>
                                      <li>Keep the buyer updated if there are any issues using the messaging feature.</li>
                                    </ol>
                                    <div className="mt-2 text-green-200 text-xs">Need help? <a href="mailto:hello@bidme.com" className="underline">Contact support</a></div>
                                  </div>
                                  <div className="mt-4 p-4 bg-blue-950/30 rounded-lg border border-blue-900/50">
                                    <div className="text-blue-300 font-semibold mb-1">Shipping Address</div>
                                    <div className="text-blue-100 text-sm whitespace-pre-line">
                                      {(() => {
                                        try {
                                          const addr = JSON.parse(offer.shippingAddress)
                                          return `${addr.name}\n${addr.address1}${addr.address2 ? `, ${addr.address2}` : ''}\n${addr.city}, ${addr.state} ${addr.zip}\n${addr.country}`
                                        } catch {
                                          return 'Invalid address data.'
                                        }
                                      })()}
                                    </div>
                                  </div>
                                  {!offer.trackingNumber && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={() => { setTrackingOfferId(offer.id); setShowTrackingModal(true); }}
                                    >
                                      Add Tracking Info
                                    </Button>
                                  )}
                                  {offer.trackingNumber && (
                                    <div className="mt-2 p-3 bg-blue-950/40 rounded-lg border border-blue-900/50">
                                      <div className="text-blue-300 font-semibold mb-1">Tracking Info</div>
                                      <div className="text-blue-100 text-sm">
                                        <span className="font-medium">Carrier:</span> {offer.carrier}
                                        <br />
                                        <span className="font-medium">Tracking #:</span> {offer.trackingNumber}
                                      </div>
                                    </div>
                                  )}
                                  {offer.status !== 'DELIVERED' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="default"
                                        className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => setShowShippedConfirm({offerId: offer.id})}
                                      >
                                        Mark as Shipped
                                      </Button>
                                      {showShippedConfirm.offerId === offer.id && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                                          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
                                            <h2 className="text-lg font-bold text-gray-900 mb-2">Confirm Shipment</h2>
                                            <p className="text-gray-700 mb-4">Are you sure you've shipped this order to the buyer?</p>
                                            <div className="flex justify-center gap-4">
                                              <Button
                                                variant="default"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => { setShowShippedConfirm({offerId: null}); handleOfferStatusChange(offer.id, 'DELIVERED'); }}
                                              >
                                                Yes, I've shipped it
                                              </Button>
                                              <Button
                                                variant="outline"
                                                onClick={() => setShowShippedConfirm({offerId: null})}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={() => handleGenerateInvoice(offer)}
                                  >
                                    Generate Invoice
                                  </Button>
                                </>
                              )}
                              {offer.request.userId && offer.request.userId !== session?.user?.id && (
                                <div className="mt-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-400 text-blue-400"
                                    onClick={() => setOpenChatOfferId(openChatOfferId === offer.id ? null : offer.id)}
                                  >
                                    {openChatOfferId === offer.id ? 'Close Chat' : 'Message Buyer'}
                                  </Button>
                                  <a
                                    href="/help/seller-faq"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-300 underline hover:text-blue-200"
                                    title="Frequently Asked Questions for Sellers"
                                  >
                                    Seller FAQ
                                  </a>
                                  {openChatOfferId === offer.id && (
                                    <div className="mt-2">
                                      <MessagingUI
                                        offerId={offer.id}
                                        senderId={String(session?.user?.id)}
                                        receiverId={String(offer.request.userId)}
                                      />
                                    </div>
                                  )}
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
                {offersReceived
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((offer) => (
              <motion.div
                      key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-blue-900/20 border border-blue-900/30 hover:border-blue-400/20 transition-all duration-200"
              >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
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
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                  <h3 className="text-lg font-semibold text-white">{offer.request.title}</h3>
                                  <div className="flex items-center gap-2 text-sm text-blue-400">
                                    <span>From:</span>
                                    <span className="font-medium">{offer.user?.name || 'Unknown'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-green-400">${offer.amount.toLocaleString()}</span>
                                </div>
                              </div>
                          <div className="flex items-center gap-2 text-sm text-blue-400">
                            <Calendar className="w-4 h-4" />
                                <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex-grow">
                            <div className="relative max-h-24 overflow-y-auto">
                              <p className="text-sm text-blue-400 break-words">{offer.message}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {offer.request.userId === session?.user?.id ? (
                              <>
                                <div className="flex gap-2">
                                  {offer.status === 'DELIVERED' ? (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                      disabled={offerActionLoading === offer.id + 'COMPLETED'}
                                      onClick={() => handleOfferStatusChange(offer.id, 'COMPLETED')}
                                    >
                                      {offerActionLoading === offer.id + 'COMPLETED' ? 'Confirming...' : 'Confirm Receipt'}
                                    </Button>
                                  ) : offer.status === 'PENDING' ? (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="default"
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        disabled={offerActionLoading === offer.id + 'ACCEPTED' || paymentLoading === offer.id}
                                        onClick={() => handleAcceptWithPayment(offer.id)}
                                      >
                                        {paymentLoading === offer.id ? (
                                          <div className="flex items-center gap-1">
                                            <span>Redirecting...</span>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                          </div>
                                        ) : (
                                          'Accept & Pay'
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-400 text-red-400 hover:bg-red-500/10"
                                        disabled={offerActionLoading === offer.id + 'REJECTED'}
                                        onClick={() => handleOfferStatusChange(offer.id, 'REJECTED')}
                                      >
                                        {offerActionLoading === offer.id + 'REJECTED' ? 'Rejecting...' : 'Reject'}
                                      </Button>
                                    </>
                                  ) : offer.status === 'ACCEPTED' && offer.paymentStatus === 'PAID' ? (
                                    <div className="text-green-400 font-semibold">Paid / Awaiting Shipment</div>
                                  ) : null}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-400 hover:text-white"
                                  onClick={() => handleViewDetails(offer)}
                                >
                                  View Details
                                </Button>
                              </>
                            ) : offer.userId === session?.user?.id ? (
                              <>
                                {/* Mark as Delivered button for seller */}
                                {offer.paymentStatus === 'PAID' && offer.status !== 'DELIVERED' && offer.status !== 'COMPLETED' && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-blue-500 hover:bg-blue-600 text-white mb-2"
                                    disabled={offerActionLoading === offer.id + 'DELIVERED'}
                                    onClick={() => handleOfferStatusChange(offer.id, 'DELIVERED')}
                                  >
                                    {offerActionLoading === offer.id + 'DELIVERED' ? 'Marking...' : 'Mark as Delivered'}
                                  </Button>
                                )}
                                <div className="text-blue-400 font-medium">
                                  {offer.status === 'PENDING' && 'Waiting for response'}
                                  {offer.status === 'ACCEPTED' && 'Accepted'}
                                  {offer.status === 'DELIVERED' && offer.request.userId === session?.user?.id 
                                    ? 'Delivered (click Confirm Receipt to complete)'
                                    : 'Delivered (waiting for buyer confirmation)'}
                                  {offer.status === 'COMPLETED' && 'Completed'}
                                  {offer.status === 'REJECTED' && 'Rejected'}
                                </div>
                              </>
                            ) : null}
                            {offer.userId && offer.userId !== session?.user?.id && (
                              <div className="mt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-400 text-blue-400"
                                  onClick={() => setOpenChatOfferId(openChatOfferId === offer.id ? null : offer.id)}
                                >
                                  {openChatOfferId === offer.id ? 'Close Chat' : 'Message Buyer'}
                                </Button>
                                <a
                                  href="/help/seller-faq"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-300 underline hover:text-blue-200"
                                  title="Frequently Asked Questions for Sellers"
                                >
                                  Seller FAQ
                                </a>
                                {openChatOfferId === offer.id && (
                                  <div className="mt-2">
                                    <MessagingUI
                                      offerId={offer.id}
                                      senderId={String(session?.user?.id)}
                                      receiverId={String(offer.userId)}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
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
                <p className="text-lg">No offers received yet</p>
                <p className="text-sm">Create a request to start receiving offers!</p>
          </div>
        </Card>
      )}
        </div>
      </div>

      {showOfferModal && selectedOffer && (
  <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 overflow-y-auto"
  >
          <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-60">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-br from-blue-900/80 via-blue-950/80 to-blue-900/80 backdrop-blur-sm rounded-2xl shadow-2xl max-w-lg w-full relative border border-blue-900/50 overflow-hidden"
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-blue-400 text-2xl font-bold transition-colors duration-200"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-800/50 via-blue-900/50 to-blue-900/50 border-2 border-blue-900/50">
                    {selectedOffer.user?.image ? (
                          <Image
                        src={selectedOffer.user.image}
                        alt={selectedOffer.user.name || 'User'}
                        width={64}
                        height={64}
                            className="object-cover"
                          />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-900 text-white text-2xl font-bold rounded-full">
                        <div className="text-2xl font-bold">{selectedOffer.user?.name?.[0] || '?'}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white leading-tight">{selectedOffer.user?.name || 'Unknown'}</div>
                    <div className="text-blue-400 text-sm font-medium">Offeror</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-4 bg-gradient-to-br from-blue-900/50 via-blue-950/50 to-blue-900/50 rounded-xl">
                    <div className="uppercase text-xs text-blue-400 font-semibold mb-2 tracking-wider">Request</div>
                    <div className="text-lg font-semibold text-white mb-2">{selectedOffer.request.title}</div>
                    <div className="text-blue-400 text-sm whitespace-pre-line max-h-48 overflow-y-auto pr-2">{selectedOffer.request.description}</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-900/50 via-blue-950/50 to-blue-900/50 rounded-xl">
                    <div className="uppercase text-xs text-blue-400 font-semibold mb-2 tracking-wider">Offer Message</div>
                    <div className="text-white whitespace-pre-line max-h-64 overflow-y-auto pr-2">{selectedOffer.message}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gradient-to-br from-blue-900/50 via-blue-950/50 to-blue-900/50 rounded-xl">
                      <div className="uppercase text-xs text-blue-400 font-semibold mb-2 tracking-wider">Amount</div>
                      <div className="text-blue-400 font-bold text-2xl">${selectedOffer.amount.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-900/50 via-blue-950/50 to-blue-900/50 rounded-xl">
                      <div className="uppercase text-xs text-blue-400 font-semibold mb-2 tracking-wider">Date</div>
                      <div className="text-blue-400 text-base">{new Date(selectedOffer.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        </div>

                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400 text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                    disabled={offerActionLoading === selectedOffer.id + 'REJECTED'}
                    onClick={() => handleOfferStatusChange(selectedOffer.id, 'REJECTED')}
                  >
                    {offerActionLoading === selectedOffer.id + 'REJECTED' ? 'Rejecting...' : 'Reject'}
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200"
                    disabled={paymentLoading === selectedOffer.id}
                    onClick={() => handleAcceptWithPayment(selectedOffer.id)}
                  >
                    {paymentLoading === selectedOffer.id ? (
                      <div className="flex items-center gap-1">
                        <span>Redirecting...</span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      'Accept & Pay'
                    )}
                  </Button>
                    </div>
                  </div>
                </motion.div>
          </div>
        </motion.div>
      )}

      {showReviewModal && reviewOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-blue-950 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Leave a Review</h2>
            <div className="flex items-center mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${reviewRating >= star ? 'text-yellow-400' : 'text-blue-400'}`}
                  onClick={() => setReviewRating(star)}
                  fill={reviewRating >= star ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <textarea
              className="w-full p-2 rounded bg-blue-900 text-white mb-4"
              rows={4}
              placeholder="Write your review..."
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
              <Button
                variant="default"
                disabled={reviewSubmitting || !reviewComment.trim()}
                onClick={async () => {
                  setReviewSubmitting(true)
                  try {
                    const res = await fetch('/api/reviews', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        offerId: reviewOffer.id,
                        revieweeId: reviewOffer.userId === session?.user?.id ? reviewOffer.request.userId : reviewOffer.userId,
                        rating: reviewRating,
                        comment: reviewComment.trim()
                      })
                    })
                    if (!res.ok) throw new Error('Failed to submit review')
                    setShowReviewModal(false)
                    setReviewOffer(null)
                    setReviewComment('')
                    setReviewRating(5)
                    alert('Review submitted!')
                  } catch (err) {
                    alert('Error submitting review. Please try again.')
                  } finally {
                    setReviewSubmitting(false)
                  }
                }}
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
          </div>
      )}

      {showEditOfferModal && editOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-blue-950 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Edit Offer</h2>
            <div className="mb-4">
              <label className="block text-blue-300 mb-1">Amount</label>
              <input
                type="number"
                min={1}
                className="w-full p-2 rounded bg-blue-900 text-white mb-2"
                value={editAmount}
                onChange={e => setEditAmount(Number(e.target.value))}
              />
              <label className="block text-blue-300 mb-1">Message</label>
              <textarea
                className="w-full p-2 rounded bg-blue-900 text-white"
                rows={4}
                value={editMessage}
                onChange={e => setEditMessage(e.target.value)}
              />
              <label className="block text-blue-300 mb-1">Seller Name</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-blue-900 text-white mb-2"
                value={editSellerName}
                onChange={e => setEditSellerName(e.target.value)}
              />
              <label className="block text-blue-300 mb-1">Credentials</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-blue-900 text-white mb-2"
                value={editCredentials}
                onChange={e => setEditCredentials(e.target.value)}
              />
              <label className="block text-blue-300 mb-1">Delivery Date</label>
              <input
                type="date"
                className="w-full p-2 rounded bg-blue-900 text-white mb-2"
                value={editDeliveryDate}
                onChange={e => setEditDeliveryDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditOfferModal(false)}>Cancel</Button>
              <Button
                variant="default"
                disabled={editSubmitting || !editAmount || !editMessage.trim() || !editSellerName.trim() || !editCredentials.trim() || !editDeliveryDate.trim()}
                onClick={handleEditOfferSubmit}
              >
                {editSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
</div>
</div>
</div>
      )}

      {showShippingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-blue-950 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
            <ShippingAddressForm onSubmit={handleShippingSubmit} loading={shippingLoading} />
            <Button variant="outline" className="mt-4 w-full" onClick={() => setShowShippingModal(false)} disabled={shippingLoading}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-blue-950 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Add Tracking Info</h2>
            <TrackingInfoForm onSubmit={handleTrackingSubmit} loading={trackingLoading} />
            <Button variant="outline" className="mt-4 w-full" onClick={() => setShowTrackingModal(false)} disabled={trackingLoading}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showInvoiceModal && invoiceOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-blue-950 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Invoice</h2>
            <div className="text-blue-100 text-sm">
              <div><span className="font-medium">Offer ID:</span> {invoiceOffer.id}</div>
              <div><span className="font-medium">Amount:</span> ${invoiceOffer.amount.toLocaleString()}</div>
              <div><span className="font-medium">Buyer:</span> {invoiceOffer.request.user.name}</div>
              <div><span className="font-medium">Shipping Address:</span> {invoiceOffer.shippingAddress}</div>
              <div><span className="font-medium">Tracking Info:</span> {invoiceOffer.trackingNumber ? `${invoiceOffer.carrier} - ${invoiceOffer.trackingNumber}` : 'Not available'}</div>
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setShowInvoiceModal(false)}>
              Close
            </Button>
            <Button
              variant="default"
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleDownloadInvoice(invoiceOffer)}
            >
              Download PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
