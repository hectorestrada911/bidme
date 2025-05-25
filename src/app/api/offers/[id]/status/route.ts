import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as {
      status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'DELIVERED' | 'COMPLETED'
      reason?: string
    }

    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
      include: {
        request: {
          include: { user: true }
        },
        user: true
      }
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    // Only allow offer owner or request owner to update status
    if (offer.userId !== session.user.id && offer.request.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Validate status transition
    const validTransitions = {
      PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
      ACCEPTED: ['DELIVERED', 'COMPLETED', 'CANCELLED'],
      DELIVERED: ['COMPLETED', 'CANCELLED'],
      REJECTED: [],
      CANCELLED: [],
      COMPLETED: []
    }

    if (!validTransitions[offer.status].includes(body.status)) {
      return NextResponse.json({
        error: `Cannot transition from ${offer.status} to ${body.status}`
      }, { status: 400 })
    }

    // Only allow offer creator to mark as DELIVERED, and only if paymentStatus is PAID
    if (body.status === 'DELIVERED') {
      if (offer.userId !== session.user.id) {
        return NextResponse.json({ error: 'Only the seller can mark as delivered' }, { status: 403 })
      }
      if (offer.paymentStatus !== 'PAID') {
        return NextResponse.json({ error: 'Order must be paid before marking as delivered' }, { status: 400 })
      }
    }

    // Update offer status and create history record
    const updatedOffer = await prisma.offer.update({
      where: { id: params.id },
      data: {
        status: body.status,
        statusHistory: {
          create: {
            status: body.status,
            reason: body.reason
          }
        }
      },
      include: {
        statusHistory: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    })

    // If offer was accepted, update request status
    if (body.status === 'ACCEPTED') {
      await prisma.request.update({
        where: { id: offer.requestId },
        data: {
          status: 'ACCEPTED',
          acceptedOfferId: offer.id
        }
      })
    }

    return NextResponse.json(updatedOffer)
  } catch (error) {
    console.error('Error updating offer status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
