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

    const offers = await prisma.offer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        request: {
          include: {
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

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching user offers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
