import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  if (method === 'GET') {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }

  if (method === 'POST') {
    const { email } = body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email' });
    }
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(200).json(existing);
      const user = await prisma.user.create({ data: { email } });
      return res.status(201).json(user);
    } catch (e) {
      console.error('User creation error:', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}