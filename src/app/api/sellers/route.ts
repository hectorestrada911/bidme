import { NextResponse } from 'next/server'

interface Seller {
  id: string
  company: string
  email: string
  phone: string
  website: string
  createdAt: string
}

let sellers: Seller[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { company, email, phone, website } = body

    // Validate required fields
    if (!company || !email || !phone || !website) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate types
    if (
      typeof company !== 'string' ||
      typeof email !== 'string' ||
      typeof phone !== 'string' ||
      typeof website !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid field types' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Create new seller
    const newSeller: Seller = {
      id: Date.now().toString(),
      company,
      email,
      phone,
      website,
      createdAt: new Date().toISOString()
    }

    sellers.push(newSeller)
    return NextResponse.json({ success: true, seller: newSeller })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(sellers)
} 