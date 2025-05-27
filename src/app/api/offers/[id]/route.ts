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
    const offerId = params.id
    const body = await request.json()
    const { amount, message } = body
    if (!amount || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const offer = await prisma.offer.findUnique({ where: { id: offerId } })
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }
    if (offer.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    if (offer.status !== 'PENDING') {
      return NextResponse.json({ error: 'Cannot edit offer after it is accepted or paid' }, { status: 400 })
    }
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { amount, message }
    })
    return NextResponse.json(updatedOffer)
  } catch (error) {
    console.error('Error editing offer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 