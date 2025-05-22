import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RequestStatus } from '@/types'

const prisma = new PrismaClient()

interface UpdateStatusBody {
  status: RequestStatus
  reason?: string
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as UpdateStatusBody

    const request = await prisma.request.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Only allow request owner to update status
    if (request.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Validate status transition
    const validTransitions = {
      [RequestStatus.OPEN]: [RequestStatus.PENDING, RequestStatus.CANCELLED],
      [RequestStatus.PENDING]: [RequestStatus.ACCEPTED, RequestStatus.CANCELLED],
      [RequestStatus.ACCEPTED]: [RequestStatus.COMPLETED, RequestStatus.CANCELLED],
      [RequestStatus.COMPLETED]: [],
      [RequestStatus.CANCELLED]: []
    }

    if (!validTransitions[request.status as RequestStatus].includes(body.status)) {
      return NextResponse.json({
        error: `Cannot transition from ${request.status} to ${body.status}`,
        allowedTransitions: validTransitions[request.status as RequestStatus]
      }, { status: 400 })
    }

    // Update request status and create history record
    const updatedRequest = await prisma.request.update({
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

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error updating request status:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
