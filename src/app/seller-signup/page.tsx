'use client'

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface FormData {
  company: string
  email: string
  phone: string
  website: string
}

interface FormErrors {
  company?: string
  email?: string
  phone?: string
  website?: string
}

export default function SellerSignup() {
  const [formData, setFormData] = useState<FormData>({
    company: '',
    email: '',
    phone: '',
    website: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^ -\s@]+\.[^\s@]+$/

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.website.trim()) {
      newErrors.website = 'Website is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to submit application')
      toast.success('Account created!', { description: 'Welcome aboard.' })
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-[#0a0d12] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-[#0f1318] border-gray-800">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Start Selling on BidMe</h1>
            <p className="text-gray-400">
              Join our marketplace and connect with buyers looking for your products.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium text-gray-300">
                Company Name
              </label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
                className="bg-[#0a0d12] border-gray-700 text-white placeholder:text-gray-500"
              />
              {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="bg-[#0a0d12] border-gray-700 text-white placeholder:text-gray-500"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 555-5555"
                className="bg-[#0a0d12] border-gray-700 text-white placeholder:text-gray-500"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium text-gray-300">
                Website
              </label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
                className="bg-[#0a0d12] border-gray-700 text-white placeholder:text-gray-500"
              />
              {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Create Seller Account'}
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