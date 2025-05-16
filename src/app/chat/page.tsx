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

  if (status === "loading") {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex items-center justify-between p-4 border-b bg-white shadow">
          <h1 className="text-xl font-semibold">Your Conversations</h1>
          <button
            onClick={startNewChat}
            disabled={isCreatingChat}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isCreatingChat ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <FaPlus />
            {isCreatingChat ? "Creating..." : "New Chat"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingChats ? (
            <div className="flex items-center justify-center h-full">
              <FaSpinner className="animate-spin text-blue-600 text-2xl" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No conversations yet. Start a new one!</div>
          ) : (
            <ul className="space-y-2">
              {chats.map((chat) => (
                <li key={chat.id} className="flex items-center justify-between bg-white rounded shadow p-2">
                  {editingId === chat.id ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 border px-2 py-1 rounded mr-2"
                      />
                      <button
                        onClick={() => updateChatTitle(chat.id)}
                        disabled={loadingActionId === chat.id}
                        className={`text-green-600 hover:text-green-800 cursor-pointer ${
                          loadingActionId === chat.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loadingActionId === chat.id ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      </button>
                    </>
                  ) : (
                    <Link href={`/chat/${chat.id}`} className="flex-1 hover:underline cursor-pointer">
                      {chat.title}
                    </Link>
                  )}
                  <div className="flex items-center gap-2 ml-2">
                    {editingId !== chat.id && (
                      <button
                        onClick={() => {
                          setEditingId(chat.id);
                          setEditTitle(chat.title);
                        }}
                        className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
                        disabled={loadingActionId === chat.id}
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => deleteChat(chat.id)}
                      disabled={loadingActionId === chat.id}
                      className={`text-red-600 hover:text-red-800 cursor-pointer ${
                        loadingActionId === chat.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loadingActionId === chat.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
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

