import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
  // @ts-ignore
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing image id" });

  try {
    const deleted = await prisma.generatedImage.deleteMany({
      where: {
        id: id as string,
        // @ts-ignore
        userId: session.user.id,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Image not found or unauthorized" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
}
