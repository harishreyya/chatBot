"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/layout";
import { FaUserCircle, FaRobot, FaSpinner } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  // @ts-ignore
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChat = async () => {
      const res = await fetch(`/api/chat/listChats`);
      const chats = await res.json();
      const chat = chats.find((c: any) => c.id === chatId);
      if (chat) setMessages(chat.messages);
    };

    loadChat();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Your Chat</h1>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded bg-gray-50 shadow-inner">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center mt-10">Start the conversation...</div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
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

        <div className="mt-4 p-2 bg-white border rounded flex gap-2 sticky bottom-4 shadow-md">
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
      </div>
    </Layout>
  );
}
