"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, Calendar, Briefcase, MessageSquare, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"

interface FormData {
  sellerName: string
  amount: number
  deliveryDate: string
  credentials: string
  message: string
}

interface FormErrors {
  sellerName?: string
  amount?: string
  deliveryDate?: string
  credentials?: string
  message?: string
  submit?: string
}

export default function OfferForm({ requestId, onOfferSubmitted = () => {} }: { requestId: string, onOfferSubmitted?: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    sellerName: '',
    amount: 1,
    deliveryDate: new Date().toISOString().split('T')[0],
    credentials: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.id) {
      setErrors(prev => ({ ...prev, submit: 'Please log in to submit an offer' }))
    }
  }, [session, status]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const today = new Date().toISOString().split('T')[0]

    if (!formData.sellerName.trim()) {
      newErrors.sellerName = 'Name is required'
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (formData.deliveryDate < today) {
      newErrors.deliveryDate = 'Delivery date must be today or later'
    }

    if (!formData.credentials.trim()) {
      newErrors.credentials = 'Credentials are required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 50) {
      newErrors.message = 'Message should be at least 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      if (!session?.user?.id) {
        setErrors(prev => ({ ...prev, submit: 'Please log in to submit an offer' }))
        return
      }

      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          ...formData,
          requestId,
          amount: Number(formData.amount),
          deliveryDate: new Date(formData.deliveryDate).toISOString()
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit offer")
      
      // Reset form
      setFormData({
        sellerName: '',
        amount: 1,
        deliveryDate: new Date().toISOString().split('T')[0],
        credentials: '',
        message: ''
      })
      
      // Clear any previous errors
      setErrors({})
      
      // Call onOfferSubmitted if provided
      onOfferSubmitted()
    } catch (err: any) {
      // Update errors state with submission error
      setErrors(prev => ({ ...prev, submit: err.message }))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }))
  }

  return (
    <Card className="p-6 bg-blue-950/10 border-blue-900/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="sellerName" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
            <User className="w-4 h-4 text-blue-400" />
            Your Name
          </label>
          <Input
            id="sellerName"
            name="sellerName"
            value={formData.sellerName}
            onChange={handleChange}
            className="bg-[#0a0d12] border-gray-700 text-white"
            placeholder="Enter your full name"
          />
          {errors.sellerName && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-sm text-red-400"
            >
              {errors.sellerName}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
            <DollarSign className="w-4 h-4 text-blue-400" />
            Offer Amount
          </label>
          <div className="relative">
            <Input
              id="amount"
              name="amount"
              type="number"
              min="1"
              value={formData.amount}
              onChange={handleChange}
              className="pl-8 bg-[#0a0d12] border-gray-700 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">$</span>
          </div>
          {errors.amount && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-sm text-red-400"
            >
              {errors.amount}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="deliveryDate" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
            <Calendar className="w-4 h-4 text-blue-400" />
            Delivery Date
          </label>
          <Input
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={handleChange}
            className="bg-[#0a0d12] border-gray-700 text-white [color-scheme:dark]"
          />
          {errors.deliveryDate && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-sm text-red-400"
            >
              {errors.deliveryDate}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="credentials" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
            <Briefcase className="w-4 h-4 text-blue-400" />
            Your Credentials
          </label>
          <Textarea
            id="credentials"
            name="credentials"
            value={formData.credentials}
            onChange={handleChange}
            placeholder="Share your relevant experience, certifications, or past work examples..."
            className="min-h-[100px] resize-y bg-[#0a0d12] border-gray-700 text-white"
          />
          {errors.credentials && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-sm text-red-400"
            >
              {errors.credentials}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            Value Proposition
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Explain why you're the best choice and how you'll deliver value..."
            className="min-h-[150px] resize-y bg-[#0a0d12] border-gray-700 text-white"
          />
          {errors.message && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-sm text-red-400"
            >
              {errors.message}
            </motion.p>
          )}
        </div>

        {errors.submit && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-red-400 text-sm rounded-lg p-3 bg-red-500/10 border border-red-500/20"
          >
            {errors.submit}
          </motion.div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12" 
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Offer"}
        </Button>
      </form>
    </Card>
  )
}