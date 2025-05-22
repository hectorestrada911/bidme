"use client"

import React from "react"
import { CATEGORY_OPTIONS } from '@/lib/categories'

export default function CategoryFilter({
  category,
  options,
}: {
  category: string
  options: { value: string; label: string; icon: string }[]
}) {
  return (
    <select
      id="category"
      name="category"
      value={category}
      onChange={e => {
        const value = e.target.value
        window.location.search = value === 'All' ? '' : `?category=${encodeURIComponent(value)}`
      }}
      className="bg-[#0a0d12] border-gray-700 text-white rounded-md px-3 py-2"
    >
      <option value="All">All Categories</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
} 