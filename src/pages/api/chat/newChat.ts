import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
  // @ts-ignore
  if (!session || !session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const date = new Date();
  const formattedDate = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const title = `Chat - ${formattedDate}`;

  try {
    const newChat = await prisma.chat.create({
      data: {
        // @ts-ignore
        userId: session?.user?.id,
        title,
      },
    });

    res.status(200).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create new chat' });
  }
}
