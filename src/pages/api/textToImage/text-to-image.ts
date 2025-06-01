import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
  // @ts-ignore
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await fetch("https://prod.api.market/api/v1/bridgeml/text-to-image/text-to-image", {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-magicapi-key": process.env.MAGIC_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        height: 1024,
        width: 1024,
        scheduler: "K_EULER",
        num_outputs: 1,
        guidance_scale: 0,
        negative_prompt: "worst quality, low quality",
        num_inference_steps: 4,
      }),
    });

    const data = await response.json();
    const imageUrl = data.result?.[0];

    if (!imageUrl) {
      return res.status(500).json({ error: "Failed to generate image" });
    }

    const cloudinaryRes = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: "text-to-image",
    });

    const generatedImage = await prisma.generatedImage.create({
      data: {
        // @ts-ignore
        userId: session.user.id,
        prompt,
        imageUrl: cloudinaryRes.secure_url,
      },
    });

    res.status(200).json({ image: generatedImage });
  } catch (error) {
    console.error("Error in text-to-image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
