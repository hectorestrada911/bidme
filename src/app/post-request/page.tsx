'use client'

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { ArrowLeft, Package2, Calendar, DollarSign, ListFilter } from "lucide-react"
import { motion } from "framer-motion"
import { CATEGORY_OPTIONS } from '@/lib/categories'



interface FormData {
  title: string
  description: string
  quantity: number
  budget: number
  deadline: string
  category: string
}

interface FormErrors {
  title?: string
  description?: string
  quantity?: string
  budget?: string
  deadline?: string
  category?: string
}

export default function PostRequest() {
  const router = useRouter()
  const session = useSession()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    quantity: 1,
    budget: 1,
    deadline: new Date().toISOString().split('T')[0],
    category: CATEGORY_OPTIONS[0].value,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Guarded render for session
  if (session.status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }
  if (!session.data?.user?.id) {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          budget: Number(formData.budget),
          deadline: new Date(formData.deadline).toISOString(),
          userId: session.data?.user?.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      toast.success('Request submitted successfully!')
      router.push('/')
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const today = new Date().toISOString().split('T')[0]

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
    }

    // Convert budget to number and validate
    const budgetNum = Number(formData.budget)
    if (isNaN(budgetNum) || budgetNum < 1) {
      newErrors.budget = 'Budget must be at least 1'
    }

    // Validate deadline
    const deadlineDate = new Date(formData.deadline)
    const todayDate = new Date()
    if (isNaN(deadlineDate.getTime()) || deadlineDate < todayDate) {
      newErrors.deadline = 'Date must be today or later'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: name === 'title' || name === 'description' || name === 'category' ? value : Number(value)
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: FormData) => ({
      ...prev,
      deadline: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-[#0a0d12] flex flex-col items-center justify-center p-4 pt-24 sm:pt-28 md:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <Card className="w-full p-8 rounded-2xl border-blue-900/50 bg-blue-950/10 backdrop-blur-sm shadow-xl shadow-blue-950/20">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">
                Tell us what you want
              </h1>
              <p className="text-blue-300/80">
                Fill out the form and we'll show you quotes from top suppliers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
                  <Package2 className="w-4 h-4 text-blue-400" />
                  Title of Your Request
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., iPhone 15 Pro, Web Design Services"
                />
                {errors.title && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-sm text-red-400"
                  >
                    {errors.title}
                  </motion.p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
                  <Package2 className="w-4 h-4 text-blue-400" />
                  Detailed Description
                </label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide more details about your request"
                />
                {errors.description && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-sm text-red-400"
                  >
                    {errors.description}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
                  <ListFilter className="w-4 h-4 text-blue-400" />
                  Category
                </label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </Select>
                {errors.category && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-sm text-red-400"
                  >
                    {errors.category}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
                  <Package2 className="w-4 h-4 text-blue-400" />
                  Quantity
                </label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {errors.quantity && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-sm text-red-400"
                  >
                    {errors.quantity}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="budget" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  Max Budget
                </label>
                <div className="relative">
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    min="1"
                    value={formData.budget}
                    onChange={handleChange}
                    className="pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">$</span>
                </div>
                {errors.budget && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-sm text-red-400"
                  >
                    {errors.budget}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="deadline" className="inline-flex items-center gap-2 text-sm font-medium text-blue-100">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Preferred Deadline
                </label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleDateChange}
                  className="[color-scheme:dark]"
                />
                {errors.deadline && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-sm text-red-400"
                  >
                    {errors.deadline.replace('Deadline', 'Preferred Deadline')}
                  </motion.p>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="flex-1 h-12" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}