import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { subMinutes } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
  // @ts-ignore
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const chats = await prisma.chat.findMany({
       // @ts-ignore
      where: { userId: session.user.id },
      include: { messages: true },
    });

    const tenMinutesAgo = subMinutes(new Date(), 10);

    const emptyChatIdsToDelete = chats
      .filter(chat => chat.messages.length === 0 && new Date(chat.createdAt) < tenMinutesAgo)
      .map(chat => chat.id);

    if (emptyChatIdsToDelete.length > 0) {
      await prisma.chat.deleteMany({
        where: { id: { in: emptyChatIdsToDelete } },
      });
    }

    const previewChats = chats
      .filter(chat => chat.messages.length > 0)
      .map(chat => ({
        ...chat,
        preview: chat.messages[0]?.content.slice(0, 100) +
          (chat.messages[0]?.content.length > 100 ? "..." : "")
      }));

    res.status(200).json(previewChats);
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
}
