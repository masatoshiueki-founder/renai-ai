"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSend(text);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const canSend = !!text.trim() && !isLoading;

  return (
    <div
      className="px-3 py-2.5 flex items-end gap-2 border-t"
      style={{
        background: "linear-gradient(to right, #f0fdf4, #ecfdf5)",
        borderColor: "rgba(6,199,85,0.2)",
      }}
    >
      {/* 入力欄 */}
      <div
        className="flex-1 flex items-end bg-white rounded-2xl px-4 py-2 shadow-sm"
        style={{ border: "1.5px solid rgba(6,199,85,0.3)" }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="メッセージを入力"
          disabled={isLoading}
          rows={1}
          className="w-full resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed max-h-32 scrollbar-thin"
        />
      </div>

      {/* 送信ボタン */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        aria-label="送信"
        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          canSend
            ? "active:scale-90 shadow-lg"
            : "opacity-40 cursor-not-allowed"
        }`}
        style={
          canSend
            ? {
                background: "linear-gradient(135deg, #06C755 0%, #00b894 100%)",
                boxShadow: "0 4px 14px rgba(6,199,85,0.45)",
              }
            : { background: "#d1d5db" }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-white"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  );
}
