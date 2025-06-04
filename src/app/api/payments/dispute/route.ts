import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { offerId, reason } = body

    if (!offerId || !reason) {
      return NextResponse.json({ error: 'Offer ID and reason are required' }, { status: 400 })
    }

    // Get offer details
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        request: {
          include: {
            user: true
          }
        },
        user: true
      }
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    // Verify the user is either the buyer or seller
    if (offer.userId !== session.user.id && offer.request.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Verify the offer is paid
    if (offer.paymentStatus !== 'PAID') {
      return NextResponse.json({ error: 'Can only dispute paid offers' }, { status: 400 })
    }

    // Create dispute record
    const dispute = await prisma.dispute.create({
      data: {
        offerId,
        reason,
        status: 'OPEN',
        raisedBy: session.user.id
      }
    })

    // Update offer status
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: 'DISPUTED'
      }
    })

    // Send email notifications
    const buyerEmail = offer.request.user?.email
    const sellerEmail = offer.user?.email

    if (buyerEmail) {
      await resend.emails.send({
        from: 'BidMe <noreply@bidme.com>',
        to: buyerEmail,
        subject: 'Payment Dispute Opened - BidMe',
        html: `
          <h1>Payment Dispute Opened</h1>
          <p>A dispute has been opened for your transaction "${offer.request.title}".</p>
          <p>Reason: ${reason}</p>
          <p>Our team will review the dispute and contact you shortly.</p>
        `
      })
    }

    if (sellerEmail) {
      await resend.emails.send({
        from: 'BidMe <noreply@bidme.com>',
        to: sellerEmail,
        subject: 'Payment Dispute Opened - BidMe',
        html: `
          <h1>Payment Dispute Opened</h1>
          <p>A dispute has been opened for your transaction "${offer.request.title}".</p>
          <p>Reason: ${reason}</p>
          <p>Our team will review the dispute and contact you shortly.</p>
        `
      })
    }

    return NextResponse.json({ dispute })
  } catch (error) {
    console.error('Error creating dispute:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 