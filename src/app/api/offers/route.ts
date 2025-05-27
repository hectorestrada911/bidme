import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { ExtendedSession, OfferWithUser } from '@/types'
import { sendNewOfferEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    console.log('Offer endpoint called');
    console.log('Request headers:', request.headers);
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Valid session:', {
      userId: session.user.id,
      email: session.user.email
    });

    const body = await request.json() as {
      requestId: string
      amount: number
      message: string
      sellerName: string
      credentials: string
      deliveryDate: string
    }
    console.log('Request body:', body);
    const { requestId, amount, message, sellerName, credentials, deliveryDate } = body

    if (!requestId || !amount || !message || !sellerName || !credentials || !deliveryDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already has an offer for this request
    const existingOffer = await prisma.offer.findFirst({
      where: {
        requestId,
        userId: session.user.id
      }
    })

    if (existingOffer) {
      return NextResponse.json(
        { error: 'You have already made an offer for this request' },
        { status: 400 }
      )
    }

    // Check if request exists and is open
    const foundRequest = await prisma.request.findUnique({
      where: { id: requestId }
    })

    if (!foundRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Prevent users from making offers on their own requests
    if (foundRequest.userId === session.user.id) {
      return NextResponse.json({ error: 'You cannot make an offer on your own request' }, { status: 400 })
    }

    if (foundRequest.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'This request is no longer accepting offers' },
        { status: 400 }
      )
    }

    const offer = await prisma.offer.create({
      data: {
        requestId,
        amount,
        message,
        sellerName,
        credentials,
        deliveryDate: new Date(deliveryDate),
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    }) as unknown as OfferWithUser

    // Send email notification to request owner (only if not self)
    try {
      const requestOwner = await prisma.user.findUnique({ where: { id: foundRequest.userId } })
      if (requestOwner?.email && requestOwner.id !== session.user.id) {
        await sendNewOfferEmail({
          to: requestOwner.email,
          userName: requestOwner.name || 'there',
          requestTitle: foundRequest.title,
          offerAmount: amount,
          offerMessage: message,
          offerUrl: `${process.env.NEXTAUTH_URL}/requests/${requestId}`
        })
      }
    } catch (e) {
      console.error('Failed to send offer email:', e)
    }

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')
    const userId = searchParams.get('userId')

    if (!requestId && !userId) {
      return NextResponse.json([], { status: 200 })
    }

    const offers = await prisma.offer.findMany({
      where: {
        ...(requestId && { requestId }),
        ...(userId && { userId })
      },
      include: {
        request: {
          select: {
            title: true,
            status: true,
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }) as unknown as OfferWithUser[]

    // If fetching by requestId, only return full details if user owns the request
    if (requestId && session?.user?.id) {
      const foundRequest = await prisma.request.findUnique({
        where: { id: requestId }
      })

      if (foundRequest?.userId !== session.user.id) {
        // Return limited data for non-owners
        return NextResponse.json(
          offers.map(offer => ({
            id: offer.id,
            createdAt: offer.createdAt,
            status: offer.status,
            user: offer.user,
            userId: offer.userId
          }))
        )
      }
    }

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 