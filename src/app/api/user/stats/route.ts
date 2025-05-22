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

    // Get user statistics
    const [totalRequests, activeRequests, totalOffers, offersReceived] = await Promise.all([
      prisma.request.count({ where: { userId } }),
      prisma.request.count({ where: { userId, status: 'OPEN' } }),
      prisma.offer.count({ where: { userId } }),
      prisma.offer.count({ where: { request: { userId } } })
    ])

    const stats = {
      totalRequests,
      activeRequests,
      totalOffers,
      offersReceived
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
