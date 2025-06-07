import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { offerId, requestId } = req.query;
    if (!offerId && !requestId) {
      return res.status(400).json({ error: 'offerId or requestId is required' });
    }
    const messages = await prisma.message.findMany({
      where: {
        ...(offerId ? { offerId: String(offerId) } : {}),
        ...(requestId ? { requestId: String(requestId) } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });
    return res.status(200).json(messages);
  }

  if (req.method === 'POST') {
    const { content, senderId, receiverId, offerId, requestId } = req.body;
    if (!content || !senderId || !receiverId) {
      return res.status(400).json({ error: 'content, senderId, and receiverId are required' });
    }
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        offerId,
        requestId,
      },
    });
    return res.status(201).json(message);
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 