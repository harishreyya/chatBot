import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions as any);
  // @ts-ignore
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid image id" });
  }

  try {
    const image = await prisma.generatedImage.findUnique({
      where: { id },
    });
// @ts-ignore
    if (!image || image.userId !== session.user.id) {
      return res.status(404).json({ error: "Image not found or unauthorized" });
    }

    await prisma.generatedImage.delete({
      where: { id },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
}
