// "use client";
// import Layout from "@/components/layout";
// import { useState, useEffect } from "react";
// import { FaBars, FaSpinner, FaDownload } from "react-icons/fa";

// export default function TextToImage() {
//   const [prompt, setPrompt] = useState("");
//   const [images, setImages] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [generatedImage, setGeneratedImage] = useState<string | null>(null);

//   const fetchGeneratedImages = async () => {
//     const res = await fetch("/api/textToImage/generated-images");
//     const data = await res.json();
//     setImages(data.images.reverse()); // show newest first
//   };

//   useEffect(() => {
//     fetchGeneratedImages();
//   }, []);

//   const generateImage = async () => {
//     if (!prompt.trim()) return;
//     setLoading(true);
//     const res = await fetch("/api/textToImage/text-to-image", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });
//     if (res.ok) {
//       fetchGeneratedImages();
//       const data = await res.json();
//       setGeneratedImage(data.imageUrl);
//       setPrompt("");
//     } else {
//       alert("Failed to generate image");
//     }
//     setLoading(false);
//   };

//   const handleDownload = async (url: string) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = `generated-image-${Date.now()}.png`;
//       document.body.appendChild(link);
//       link.click();

//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       console.error("Download error:", error);
//       alert("Failed to download image");
//     }
//   };

//   return (
//     <Layout>
//       <div className="flex flex-col md:flex-row h-[calc(100vh-60px)]">
//         {/* Sidebar */}
//         <div
//           className={`bg-gray-900 text-white w-64 p-4 flex flex-col ${
//             showSidebar ? "block" : "hidden"
//           } md:block`}
//         >
//           <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
//             Generated Images
//           </h2>
//           <div className="flex-1 overflow-y-auto space-y-2">
//             {images.map((img) => (
//               <div
//                 key={img.id}
//                 className="flex flex-col items-center border border-gray-700 rounded p-2 hover:bg-gray-800 cursor-pointer"
//               >
//                 <img
//                   src={img.imageUrl}
//                   alt="Generated"
//                   className="w-full h-32 object-cover rounded mb-1"
//                 />
//                 <button
//                   onClick={() => handleDownload(img.imageUrl)}
//                   className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
//                 >
//                   <FaDownload className="inline mr-1" /> Download
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Panel */}
//         <div className="flex-1 flex flex-col p-4 bg-gray-100 relative">
//           {/* Toggle Sidebar Button for Mobile */}
//           <button
//             onClick={() => setShowSidebar(!showSidebar)}
//             className="md:hidden absolute top-4 right-4 z-10 p-2 bg-blue-600 text-white rounded shadow"
//           >
//             <FaBars />
//           </button>

//           <h1 className="text-2xl font-bold mb-4 text-gray-800">Text to Image</h1>

//           <div className="flex gap-2 mb-4">
//             <input
//               type="text"
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               placeholder="Enter prompt..."
//               className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-800"
//             />
//             <button
//               onClick={generateImage}
//               disabled={loading}
//               className={`flex items-center gap-1 px-4 py-2 rounded text-white transition ${
//                 loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin text-xs" /> Generating...
//                 </>
//               ) : (
//                 "Generate"
//               )}
//             </button>
//           </div>

//           {/* Generated Image Preview */}
//           {generatedImage && (
//             <div className="flex flex-col items-center mt-4">
//               <img
//                 src={generatedImage}
//                 alt="Generated"
//                 className="w-full md:w-1/2 rounded shadow mb-2"
//               />
//               <button
//                 onClick={() => handleDownload(generatedImage)}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//               >
//                 <FaDownload className="inline mr-1" /> Download Image
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }

// ------------------------
// "use client";
// import Layout from "@/components/layout";
// import { useState, useEffect } from "react";
// import { FaDownload, FaTrash } from "react-icons/fa";
// import "../chat/[chatId]/chat.css";

// export default function TextToImage() {
//   const [prompt, setPrompt] = useState("");
//   const [images, setImages] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [generatedImage, setGeneratedImage] = useState<string | null>(null);

//   const fetchGeneratedImages = async () => {
//     const res = await fetch("/api/textToImage/generated-images");
//     const data = await res.json();
//     setImages(data.images.reverse());
//   };

//   useEffect(() => {
//     fetchGeneratedImages();
//   }, []);

//   const generateImage = async () => {
//     if (!prompt.trim()) return;
//     setLoading(true);
//     const res = await fetch("/api/textToImage/text-to-image", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });
//     if (res.ok) {
//       const data = await res.json();
//       setGeneratedImage(data.imageUrl);
//       fetchGeneratedImages();
//       setPrompt("");
//     } else {
//       alert("Failed to generate image");
//     }
//     setLoading(false);
//   };

//   const handleDownload = async (url: string) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = `generated-image-${Date.now()}.png`;
//       document.body.appendChild(link);
//       link.click();

//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       console.error("Download error:", error);
//       alert("Failed to download image");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this image?")) return;
//     const res = await fetch(`/api/textToImage/deleteImage?id=${id}`, { method: "DELETE" });
//     if (res.ok) {
//       fetchGeneratedImages();
//     } else {
//       alert("Failed to delete image");
//     }
//   };

//   return (
//     <Layout>
//       <div className="flex flex-col md:flex-row h-[calc(100vh-60px)]">
//         {/* Sidebar - only on large screens */}
//         <aside className="block w-80 bg-gray-900 text-white p-4 overflow-y-auto border-r border-gray-700 aside-responsive">
//           <h2 className="text-lg font-semibold mb-4">Generated Images</h2>
//           <div className="grid grid-cols-3 gap-2">
//             {images.map((img) => (
//               <div key={img.id} className="relative group">
//                 <img
//                   src={img.imageUrl}
//                   alt="Generated"
//                   className="rounded cursor-pointer object-cover w-full h-20"
//                 />
//                 <button
//                   onClick={() => handleDelete(img.id)}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                 >
//                   <FaTrash size={12} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 flex flex-col p-4 overflow-y-auto">
//           <h1 className="text-2xl font-bold mb-4 text-gray-800">Text to Image</h1>

//           <div className="flex flex-col md:flex-row gap-2 mb-4">
//             <input
//               type="text"
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               placeholder="Enter prompt..."
//               className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
//             />
//             <button
//               onClick={generateImage}
//               disabled={loading}
//               className={`px-4 py-2 rounded text-white font-medium transition ${
//                 loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading ? "Generating..." : "Generate"}
//             </button>
//           </div>

//           {generatedImage && (
//             <div className="mt-auto text-center bg-gray-100 rounded p-4">
//               <img
//                 src={generatedImage}
//                 alt="Generated"
//                 className="mx-auto rounded shadow mb-2 max-w-full"
//               />
//               <button
//                 onClick={() => handleDownload(generatedImage)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
//               >
//                 <FaDownload className="mr-1" /> Download
//               </button>
//             </div>
//           )}
//         </main>

//         {/* Generated images in bottom for mobile only */}
//         <div className="bottom-display bg-gray-900 text-white p-4 border-t border-gray-700 overflow-x-auto">
//           <h2 className="text-lg font-semibold mb-2">Generated Images</h2>
//           <div className="flex gap-2 overflow-x-auto">
//             {images.map((img) => (
//               <div key={img.id} className="relative flex-shrink-0">
//                 <img
//                   src={img.imageUrl}
//                   alt="Generated"
//                   className="h-20 w-20 rounded object-cover"
//                 />
//                 <button
//                   onClick={() => handleDelete(img.id)}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                 >
//                   <FaTrash size={12} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }


// ------------------------------------
"use client";
import Layout from "@/components/layout";
import { useState, useEffect } from "react";
import { FaDownload, FaTrash } from "react-icons/fa";
import "../chat/[chatId]/chat.css"; 

export default function TextToImage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const fetchGeneratedImages = async () => {
    const res = await fetch("/api/textToImage/generated-images");
    const data = await res.json();
    setImages(data.images.reverse());
  };

  useEffect(() => {
    fetchGeneratedImages();
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
      setGeneratedImage(data.imageUrl);
      fetchGeneratedImages();
      setPrompt("");
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
    const res = await fetch(`/api/textToImage/deleteImage?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchGeneratedImages();
      if (expandedImage) setExpandedImage(null);
    } else {
      alert("Failed to delete image");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row h-[calc(100vh-60px)]">
        {/* Sidebar for Desktop */}
        <aside className="chat-sidebar p-4 text-white">
          <h2 className="text-lg font-semibold mb-4">Generated Images</h2>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.imageUrl}
                  alt="Generated"
                  className="rounded cursor-pointer object-cover w-full h-20"
                  onClick={() => setExpandedImage(img.imageUrl)}
                />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Text to Image</h1>

          {/* Input and Generate button */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter prompt..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={generateImage}
              disabled={loading}
              className={`px-4 py-2 rounded text-white font-medium transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* Show generated image immediately below input */}
          {generatedImage && (
            <div className="mt-2 text-center bg-gray-100 rounded p-4">
              <img
                src={generatedImage}
                alt="Generated"
                className="mx-auto rounded shadow mb-2 max-w-full cursor-pointer"
                onClick={() => setExpandedImage(generatedImage)}
              />
              <p className="text-xs text-gray-600">Click to expand</p>
            </div>
          )}

          {/* Expanded image preview */}
          {expandedImage && (
            <div className="mt-4 text-center bg-gray-100 rounded p-4">
              <img
                src={expandedImage}
                alt="Expanded"
                className="mx-auto rounded shadow mb-2 max-w-full"
              />
              <button
                onClick={() => handleDownload(expandedImage)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
              >
                <FaDownload className="mr-1" /> Download
              </button>
            </div>
          )}
        </main>

        {/* Bottom bar for mobile: Generated images */}
        <div className="bottom-display bg-gray-900 text-white p-4 border-t border-gray-700 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Generated Images</h2>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img) => (
              <div key={img.id} className="relative flex-shrink-0">
                <img
                  src={img.imageUrl}
                  alt="Generated"
                  className="h-20 w-20 rounded object-cover cursor-pointer"
                  onClick={() => setExpandedImage(img.imageUrl)}
                />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
