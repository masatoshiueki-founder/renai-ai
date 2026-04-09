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
  read?: boolean; // ユーザーメッセージのみ使用
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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

    // 800ms後に「既読」へ（AIが読んだ演出）
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, read: true } : m))
      );
      // 既読になってから少し経って入力中を表示
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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "エラーが発生しました。しばらくしてからもう一度お試しください。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#BEE3C8]">
      <Header isTyping={isTyping} />

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center mb-4 shadow-sm overflow-hidden">
                <KoiLogo size={52} />
              </div>
              <p className="text-[#2a6640] font-bold text-base mb-1">KoiAI</p>
              <p className="text-[#3d7a50]/70 text-xs mb-8">Love advice, powered by AI</p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                {[
                  "好きな人に連絡したいけど、どうすればいい？",
                  "彼氏/彼女とケンカしてしまった",
                  "告白するタイミングがわからない",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="text-left text-sm bg-white/70 rounded-2xl px-4 py-3 text-gray-600 hover:bg-white transition-colors shadow-sm"
                  >
                    {suggestion}
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

          {isTyping && (
            <div className="flex items-end gap-2 pt-1 animate-fade-slide-in">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <KoiLogo size={28} />
              </div>
              <div className="bg-white px-4 py-3 rounded-[18px] rounded-bl-[4px] shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
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

// ロゴSVGコンポーネント（page内で共有）
export function KoiLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ハート */}
      <path
        d="M18 30C18 30 5 21.5 5 13.5C5 9.36 8.36 6 12.5 6C14.86 6 16.96 7.1 18 8.82C19.04 7.1 21.14 6 23.5 6C27.64 6 31 9.36 31 13.5C31 21.5 18 30 18 30Z"
        fill="#FF4D6D"
      />
      {/* ハイライト */}
      <ellipse cx="13" cy="12" rx="3" ry="2" fill="white" opacity="0.35" transform="rotate(-20 13 12)" />
      {/* キラキラ */}
      <path d="M28 7L28.7 9L30.7 9L29.1 10.2L29.7 12.2L28 11L26.3 12.2L26.9 10.2L25.3 9L27.3 9Z" fill="#FFD700" />
    </svg>
  );
}
