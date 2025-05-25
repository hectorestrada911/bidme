import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Create a review
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { offerId, revieweeId, rating, comment } = body
    const reviewerId = session.user.id
    if (!offerId || !revieweeId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // Check offer exists and is completed
    const offer = await prisma.offer.findUnique({ where: { id: offerId } })
    if (!offer || offer.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Offer not found or not completed' }, { status: 400 })
    }
    // Only allow participants to review
    if (reviewerId !== offer.userId && reviewerId !== offer.requestId) {
      return NextResponse.json({ error: 'Not authorized to review this offer' }, { status: 403 })
    }
    // Prevent double review
    const existing = await prisma.review.findUnique({ where: { offerId_reviewerId: { offerId, reviewerId } } })
    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this transaction' }, { status: 400 })
    }
    const review = await prisma.review.create({
      data: { offerId, reviewerId, revieweeId, rating, comment }
    })
    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get all reviews for a user (as reviewee)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }
    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, name: true, image: true } },
        offer: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 