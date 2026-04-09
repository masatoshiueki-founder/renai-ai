"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  read?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const msgId = Date.now().toString();
    const userMessage: Message = {
      id: msgId,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
      read: false,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, read: true } : m))
      );
      setTimeout(() => setIsTyping(true), 300);
    }, 800);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "エラーが発生しました");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "エラーが発生しました。しばらくしてからもう一度お試しください。",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7]">
      <Header isTyping={isTyping} />

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 scrollbar-thin">

          {messages.length === 0 ? (
            /* ── ウェルカム画面 ── */
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-20 h-20 rounded-3xl bg-white shadow-md flex items-center justify-center">
                <KoiLogo size={52} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">KoiAI</p>
                <p className="text-gray-400 text-xs mt-0.5">Love advice, powered by AI</p>
              </div>
              <div className="w-full max-w-xs mt-4 flex flex-col gap-2">
                {[
                  "好きな人に連絡したいけど、どうすればいい？",
                  "彼氏/彼女とケンカしてしまった",
                  "告白するタイミングがわからない",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-sm bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, i) => (
              <ChatMessage
                key={message.id}
                message={message}
                showAvatar={
                  message.role === "assistant" &&
                  (i === 0 || messages[i - 1].role !== "assistant")
                }
              />
            ))
          )}

          {/* タイピング */}
          {isTyping && (
            <div className="flex items-end gap-2 pt-1 animate-pop-in">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                <KoiLogo size={22} />
              </div>
              <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-[20px] rounded-bl-[5px]">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}

/* ── KoiAI ロゴ ── */
export function KoiLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FF8FAB" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
      </defs>
      <path
        d="M20 33C20 33 5 23.5 5 14.5C5 10.09 8.58 6.5 13 6.5C15.6 6.5 17.92 7.74 20 9.7C22.08 7.74 24.4 6.5 27 6.5C31.42 6.5 35 10.09 35 14.5C35 23.5 20 33 20 33Z"
        fill="url(#hg)"
      />
      <ellipse cx="14" cy="13" rx="3.5" ry="2" fill="white" opacity="0.4" transform="rotate(-25 14 13)" />
    </svg>
  );
}
