"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

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
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pb-4">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="text-5xl mb-4">💌</div>
              <h2 className="text-xl font-semibold text-pink-400 mb-2">
                恋のお悩み、話してみて
              </h2>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                好きな人のこと、関係のこと、なんでも気軽に相談してね。
                <br />
                一緒に考えるよ。
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-xs">
                {[
                  "好きな人に連絡したいけど、どうすればいい？",
                  "彼氏/彼女とケンカしてしまった",
                  "告白するタイミングがわからない",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="text-left text-sm bg-white border border-pink-200 rounded-xl px-4 py-3 text-gray-600 hover:bg-pink-50 hover:border-pink-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white text-sm flex-shrink-0">
                💗
              </div>
              <div className="bg-white border border-pink-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </main>

      <footer className="text-center py-4 text-xs text-gray-400">
        💛 辛いときは専門家にも相談してね
      </footer>
    </div>
  );
}
