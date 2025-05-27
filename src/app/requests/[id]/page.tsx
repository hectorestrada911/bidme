import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import OfferForm from "./OfferForm"
import { revalidatePath } from "next/cache"
import NextDynamic from 'next/dynamic'

export const dynamic = 'force-dynamic'

const OffersSection = NextDynamic(() => import('./OffersSection'), { ssr: false })

const prismaClient = new PrismaClient()

async function acceptOffer(offerId: string, requestId: string) {
  'use server'
  
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const request = await prismaClient.request.findUnique({
    where: { id: requestId }
  })

  if (!request || request.userId !== session.user.id) {
    throw new Error('Not authorized')
  }

  await prismaClient.request.update({
    where: { id: requestId },
    data: { 
      acceptedOfferId: offerId,
      status: 'CLOSED'
    }
  })

  revalidatePath(`/requests/${requestId}`)
}

export default async function RequestDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const request = await prismaClient.request.findUnique({
    where: { id: params.id },
    include: { 
      offers: {
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      user: {
        select: {
          name: true
        }
      }
    }
  })

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d12]">
        <Card className="p-8 bg-[#0f1318] border-gray-800 text-white">
          <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
          <Link href="/">
            <Button variant="outline">Back Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const isRequestOwner = request.userId === session.user.id

  return (
    <div className="bg-[#0a0d12] p-0 flex justify-center pt-20">
      <Card className="w-full max-w-2xl p-4 bg-[#0f1318] border-gray-800 text-white">
        <h1 className="text-3xl font-bold mb-4">{request.title}</h1>
        <div className="mb-6 space-y-1 text-gray-300">
          <div><span className="font-semibold text-white">Quantity:</span> {request.quantity}</div>
          <div><span className="font-semibold text-white">Max Budget:</span> ${request.budget}</div>
          <div><span className="font-semibold text-white">Preferred Deadline:</span> {new Date(request.deadline).toLocaleDateString()}</div>
          <div><span className="font-semibold text-white">Posted:</span> {new Date(request.createdAt).toLocaleString()}</div>
        </div>
        {isRequestOwner && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Offers</h2>
            {request.offers.length === 0 ? (
              <p className="text-gray-400">No offers yet</p>
            ) : (
              request.offers.map((offer) => (
                <Card 
                  key={offer.id} 
                  className={`p-4 flex items-center justify-between ${
                    offer.id === request.acceptedOfferId 
                      ? 'border-2 border-green-500' 
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {offer.user?.image && (
                      <img 
                        src={offer.user.image} 
                        alt={offer.user.name || 'Seller'} 
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{offer.user?.name}</p>
                      <p className="text-gray-400">${offer.amount}</p>
                      <p className="text-sm text-gray-500">{offer.message}</p>
                    </div>
                  </div>
                  {!request.acceptedOfferId && (
                    <form action={async () => {
                      'use server'
                      await acceptOffer(offer.id, request.id)
                    }}>
                      <Button 
                        type="submit"
                        variant="default" 
                        size="sm"
                      >
                        Accept Offer
                      </Button>
                    </form>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {!isRequestOwner && (
          <div className="text-gray-400">
            Only the request owner can view and accept offers.
          </div>
        )}

        <OffersSection requestId={request.id} />
      </Card>
    </div>
  )
}