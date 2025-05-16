import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
//   @ts-ignore
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  const { chatId, title } = req.body;
  if (!chatId || !title) return res.status(400).json({ error: "Missing parameters" });

  try {
    const updatedChat = await prisma.chat.update({
        //   @ts-ignore
      where: { id: chatId, userId: session.user.id },
      data: { title },
    });
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update chat title' });
  }
}
