import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
//   @ts-ignore
  if (!session || !session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const apiResponse = await fetch('https://prod.api.market/api/v1/swift-api/gpt-3-5-turbo/chat/completions', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-magicapi-key': 'cmajmhr250001lb0468zv2s5s',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await apiResponse.json();
    const assistantReply = data.choices?.[0]?.message?.content || 'No response';

    await prisma.message.createMany({
      data: [
        { chatId, role: 'user', content: message },
        { chatId, role: 'assistant', content: assistantReply }
      ]
    });

    res.status(200).json({ assistantReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
