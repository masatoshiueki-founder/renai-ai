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
    <div className="glamour-bg flex flex-col h-screen relative overflow-hidden">
      {/* 装飾ブロブ */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #FFE4AE, #FFB5C8)" }}
      />
      <div
        className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #FFB59A, #FF8FAB)" }}
      />

      <Header isTyping={isTyping} />

      <main className="relative flex-1 flex flex-col max-w-2xl mx-auto w-full overflow-hidden">
        {/* チャットエリア */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* ロゴ */}
              <div className="animate-float mb-6">
                <div
                  className="w-28 h-28 rounded-[2rem] flex items-center justify-center shadow-2xl"
                  style={{
                    background: "rgba(255,255,255,0.22)",
                    border: "1.5px solid rgba(255,255,255,0.45)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 12px 48px rgba(168,85,247,0.35), inset 0 1px 1px rgba(255,255,255,0.5)",
                  }}
                >
                  <KoiLogo size={68} />
                </div>
              </div>

              <h2 className="shimmer-text text-3xl font-extrabold mb-1 tracking-tight">
                KoiAI
              </h2>
              <p className="text-white/60 text-sm mb-2 font-medium">
                Love advice, powered by AI
              </p>
              <p className="text-white/50 text-xs mb-10">
                恋のお悩み、なんでも話してね 🌸
              </p>

              {/* サジェスト */}
              <div className="grid grid-cols-1 gap-2.5 w-full max-w-xs">
                {[
                  "好きな人に連絡したいけど、どうすればいい？",
                  "彼氏/彼女とケンカしてしまった",
                  "告白するタイミングがわからない",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-sm px-4 py-3 rounded-2xl text-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.28)",
                      backdropFilter: "blur(12px)",
                    }}
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

          {/* タイピングインジケーター */}
          {isTyping && (
            <div className="flex items-end gap-2 pt-1 animate-pop-in">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.22)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <KoiLogo size={26} />
              </div>
              <div
                className="px-5 py-3 rounded-[20px] rounded-bl-[6px] shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" />
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

/* ─── KoiAI ロゴ SVG ─── */
export function KoiLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FF8FAB" />
          <stop offset="55%"  stopColor="#FF6E6E" />
          <stop offset="100%" stopColor="#FFB59A" />
        </linearGradient>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      {/* ハート */}
      <path
        d="M20 33C20 33 5 23.5 5 14.5C5 10.09 8.58 6.5 13 6.5C15.6 6.5 17.92 7.74 20 9.7C22.08 7.74 24.4 6.5 27 6.5C31.42 6.5 35 10.09 35 14.5C35 23.5 20 33 20 33Z"
        fill="url(#heartGrad)"
      />
      {/* ハイライト */}
      <ellipse
        cx="14"
        cy="13"
        rx="3.5"
        ry="2"
        fill="white"
        opacity="0.4"
        transform="rotate(-25 14 13)"
      />
      {/* 星 */}
      <path
        d="M32 7L32.8 9.4L35.4 9.4L33.3 10.9L34.1 13.3L32 11.8L29.9 13.3L30.7 10.9L28.6 9.4L31.2 9.4Z"
        fill="url(#starGrad)"
      />
      {/* 小さい星 */}
      <path
        d="M7 9L7.5 10.5L9 10.5L7.8 11.4L8.3 12.9L7 12L5.7 12.9L6.2 11.4L5 10.5L6.5 10.5Z"
        fill="white"
        opacity="0.7"
      />
    </svg>
  );
}
