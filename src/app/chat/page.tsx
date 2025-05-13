
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChatListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    } else if (status === "authenticated") {
      fetch(`/api/chat/listChats`)
        .then((res) => res.json())
        .then(setChats)
        .catch(console.error);
    }
  }, [status, session, router]);

  const startNewChat = async () => {
    const res = await fetch("/api/chat/newChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
          // @ts-ignore
      body: JSON.stringify({ userId: session?.user?.id }),
    });
    const newChat = await res.json();
    router.push(`/chat/${newChat.id}`);
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>
      <button
        onClick={startNewChat}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + New Chat
      </button>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link href={`/chat/${chat.id}`} className="text-blue-600 underline">
              {chat.title || "Untitled Chat"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
