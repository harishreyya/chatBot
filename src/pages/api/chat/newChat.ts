import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, title } = req.body;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const newChat = await prisma.chat.create({
      data: {
        userId,
        title: title || 'New Chat',
      },
    });

    res.status(200).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create new chat' });
  }
}
