import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id
    // Find all requests owned by the user
    const requests = await prisma.request.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        userId: true,
        offers: {
          select: {
            id: true,
            amount: true,
            message: true,
            createdAt: true,
            status: true,
            userId: true,
            paymentStatus: true,
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    })
    // Flatten offers with request info
    const offersReceived = requests.flatMap(request =>
      request.offers.map((offer: any) => ({
        ...offer,
        request: {
          id: request.id,
          title: request.title,
          description: request.description,
          createdAt: request.createdAt,
          userId: request.userId
        }
      }))
    )
    return NextResponse.json(offersReceived)
  } catch (error) {
    console.error('Error fetching offers received:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 