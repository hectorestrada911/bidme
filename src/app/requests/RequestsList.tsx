"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CATEGORY_OPTIONS } from '@/lib/categories'

export default function RequestsList({ allRequests }: { allRequests: any[] }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] = useState('All')

  let requests = allRequests
  if (selectedCategory !== 'All') {
    requests = requests.filter((r) => r.category === selectedCategory)
  }
  if (search) {
    requests = requests.filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    )
  }
  if (budgetMin) {
    requests = requests.filter((r) => r.budget >= Number(budgetMin))
  }
  if (budgetMax) {
    requests = requests.filter((r) => r.budget <= Number(budgetMax))
  }
  if (deadline) {
    requests = requests.filter((r) => new Date(r.deadline) <= new Date(deadline))
  }
  if (status !== 'All') {
    requests = requests.filter((r) => r.status === status)
  }

  return (
    <div className="mt-24">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#0a0d12] border border-gray-700 text-white rounded-md px-3 py-2 w-full sm:w-64"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-[#0a0d12] border-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="All">All Categories</option>
            {CATEGORY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Budget"
            value={budgetMin}
            onChange={e => setBudgetMin(e.target.value)}
            className="bg-[#0a0d12] border border-gray-700 text-white rounded-md px-3 py-2 w-24"
            min={0}
          />
          <input
            type="number"
            placeholder="Max Budget"
            value={budgetMax}
            onChange={e => setBudgetMax(e.target.value)}
            className="bg-[#0a0d12] border border-gray-700 text-white rounded-md px-3 py-2 w-24"
            min={0}
          />
          <input
            type="date"
            placeholder="Preferred Deadline"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="bg-[#0a0d12] border border-gray-700 text-white rounded-md px-3 py-2"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="bg-[#0a0d12] border-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="All">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <Link href="/post-request">
          <Button size="lg">Post a Request</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {requests.length === 0 ? (
          <div className="text-gray-400 col-span-full text-center">No requests found for this category.</div>
        ) : (
          requests.map((req) => (
            <Link key={req.id} href={`/requests/${req.id}`} className="block">
              <Card className="rounded-lg border border-gray-800 bg-[#0f1318] p-6 flex flex-col gap-4 shadow-sm hover:border-blue-400 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">{req.title}</h3>
                <div className="text-gray-400 text-sm space-y-1">
                  <div>Category: {req.category}</div>
                  <div>Quantity: {req.quantity}</div>
                  <div>Budget: ${req.budget}</div>
                  <div>Preferred Deadline: {new Date(req.deadline).toLocaleDateString()}</div>
                </div>
                <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10 mt-4">
                  Make an Offer
                </Button>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
} 