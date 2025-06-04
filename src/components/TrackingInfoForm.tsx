'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

const CARRIERS = [
  'USPS',
  'UPS',
  'FedEx',
  'DHL',
  'Amazon Logistics',
  'Other',
]

export interface TrackingInfo {
  trackingNumber: string
  carrier: string
}

export function TrackingInfoForm({
  onSubmit,
  loading,
  initialValue
}: {
  onSubmit: (info: TrackingInfo) => void,
  loading?: boolean,
  initialValue?: TrackingInfo
}) {
  const [form, setForm] = useState<TrackingInfo>(
    initialValue || { trackingNumber: '', carrier: '' }
  )
  const [customCarrier, setCustomCarrier] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'carrier' && value !== 'Other') setCustomCarrier('')
  }

  function handleCustomCarrier(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomCarrier(e.target.value)
    setForm((prev) => ({ ...prev, carrier: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.trackingNumber || !form.carrier) {
      setError('Please enter both tracking number and carrier.')
      return
    }
    setError(null)
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-blue-200 mb-1">Tracking Number</label>
        <input
          name="trackingNumber"
          value={form.trackingNumber}
          onChange={handleChange}
          className="w-full p-2 rounded bg-blue-900 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-blue-200 mb-1">Carrier</label>
        <select
          name="carrier"
          value={CARRIERS.includes(form.carrier) ? form.carrier : 'Other'}
          onChange={handleChange}
          className="w-full p-2 rounded bg-blue-900 text-white"
          required
        >
          <option value="">Select Carrier</option>
          {CARRIERS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {form.carrier === 'Other' && (
          <input
            name="customCarrier"
            value={customCarrier}
            onChange={handleCustomCarrier}
            placeholder="Enter carrier name"
            className="w-full p-2 rounded bg-blue-900 text-white mt-2"
            required
          />
        )}
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : 'Save Tracking Info'}
      </Button>
    </form>
  )
} 