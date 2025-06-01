import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  // @ts-ignore
  if (!session || !session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const images = await prisma.generatedImage.findMany({
         // @ts-ignore
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
