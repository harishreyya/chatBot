"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout";
import { FaPlus, FaSpinner, FaTrash, FaEdit, FaSave } from "react-icons/fa";

export default function ChatListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") fetchChats();
  }, [status]);

  const fetchChats = async () => {
    setIsLoadingChats(true);
    const res = await fetch("/api/chat/listChats");
    const data = await res.json();
    setChats(data);
    setIsLoadingChats(false);
  };

  const startNewChat = async () => {
    setIsCreatingChat(true);
    const res = await fetch("/api/chat/newChat", { method: "POST" });
    const newChat = await res.json();
    router.push(`/chat/${newChat.id}`);
    setIsCreatingChat(false);
  };

  const updateChatTitle = async (chatId: string) => {
    setLoadingActionId(chatId);
    await fetch("/api/chat/updateTitle", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, title: editTitle }),
    });
    setEditingId(null);
    setLoadingActionId(null);
    fetchChats();
  };

  const deleteChat = async (chatId: string) => {
    setLoadingActionId(chatId);
    await fetch(`/api/chat/deleteChat?chatId=${chatId}`, { method: "DELETE" });
    setLoadingActionId(null);
    fetchChats();
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen relative bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <BackgroundCollage />

        <div className="flex items-center justify-between p-4 border-b bg-gray-900 shadow-sm relative z-10">
          <h1 className="text-2xl font-bold text-white">Your Conversations</h1>
          <button
            onClick={startNewChat}
            disabled={isCreatingChat}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isCreatingChat
                ? "bg-gray-500"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          >
            <FaPlus />
            {isCreatingChat ? "Creating..." : "New Chat"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
          {isLoadingChats ? (
            <div className="flex flex-col space-y-4 items-center">
              <h1 className="text-xl font-semibold mb-4 text-gray-800">
                Loading Conversations...
              </h1>
             <div className="flex flex-col space-y-3 w-full max-w-xl">
  {[1, 2, 3, 4, 5].map((_, idx) => (
    <div
      key={idx}
      className="h-12 z-index-1 bg-gray-700/70 animate-pulse rounded shadow-md"
    />
  ))}
</div>

            </div>
          ) : chats.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No conversations yet. Start a new one!
            </div>
          ) : (
            <ul className="divide-y divide-gray-700 max-w-4xl mx-auto">
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className="group relative flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-600 transition-all"
                  onMouseEnter={() => setHoveredChatId(chat.id)}
                  onMouseLeave={() => setHoveredChatId(null)}
                >
                  {editingId === chat.id ? (
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg focus:outline-none bg-gray-700 text-white"
                      />
                      <button
                        onClick={() => updateChatTitle(chat.id)}
                        disabled={loadingActionId === chat.id}
                        className={`text-green-400 hover:text-green-600 ${
                          loadingActionId === chat.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        {loadingActionId === chat.id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaSave />
                        )}
                      </button>
                    </div>
                  ) : (
                     <Link
                        href={`/chat/${chat.id}`}
                        className="hover:underline text-base font-medium text-white"
                      >
                    <div className="flex flex-col w-full relative">
                        {chat.title}
                      {hoveredChatId === chat.id && chat.preview && (
                        <div className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded shadow-lg w-full">
                          {chat.preview}
                        </div>
                      )}
                    </div>
                    </Link>
                  )}

                  <div className="flex gap-3 ml-4">
                    {editingId !== chat.id && (
                      <button
                        onClick={() => {
                          setEditingId(chat.id);
                          setEditTitle(chat.title);
                        }}
                        className="text-yellow-400 hover:text-yellow-600 cursor-pointer"
                        disabled={loadingActionId === chat.id}
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => deleteChat(chat.id)}
                      disabled={loadingActionId === chat.id}
                      className={`text-red-500 hover:text-red-700 ${
                        loadingActionId === chat.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {loadingActionId === chat.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </Layout>
  );
}

function BackgroundCollage() {
  const IMAGES = [
    "https://res.cloudinary.com/duoqzn6tv/image/upload/v1747720925/out-0_15_cst4lf.png",
    "https://res.cloudinary.com/duoqzn6tv/image/upload/v1747720923/out-0_14_b5qgoq.png",
    "https://res.cloudinary.com/duoqzn6tv/image/upload/v1747720923/out-0_16_svfzse.png",
    "https://res.cloudinary.com/duoqzn6tv/image/upload/v1747720922/out-0_19_btfp7l.png",
    "https://res.cloudinary.com/duoqzn6tv/image/upload/v1747720922/out-0_18_veqkor.png",
    "https://res.cloudinary.com/duoqzn6tv/image/upload/v1747720922/out-0_17_wxfavu.png",
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden mt-10">
      <div className="w-full h-full grid grid-cols-3 grid-rows-2 opacity-50 blur-[0.5px]">
        {IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`bg-${i}`}
            className="w-full h-full object-cover"
          />
        ))}
      </div>
    </div>
  );
}