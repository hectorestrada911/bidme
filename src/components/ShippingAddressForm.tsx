'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface ShippingAddress {
  name: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
}

export function ShippingAddressForm({ onSubmit, loading }: { onSubmit: (address: ShippingAddress) => void, loading?: boolean }) {
  const [form, setForm] = useState<ShippingAddress>({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  })
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.address1 || !form.city || !form.state || !form.zip || !form.country) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-blue-200 mb-1">Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-blue-900 text-white" required />
      </div>
      <div>
        <label className="block text-blue-200 mb-1">Address Line 1</label>
        <input name="address1" value={form.address1} onChange={handleChange} className="w-full p-2 rounded bg-blue-900 text-white" required />
      </div>
      <div>
        <label className="block text-blue-200 mb-1">Address Line 2 (optional)</label>
        <input name="address2" value={form.address2} onChange={handleChange} className="w-full p-2 rounded bg-blue-900 text-white" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-blue-200 mb-1">City</label>
          <input name="city" value={form.city} onChange={handleChange} className="w-full p-2 rounded bg-blue-900 text-white" required />
        </div>
        <div className="flex-1">
          <label className="block text-blue-200 mb-1">State</label>
          <input name="state" value={form.state} onChange={handleChange} className="w-full p-2 rounded bg-blue-900 text-white" required />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-blue-200 mb-1">ZIP/Postal Code</label>
          <input name="zip" value={form.zip} onChange={handleChange} className="w-full p-2 rounded bg-blue-900 text-white" required />
        </div>
        <div className="flex-1">
          <label className="block text-blue-200 mb-1">Country</label>
          <input name="country" value={form.country} onChange={handleChange} className="w-full p-2 rounded bg-blue-900 text-white" required />
        </div>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : 'Save & Continue to Payment'}
      </Button>
    </form>
  )
} 