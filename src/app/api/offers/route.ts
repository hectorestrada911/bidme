import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { requestId, sellerName, amount, message } = body

    if (!requestId || !sellerName || !amount || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const offer = await prisma.offer.create({
      data: {
        requestId,
        sellerName,
        amount,
        message,
      },
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const requestId = searchParams.get('requestId')
  if (!requestId) {
    return NextResponse.json([], { status: 200 })
  }
  const offers = await prisma.offer.findMany({
    where: { requestId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(offers)
} 