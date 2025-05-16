import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
//   @ts-ignore
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  const { chatId } = req.query;
  if (!chatId) return res.status(400).json({ error: "Missing chatId" });

  try {

    await prisma.message.deleteMany({
      where: { chatId: chatId as string },
    });

    await prisma.chat.delete({
      where: { id: chatId as string },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete chat and its messages' });
  }
}
