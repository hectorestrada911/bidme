import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Send a message
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { receiverId, content } = body
  if (!receiverId || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      content,
    },
  })
  return NextResponse.json(message)
}

// Fetch messages between two users
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const otherUserId = searchParams.get('userId')
  if (!otherUserId) {
    return NextResponse.json({ error: 'Missing userId param' }, { status: 400 })
  }
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.id },
      ],
    },
    orderBy: { timestamp: 'asc' },
  })
  return NextResponse.json(messages)
} 