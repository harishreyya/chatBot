"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout";
import {
  FaPlus,
  FaSpinner,
  FaTrash,
  FaEdit,
  FaSave,
  FaUserCircle,
  FaRobot,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // @ts-ignore
  const { chatId } = useParams();
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "authenticated") fetchChats();
  }, [status]);

  useEffect(() => {
    if (chats.length > 0 && chatId) {
      const activeChat = chats.find((c) => c.id === chatId);
      if (activeChat) setMessages(activeChat.messages);
      setIsLoadingMessages(false);
    }
  }, [chatId, chats]);

  const fetchChats = async () => {
    const res = await fetch("/api/chat/listChats");
    const data = await res.json();
    setChats(data);
  };

  const startNewChat = async () => {
    setIsCreatingChat(true);
    const res = await fetch("/api/chat/newChat", { method: "POST" });
    const newChat = await res.json();
    await fetchChats(); // refetch to ensure messages and preview available
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
    router.push("/chat");
    fetchChats();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setIsSending(true);
    const res = await fetch("/api/chat/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message: input }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: data.assistantReply },
    ]);
    setInput("");
    setIsSending(false);
    fetchChats();
  };

  return (
    <Layout>
      <div className="flex h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800">
        <aside className="w-72 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Chats</h2>
            <button
              onClick={startNewChat}
              disabled={isCreatingChat}
              className={`px-3 py-1 rounded text-sm transition cursor-pointer ${
                isCreatingChat ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FaPlus className="inline-block mr-1" /> New
            </button>
          </div>
          <ul className="divide-y divide-gray-800">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={`px-4 py-3 group transition ${
                  chat.id === chatId ? "bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
                } cursor-pointer`}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                {editingId === chat.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm rounded bg-gray-700 text-white border border-gray-600"
                    />
                    <button
                      onClick={() => updateChatTitle(chat.id)}
                      disabled={loadingActionId === chat.id}
                      className="text-green-400 hover:text-green-600 cursor-pointer"
                    >
                      {loadingActionId === chat.id ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/chat/${chat.id}`}
                      className="truncate text-sm hover:underline"
                    >
                      {chat.title}
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(chat.id);
                          setEditTitle(chat.title);
                        }}
                        className="text-yellow-400 hover:text-yellow-600 cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteChat(chat.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
                {hoveredChatId === chat.id && chat.preview && (
                  <div className="mt-1 text-xs text-gray-300">{chat.preview}</div>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded bg-gray-100 text-gray-900 shadow-inner">
            {isLoadingMessages ? (
              <div className="text-center text-gray-400">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-gray-500 text-center mt-10">Start the conversation...</div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && <FaRobot className="text-green-600 text-xl mt-1" />}
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] shadow whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-green-100 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && <FaUserCircle className="text-blue-600 text-xl mt-1" />}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-2 bg-white border rounded flex gap-2 sticky bottom-4 shadow-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSending) sendMessage();
              }}
              disabled={isSending}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              disabled={isSending}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                isSending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              }`}
            >
              {isSending ? <FaSpinner className="animate-spin" /> : "Send"}
            </button>
          </div>
        </main>
      </div>
    </Layout>
  );
}