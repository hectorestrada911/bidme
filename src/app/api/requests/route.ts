import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { RequestStatus, RequestWithUser } from '@/types'

interface RequestBody {
  title: string
  description: string
  quantity: string
  budget: string
  deadline: string
  category: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const userId = searchParams.get('userId')
    const all = searchParams.get('all') === 'true'
    const status = searchParams.get('status') as RequestStatus | undefined

    // If no filters and not requesting all, return empty array
    if (!category && !userId && !all) {
      return NextResponse.json([])
    }

    const requests = await prisma.request.findMany({
      where: {
        ...(category && { category }),
        ...(userId && { userId }),
        ...(status && { status }),
        ...(!all && !status && { status: 'OPEN' })
      },
      include: {
        user: true,
        offers: true,
        statusHistory: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Convert Prisma types to our interface types
    const requestsWithUser: RequestWithUser[] = requests.map(req => ({
      id: req.id,
      title: req.title,
      description: req.description,
      quantity: req.quantity,
      budget: req.budget,
      deadline: req.deadline,
      status: req.status as RequestStatus,
      category: req.category,
      createdAt: req.createdAt,
      updatedAt: req.updatedAt,
      userId: req.userId!,
      user: {
        name: req.user?.name || null,
        image: req.user?.image || null
      },
      _count: {
        offers: req.offers.length
      },
      statusHistory: req.statusHistory?.map(history => ({
        id: history.id,
        status: history.status as RequestStatus,
        timestamp: new Date(history.timestamp),
        reason: history.reason || undefined
      })) || [],
      acceptedOfferId: req.acceptedOfferId || null
    }))

    return NextResponse.json(requestsWithUser)
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Please sign in to create a request' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const requestBody: RequestBody = {
      title: body.title,
      description: body.description,
      quantity: body.quantity,
      budget: body.budget,
      deadline: body.deadline,
      category: body.category
    }

    // Validate required fields
    const requiredFields: (keyof RequestBody)[] = ['title', 'description', 'quantity', 'budget', 'deadline', 'category']
    const missingFields = requiredFields.filter(field => !requestBody[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate data types and values
    const validationErrors: string[] = []

    // Validate title and description
    if (typeof requestBody.title !== 'string' || requestBody.title.length < 3) {
      validationErrors.push('Title must be at least 3 characters')
    }
    if (typeof requestBody.description !== 'string' || requestBody.description.length < 10) {
      validationErrors.push('Description must be at least 10 characters')
    }

    // Validate numbers
    const quantity = Math.floor(Number(requestBody.quantity))
    const budget = Math.floor(Number(requestBody.budget))
    if (isNaN(quantity) || quantity < 1) {
      validationErrors.push('Quantity must be a positive number')
    }
    if (isNaN(budget) || budget < 1) {
      validationErrors.push('Budget must be a positive number')
    }

    // Validate deadline
    const deadline = new Date(requestBody.deadline)
    if (isNaN(deadline.getTime()) || deadline <= new Date()) {
      validationErrors.push('Deadline must be in the future')
    }

    // Validate category
    const category = requestBody.category
    if (typeof category !== 'string' || !CATEGORY_OPTIONS.some(opt => opt.value === category)) {
      validationErrors.push('Invalid category')
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      )
    }

    try {
      const request = await prisma.request.create({
        data: {
          ...requestBody,
          quantity: Number(requestBody.quantity),
          budget: Number(requestBody.budget),
          deadline: new Date(requestBody.deadline),
          status: 'OPEN' as RequestStatus,
          userId: session.user.id,
          statusHistory: {
            create: {
              status: "OPEN",
              reason: 'Request created'
            }
          }
        },
        include: {
          user: true,
          statusHistory: true
        }
      })

      return NextResponse.json(request)
    } catch (prismaError: any) {
      console.error('Prisma error:', prismaError?.message || prismaError)
      return NextResponse.json(
        { error: prismaError?.message || 'Database error creating request' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Request creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    )
  }
}