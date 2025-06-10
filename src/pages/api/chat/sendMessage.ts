import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
// @ts-ignore
  if (!session || !session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: message }
      ]
    });

    const assistantReply = completion.choices[0]?.message?.content?.trim() || "I'm not sure how to respond.";

    await prisma.message.createMany({
      data: [
        { chatId, role: 'user', content: message },
        { chatId, role: 'assistant', content: assistantReply }
      ]
    });

    console.log('OpenAI API response:', assistantReply);

    res.status(200).json({ assistantReply });
  } catch (error: any) {
    console.error('Error in /api/chat/sendMessage:', error);
    res.status(500).json({ error: 'Failed to get response from assistant' });
  }
}
