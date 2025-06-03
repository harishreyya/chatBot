"use client";
import Layout from "@/components/layout";
import Link from "next/link";
import "../app/chat/[chatId]/chat.css";

export default function HomePage() {
  return (
    <Layout>
     <div className="fixed inset-0 z-0">
        <img
          src="https://res.cloudinary.com/duoqzn6tv/image/upload/v1748940272/text-to-image/bllej76tuvxqmmsacepy.png"
          alt="Background"
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
      </div>

        <section className="relative home-container max-w-7xl mx-auto p-6 z-1">
          <div className="text-center mb-12">
            <p className="glow-text text-lg max-w-3xl mx-auto mb-8 font-semibold text-gray-800">
              Unlock the power of your creativity and curiosity! Use our Chatbot to get instant answers or create stunning images from text prompts using our advanced AI. Explore, create, and discover!
            </p>
          </div>

          <div className="card-grid gap-8">
            <Link
              href="/chat"
              className="group block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 bg-white border border-gray-200"
            >
              <div className="relative h-80 w-full">
                <img
                  src="https://res.cloudinary.com/duoqzn6tv/image/upload/v1748945426/text-to-image/zywbge9zx6kfqvdua3id.png"
                  alt="Chatbot"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-green-700 mb-2">Chatbot</h3>
                <p className="text-gray-600 text-base">
                  Ask questions and get instant answers with our powerful AI chatbot.
                </p>
              </div>
            </Link>

            <Link
              href="/textToImage"
              className="group block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 bg-white border border-gray-200"
            >
              <div className="relative h-80 w-full">
                <img
                  src="https://res.cloudinary.com/duoqzn6tv/image/upload/v1748935894/text-to-image/ai829k5oyuv3jdjko8mt.png"
                  alt="Text to Image"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">Text to Image</h3>
                <p className="text-gray-600 text-base">
                  Turn your creative prompts into visually striking images using AI.
                </p>
              </div>
            </Link>
          </div>
        </section>
      {/* </div> */}
    </Layout>
  );
}
