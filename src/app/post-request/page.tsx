'use client'

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FormData {
  item: string
  quantity: number
  budget: number
  neededBy: string
}

interface FormErrors {
  item?: string
  quantity?: string
  budget?: string
  neededBy?: string
}

export default function PostRequest() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    item: '',
    quantity: 1,
    budget: 1,
    neededBy: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const today = new Date().toISOString().split('T')[0]

    if (!formData.item.trim()) {
      newErrors.item = 'Item is required'
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
    }

    if (formData.budget < 1) {
      newErrors.budget = 'Budget must be at least 1'
    }

    if (formData.neededBy < today) {
      newErrors.neededBy = 'Date must be today or later'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'item' ? value : Number(value)
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      neededBy: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-[#0a0d12] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-[#0f1318] border-gray-800">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Tell us what you want</h1>
            <p className="text-gray-400">
              Fill out the form and we'll show you quotes from top suppliers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="item" className="text-sm font-medium text-gray-300">
                Item
              </label>
              <Input
                id="item"
                name="item"
                value={formData.item}
                onChange={handleChange}
                placeholder="What are you looking for?"
                className="bg-[#0a0d12] border-gray-700 text-white placeholder:text-gray-500"
              />
              {errors.item && <p className="text-sm text-red-500">{errors.item}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-300">
                Quantity
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="bg-[#0a0d12] border-gray-700 text-white"
              />
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium text-gray-300">
                Max Budget
              </label>
              <Input
                id="budget"
                name="budget"
                type="number"
                min="1"
                value={formData.budget}
                onChange={handleChange}
                className="bg-[#0a0d12] border-gray-700 text-white"
              />
              {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="neededBy" className="text-sm font-medium text-gray-300">
                Needed By
              </label>
              <Input
                id="neededBy"
                name="neededBy"
                type="date"
                value={formData.neededBy}
                onChange={handleDateChange}
                className="bg-[#0a0d12] border-gray-700 text-white"
              />
              {errors.neededBy && <p className="text-sm text-red-500">{errors.neededBy}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Send Request'}
            </Button>
          </form>

          <div className="pt-4">
            <Link href="/">
              <Button variant="outline" className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4" />
                Back Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
} 