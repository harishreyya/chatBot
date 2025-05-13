
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ChatPage() {
        // @ts-ignore
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(`/api/chat/listChats?userId=${chatId}`)
      .then((res) => res.json())
      .then((chats) => {
        const chat = chats.find((c: any) => c.id === chatId);
        if (chat) setMessages(chat.messages);
        console.log("chat",chat)
      })
      .catch(console.error);
  }, [chatId]);

  const sendMessage = async () => {
    const res = await fetch("/api/chat/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message: input }), 
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "user", content: input }, { role: "assistant", content: data.assistantReply }]);
    setInput("");
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Chat</h1>
      <div className="space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
