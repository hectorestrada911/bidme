import { NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const buf = await req.arrayBuffer()
  const body = Buffer.from(buf)

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const offerId = session.metadata?.offerId
    if (offerId) {
      try {
        await prisma.offer.update({
          where: { id: offerId },
          data: { paymentStatus: 'PAID' }
        })
        console.log('Offer marked as PAID:', offerId)
      } catch (err) {
        console.error('Error updating offer after payment:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
} 