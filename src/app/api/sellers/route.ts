import { NextResponse } from 'next/server'

interface Seller {
  id: string
  businessName: string
  email: string
  phone: string
  businessType: string
  description: string
  createdAt: string
}

let sellers: Seller[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { businessName, email, phone, businessType, description } = body

    // Validate required fields
    if (!businessName || !email || !phone || !businessType || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate types
    if (
      typeof businessName !== 'string' ||
      typeof email !== 'string' ||
      typeof phone !== 'string' ||
      typeof businessType !== 'string' ||
      typeof description !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid field types' }, { status: 400 })
    }

    // Create new seller
    const newSeller: Seller = {
      id: Date.now().toString(),
      businessName,
      email,
      phone,
      businessType,
      description,
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