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
      className="px-4 py-3 flex items-end gap-3"
      style={{
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      {/* 入力欄 */}
      <div
        className="flex-1 flex items-end px-5 py-2.5 rounded-[28px]"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.7)",
          boxShadow: "0 2px 16px rgba(168,85,247,0.12), inset 0 1px 2px rgba(255,255,255,0.8)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="メッセージを入力…"
          disabled={isLoading}
          rows={1}
          className="w-full resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed max-h-32 scrollbar-hide"
          style={{ fontFamily: "var(--font-poppins), 'Hiragino Sans', sans-serif" }}
        />
      </div>

      {/* 送信ボタン（ハートアイコン） */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        aria-label="送信"
        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          canSend ? "btn-send" : "opacity-40 cursor-not-allowed"
        }`}
        style={
          !canSend
            ? { background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.3)" }
            : {}
        }
      >
        {/* ハートアイコン */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-white drop-shadow-sm"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </button>
    </div>
  );
}
