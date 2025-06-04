import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { RateLimiter } from '@/lib/rate-limiter'

const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
})

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimiter.tryAcquire(ip)) {
      return NextResponse.json(
        { error: 'Too many payment attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { offerId, shippingAddress } = body

    if (!offerId) {
      return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 })
    }

    // Get offer and request details
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        request: true,
        user: true
      }
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    // Verify the request owner is making the payment
    if (offer.request.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Validate amount
    if (offer.amount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 })
    }

    // Check if there's an existing payment session
    if (offer.paymentId && offer.paymentStatus === 'PENDING') {
      // Verify the session is still valid
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(offer.paymentId)
        if (existingSession.status === 'open') {
          return NextResponse.json({ sessionId: existingSession.id })
        }
      } catch (error) {
        console.error('Error retrieving existing session:', error)
      }
    }

    // Create new Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: offer.request.title,
              description: `Offer from ${offer.user?.name || 'Seller'}`,
            },
            unit_amount: formatAmountForStripe(offer.amount),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        offerId,
        requestId: offer.requestId,
        buyerId: session.user.id,
        sellerId: offer.userId,
      },
      customer_email: session.user.email || undefined,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'], // Add more countries as needed
      },
    })

    // Update offer with session id and shipping address
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        paymentId: checkoutSession.id,
        paymentStatus: 'PENDING',
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : undefined,
        paymentAttempts: {
          increment: 1
        }
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 