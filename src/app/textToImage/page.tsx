"use client";
import Layout from "@/components/layout";
import { useState, useEffect, useRef } from "react";
import { FaDownload, FaTrash } from "react-icons/fa";
import "../chat/[chatId]/chat.css";

export default function TextToImage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [justGeneratedImage, setJustGeneratedImage] = useState<string | null>(null);
 const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchGeneratedImages = async () => {
    const res = await fetch("/api/textToImage/generated-images");
    const data = await res.json();
    setImages(data.images);
  };

  useEffect(() => {
    fetchGeneratedImages();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const res = await fetch("/api/textToImage/text-to-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) {
      const data = await res.json();
      setJustGeneratedImage(data.image.imageUrl);
      fetchGeneratedImages();
      setPrompt("");
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setJustGeneratedImage(null);
      }, 9000);
    } else {
      alert("Failed to generate image");
    }
    setLoading(false);
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download image");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    const res = await fetch(`/api/textToImage/deleteImage/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchGeneratedImages();
    } else {
      alert("Failed to delete image");
    }
  };

  return (
    <Layout>
      <div className="texttoimage-container">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">Text to Image Generator</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 input-section">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt..."
            className="flex-1 border border-gray-300 rounded px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className={`px-6 py-3 rounded font-medium text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {justGeneratedImage && (
          <div className="just-generated-container">
            <img
              src={justGeneratedImage}
              alt="Generated"
              className="rounded object-cover just-generated-image"
            />
            <button
              onClick={() => handleDownload(justGeneratedImage)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 inline-flex items-center transition"
            >
              <FaDownload className="mr-2" /> Download
            </button>
          </div>
        )}

        <div className="images-grid">
          {images.map((img) => (
            <div key={img.id} className="image-card">
              <a href={img.imageUrl} target="_blank" rel="noopener noreferrer">
                <img src={img.imageUrl} alt="Generated" className="rounded object-cover image-thumb" />
              </a>
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => handleDownload(img.imageUrl)}
                  className="bg-blue-600 text-white px-3 py-1 cursor-pointer rounded hover:bg-blue-700 flex items-center text-sm transition"
                >
                  <FaDownload className="mr-1" /> Download
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="bg-red-500 text-white cursor-pointer rounded-full p-2 hover:bg-red-600 transition"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}