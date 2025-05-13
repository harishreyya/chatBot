import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
     //@ts-ignore
  if (!session || !session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const chats = await prisma.chat.findMany({
        //@ts-ignore
      where: { userId: session?.user?.id },
      include: { messages: true },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
}
