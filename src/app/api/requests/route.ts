import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validate required fields
    if (!body.item || !body.quantity || !body.budget || !body.deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    // Validate types and values
    if (
      typeof body.item !== 'string' ||
      typeof body.quantity !== 'number' ||
      typeof body.budget !== 'number' ||
      typeof body.deadline !== 'string' ||
      body.quantity < 1 ||
      body.budget < 1 ||
      body.deadline < new Date().toISOString().split('T')[0]
    ) {
      return NextResponse.json(
        { error: 'Invalid field types or values' },
        { status: 400 }
      )
    }
    // Create new request in DB
    const newRequest = await prisma.request.create({
      data: {
        item: body.item,
        quantity: body.quantity,
        budget: body.budget,
        deadline: body.deadline,
      }
    })
    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const allRequests = await prisma.request.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(allRequests)
} 