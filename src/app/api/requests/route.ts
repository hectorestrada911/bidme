import { NextResponse } from 'next/server'

interface Request {
  id: string
  item: string
  quantity: number
  budget: number
  neededBy: string
  createdAt: string
}

// In-memory storage for requests
let requests: Request[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.item || !body.quantity || !body.budget || !body.neededBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate types
    if (
      typeof body.item !== 'string' ||
      typeof body.quantity !== 'number' ||
      typeof body.budget !== 'number' ||
      typeof body.neededBy !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Invalid field types' },
        { status: 400 }
      )
    }

    // Validate values
    if (body.quantity < 1 || body.budget < 1) {
      return NextResponse.json(
        { error: 'Quantity and budget must be at least 1' },
        { status: 400 }
      )
    }

    // Create new request
    const newRequest: Request = {
      id: Date.now().toString(),
      item: body.item,
      quantity: body.quantity,
      budget: body.budget,
      neededBy: body.neededBy,
      createdAt: new Date().toISOString()
    }

    // Add to in-memory storage
    requests.push(newRequest)

    return NextResponse.json({ success: true, request: newRequest })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(requests)
} 