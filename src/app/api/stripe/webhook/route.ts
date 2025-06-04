import { NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
        // Get offer details with user information
        const offer = await prisma.offer.findUnique({
          where: { id: offerId },
          include: {
            request: true,
            user: true
          }
        })

        if (!offer) {
          throw new Error('Offer not found')
        }

        // Update offer status
        await prisma.offer.update({
          where: { id: offerId },
          data: {
            paymentStatus: 'PAID',
            status: 'ACCEPTED'
          }
        })

        // Send email to buyer
        if (session.customer_email) {
          await resend.emails.send({
            from: 'BidMe <noreply@bidme.com>',
            to: session.customer_email,
            subject: 'Payment Successful - BidMe',
            html: `
              <h1>Payment Successful!</h1>
              <p>Your payment for "${offer.request.title}" has been completed successfully.</p>
              <p>Amount: $${offer.amount}</p>
              <p>Seller: ${offer.user?.name || 'Seller'}</p>
              <p>You can track your order status in your dashboard.</p>
            `
          })
        }

        // Send email to seller
        if (offer.user?.email) {
          await resend.emails.send({
            from: 'BidMe <noreply@bidme.com>',
            to: offer.user.email,
            subject: 'New Payment Received - BidMe',
            html: `
              <h1>New Payment Received!</h1>
              <p>You have received a payment for "${offer.request.title}".</p>
              <p>Amount: $${offer.amount}</p>
              <p>Please proceed with the delivery process.</p>
              <p>You can update the tracking information in your dashboard.</p>
            `
          })
        }

        console.log('Offer marked as PAID:', offerId)
      } catch (err) {
        console.error('Error processing payment webhook:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
} 